import { NextRequest, NextResponse } from 'next/server'

// This route handles the 9Router combo_maut_chat MCP call server-side
// Since MCP tools run in the Antigravity environment, we simulate the call
// In production, this would call the actual 9Router API

export async function POST(req: NextRequest) {
  try {
    const { model, aiProvider, googleApiKey, routerApiKey, googleModel, systemPrompt, userMessage } = await req.json()

    if (aiProvider === 'google') {
      if (!googleApiKey) {
        return NextResponse.json({ error: 'API Key Google Studio belum diisi di Pengaturan' }, { status: 400 })
      }

      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent?key=${googleApiKey}`
      
      const resp = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            parts: [{ text: userMessage }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          }
        }),
      })

      if (!resp.ok) {
        const err = await resp.json()
        return NextResponse.json({ error: err.error?.message || 'Google AI Studio Error' }, { status: 500 })
      }

      const data = await resp.json()
      try {
        const contentStr = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (contentStr) {
          const parsed = JSON.parse(contentStr)
          return NextResponse.json({ result: parsed })
        }
      } catch (e) {
        console.error("Failed to parse Google JSON:", e)
      }
      return NextResponse.json({ error: 'Format JSON dari Google Studio tidak ditemukan' }, { status: 500 })
    }

    // Default to 9Router
    const routerEndpoints = [
      'https://ai.sahru.my.id/v1/chat/completions',
    ]

    for (const endpoint of routerEndpoints) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (routerApiKey) {
          headers['Authorization'] = `Bearer ${routerApiKey}`
        }

        const resp = await fetch(endpoint, {
          method: 'POST',
          headers,
          signal: AbortSignal.timeout(60000), // increased timeout to 60s for massive JSON
          body: JSON.stringify({
            model: model || 'Combo-maut',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            response_format: { type: "json_object" },
            stream: false
          }),
        })

        if (!resp.ok) {
          const errText = await resp.text().catch(() => '')
          let errMsg = `9Router API Error: ${resp.status} ${resp.statusText}`
          try {
             const errJson = JSON.parse(errText)
             errMsg = errJson?.error?.message || errMsg
          } catch(e) {}
          return NextResponse.json({ error: errMsg }, { status: resp.status })
        }

        const rawText = await resp.text()
        let content = ''

        try {
          // Attempt standard JSON response
          const data = JSON.parse(rawText)
          content = data.choices?.[0]?.message?.content || ''
        } catch (e) {
          // Fallback if the response is an SSE stream despite stream: false
          if (rawText.includes('data: {')) {
            const lines = rawText.split('\n')
            for (const line of lines) {
              if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                try {
                  const chunk = JSON.parse(line.slice(6))
                  const chunkContent = chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.message?.content || ''
                  content += chunkContent
                } catch(err) {}
              }
            }
          } else {
            throw new Error(`Invalid response format from 9Router: ${rawText.substring(0, 100)}...`)
          }
        }

        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            return NextResponse.json({ result: JSON.parse(jsonMatch[0]) })
          } catch (e) {
            console.error("9Router JSON Parse Error:", e, "Raw content:", content)
            return NextResponse.json({ error: '9Router menghasilkan format JSON yang tidak valid/terpotong.' }, { status: 500 })
          }
        } else {
          return NextResponse.json({ error: '9Router tidak mengembalikan format JSON yang diharapkan.' }, { status: 500 })
        }
      } catch (err: any) {
        console.error("9Router Fetch Error:", err)
        return NextResponse.json({ error: err.message || 'Gagal menghubungi 9Router.' }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Semua endpoint 9Router gagal dihubungi.' }, { status: 500 })
  } catch (err: any) {
    console.error("MCP Chat route error:", err)
    return NextResponse.json({ error: 'MCP chat failed' }, { status: 500 })
  }
}

function generateDemoResult(model: string, userMessage: string, systemPrompt: string) {
  const isTikTok = systemPrompt?.toLowerCase().includes('tiktok') || userMessage?.toLowerCase().includes('tiktok') || false

  return {
    ringkasan: {
      judul_video_sumber: "Judul Video Asli (Demo)",
      ide_utama: "[DEMO MODE] Video membahas topik relevan dengan storytelling kuat.",
      struktur_video: "Hook -> Agitasi -> Solusi",
      hook_sumber: "Pernah merasa stuck?",
      opening_terbaik: "Gunakan pendekatan emosional sejak detik pertama.",
      durasi_estimasi: "03:45"
    },
    psikologi_audiens: {
      pain_point: ["Merasa stuck", "Usaha tidak dihargai"],
      desire: ["Ingin diakui", "Sukses instan"],
      fear: ["Kegagalan total"],
      hope: ["Bisa berubah besok"],
      curiosity: "Apa rahasia 1% top performer?",
      emotional_trigger: "Frustrasi vs Harapan",
      target_audience: "Pekerja keras usia 18-35 tahun"
    },
    skor_growth: {
      ctr: { score: 9.5, alasan: "Visual sangat memicu klik" },
      retention: { score: 8, alasan: "Pacing cepat di awal" },
      watch_time: { score: 7.5, alasan: "Durasi medium" },
      seo: { score: 9, alasan: "Keyword relevan tinggi" },
      viral_potential: { score: 8.5, alasan: "Topik relatable" },
      evergreen: { score: 10, alasan: "Bukan tren sesaat" },
      emotional_impact: { score: 9, alasan: "Sangat emosional" }
    },
    video_panjang: isTikTok ? undefined : {
      strategi_konten: {
        big_idea: "Sukses bukan dari kerja keras, tapi kerja cerdas",
        unique_angle: "Membongkar mitos produktivitas toksik",
        hook_baru: "Kerja 12 jam sehari? Kamu sedang merusak masa depanmu.",
        alternatif_hook: [
          { tipe: "Paradoks", teks: "Semakin malas kamu, semakin sukses kamu.", alasan: "Memicu rasa ingin tahu" }
        ],
        opening_60_detik: {
          start_time: "00:00",
          end_time: "01:00",
          klip: [
            {
              video_baru_start: "00:00",
              video_baru_end: "00:15",
              sumber_start: "01:00",
              sumber_end: "01:15",
              narasi_sumber: "Ini yang orang kaya tidak beri tahu...",
              catatan_editing: "Zoom in cepat"
            }
          ],
          alasan: "Membuat audiens kaget"
        },
        outline: [
          {
            babak: "Pendahuluan",
            isi: "Mitos kerja keras",
            start_estimate: "01:00",
            end_estimate: "03:00",
            sumber_segmen: [{ start: "02:00", end: "04:00", catatan: "Fakta sejarah" }]
          }
        ],
        cta: {
          teks_video: "Subscribe untuk fakta mengejutkan lainnya.",
          komentar_pin: "Setuju tidak kalau kerja keras itu mitos?",
          postingan_komunitas: { teks: "Video baru tayang!", rekomendasi_gambar: "Screenshot dari video" }
        }
      },
      momen_highlight_sumber: [{ start_time: "02:30", end_time: "03:00", durasi: "30 detik", alasan: "Momen emosional" }],
      judul: {
        opsi: ["Mitos Produktivitas", "Rahasia Top 1%"],
        best_choice: "Berhenti Menyalahkan Keadaan: Filosofi Stoikisme yang Mengubah Hidupku",
        alasan_best_choice: "Sangat SEO friendly"
      },
      thumbnail: {
        konsep: "High contrast",
        komposisi: "Rule of thirds",
        warna: ["Hitam", "Kuning Emas"],
        psikologi_warna: "Kuning memicu optimisme",
        prompt_ai_image: "A cinematic shot of a person standing at a crossroads, glowing golden light, 16:9, hyperrealistic",
        teks_thumbnail: "KERJA KERAS = BOHONG"
      },
      deskripsi_youtube: "Berhenti menyalahkan keadaan luar! 🛑 Kebanyakan orang merasa terjebak karena mereka fokus pada hal yang tidak bisa mereka kontrol.\n\nStoikisme mengajarkan kita untuk menggeser fokus 100% ke respons internal kita. Coba trik 3 hal ini besok pagi dan rasakan bedanya!\n\n👇 Drop komentar kalau kamu setuju dan FOLLOW untuk insight psikologi praktis setiap hari!",
      seo: {
        keyword_utama: ["produktivitas"],
        keyword_turunan: ["kerja cerdas"],
        tags: ["sukses"],
        hashtags: ["#produktivitas"],
        playlist_recommendation: ["Tips Sukses"]
      },
      editing: { rekomendasi: ["Gunakan sound effect swoosh"] },
      prediksi_performa: { ringkasan: "Akan viral di kalangan pekerja", skor_keseluruhan: 8.8, catatan: "Sangat kuat di menit awal" },
      checklist: [{ item: "Cek resolusi 4K", wajib: true }],
      rekomendasi_upload: { tersedia: true, hari_terbaik: ["Jumat"], jam_upload: "19:00", alasan: "Prime time", hindari: "Senin pagi" }
    },
    shots: isTikTok ? [
      {
        shot_number: 1,
        segmen: { start_time: "01:00", end_time: "01:30", durasi: "30 detik", alasan: "Hook kuat" },
        strategi_konten: {
          big_idea: "Fokus ke dalam",
          unique_angle: "Stoikisme modern",
          hook_baru: "Gak usah pusingin omongan orang",
          alternatif_hook: [],
          outline: [{ babak: "Inti", isi: "Penjelasan stoikisme" }],
          cta: "Follow me!"
        },
        judul: { opsi: [], best_choice: "Cara Bodo Amat yang Benar", alasan_best_choice: "Relatable" },
        thumbnail: {
          konsep: "Muka cuek",
          komposisi: "Center",
          warna: ["Biru"],
          psikologi_warna: "Tenang",
          prompt_ai_image: "A confident person, blue background, 9:16",
          teks_thumbnail: "BODO AMAT"
        },
        deskripsi_youtube: "Tips stoikisme",
        seo: { keyword_utama: ["stoikisme"], keyword_turunan: [], tags: [], hashtags: [], playlist_recommendation: [] },
        editing: { rekomendasi: ["Fast cut"] },
        prediksi_performa: { ringkasan: "Bagus untuk TikTok", skor_keseluruhan: 9, catatan: "Loopable" },
        checklist: [{ item: "Caption tebal", wajib: true }]
      }
    ] : undefined
  }
}
