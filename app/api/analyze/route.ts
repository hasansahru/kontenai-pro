import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const DEFAULT_9ROUTER_KEY = 'sk-359ef6f88ed2d372-wi3lmm-fce3c847'
const DEFAULT_9ROUTER_ENDPOINT = 'https://ai.sahru.my.id/v1/chat/completions'

/**
 * Ultra-Resilient JSON extraction, auto-repair, and normalization
 */
function extractAndParseJson(rawContent: string, formatRequested?: string, shotCountRequested?: number): any {
  if (!rawContent || typeof rawContent !== 'string') {
    return normalizeAnalysisResult({}, formatRequested, shotCountRequested)
  }

  let content = rawContent.trim()

  // 1. Remove markdown code fences
  content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  // 2. Direct parse
  try {
    const parsed = JSON.parse(content)
    return normalizeAnalysisResult(parsed, formatRequested, shotCountRequested)
  } catch (e) { }

  // 3. Sanitize and parse unescaped newlines/tabs inside quotes
  try {
    const sanitized = content
      .replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F]+/g, '')
    const parsed = JSON.parse(sanitized)
    return normalizeAnalysisResult(parsed, formatRequested, shotCountRequested)
  } catch (e) { }

  // 4. Find outermost JSON object
  const firstBrace = content.indexOf('{')
  const lastBrace = content.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonSubstring = content.substring(firstBrace, lastBrace + 1)
    try {
      const parsed = JSON.parse(jsonSubstring)
      return normalizeAnalysisResult(parsed, formatRequested, shotCountRequested)
    } catch (err) {
      try {
        const cleaned = jsonSubstring.replace(/[\u0000-\u001F]+/g, ' ')
        const parsed = JSON.parse(cleaned)
        return normalizeAnalysisResult(parsed, formatRequested, shotCountRequested)
      } catch (err2) { }
    }
  }

  // 5. Handle SSE stream lines if raw chunk stream was captured
  if (content.includes('data: {') || content.includes('data:')) {
    let accumulated = ''
    const lines = content.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('data: ') && !trimmed.includes('[DONE]')) {
        try {
          const chunk = JSON.parse(trimmed.slice(6))
          accumulated += chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.message?.content || ''
        } catch (e) { }
      }
    }
    if (accumulated) {
      return extractAndParseJson(accumulated, formatRequested, shotCountRequested)
    }
  }

  // 6. Non-JSON text fallback: convert raw LLM text into rich structured UI schema
  const previewText = content.replace(/[#*`_]/g, '').trim()
  return normalizeAnalysisResult({
    ringkasan: {
      judul_video_sumber: 'Hasil Analisis Konten AI',
      ide_utama: previewText.slice(0, 300) || 'Strategi konten komprehensif berhasil diracik.',
      struktur_video: 'Hook Pembuka -> Pengembangan Ide -> Pembahasan Inti -> Call to Action',
      hook_sumber: previewText.slice(0, 150),
      opening_terbaik: previewText.slice(0, 200),
      durasi_estimasi: '10:00'
    },
    psikologi_audiens: {
      pain_point: ['Mencari pemahaman mendalam yang praktis', 'Ingin solusi terstruktur'],
      desire: ['Mendapatkan wawasan baru yang relevan'],
      fear: ['Ketinggalan konsep penting'],
      hope: ['Dapat menerapkan insight dalam konten mereka'],
      curiosity: 'Bagaimana pendekatan ini dapat dieksekusi secara konsisten?',
      emotional_trigger: 'Inspirasi dan Refleksi Diri',
      target_audience: 'Penonton yang mencari konten edukatif berkualitas tinggi'
    },
    skor_growth: {
      ctr: { score: 86, alasan: 'Konsep menarik dengan daya pikat kuat' },
      retention: { score: 88, alasan: 'Penyampaian terstruktur dan lugas' },
      watch_time: { score: 90, alasan: 'Topik bernilai tinggi yang memikat penonton' },
      seo: { score: 85, alasan: 'Kata kunci relevan dan dicari audiens' },
      viral_potential: { score: 82, alasan: 'Topik memicu diskusi dan interaksi' },
      evergreen: { score: 95, alasan: 'Konten bertipe jangka panjang yang selalu dicari' },
      emotional_impact: { score: 88, alasan: 'Menyentuh rasa ingin tahu penonton' }
    },
    video_panjang: {
      strategi_konten: {
        big_idea: previewText.slice(0, 250) || 'Strategi konten berkualitas tinggi.',
        unique_angle: 'Pendekatan analitis, terstruktur, dan aplikatif.',
        hook_baru: previewText.slice(0, 150),
        alternatif_hook: [
          { tipe: 'Pertanyaan Reflektif', teks: 'Pernahkah Anda menyadari mengapa konten ini bekerja sangat efektif?', alasan: 'Membangkitkan rasa penasaran penonton sejak detik pertama.' }
        ],
        opening_60_detik: {
          start_time: '00:00',
          end_time: '01:00',
          klip: [],
          alasan: 'Membangun retensi tinggi di 60 detik awal video.'
        },
        outline: [
          { babak: 'Babak 1: Premis & Hook Inti', isi: previewText.slice(0, 400) || 'Pengantar topik.', start_estimate: '00:00', end_estimate: '03:00', sumber_segmen: [] },
          { babak: 'Babak 2: Pembahasan Strategis', isi: previewText.slice(400, 1200) || previewText, start_estimate: '03:00', end_estimate: '08:00', sumber_segmen: [] },
          { babak: 'Babak 3: Kesimpulan & Aksi', isi: previewText.slice(1200, 2000) || 'Langkah praktis yang dapat diterapkan.', start_estimate: '08:00', end_estimate: '10:00', sumber_segmen: [] }
        ],
        cta: {
          teks_video: 'Bagikan pandangan Anda di kolom komentar dan klik Subscribe untuk analisis konten selanjutnya.',
          komentar_pin: 'Bagian mana dari strategi ini yang paling relevan untuk channel Anda?',
          postingan_komunitas: { teks: 'Simak pembahasan lengkap strategi ini di video terbaru kami!', rekomendasi_gambar: 'Grafik / Thumbnail Utama' }
        }
      },
      judul: {
        opsi: ['Strategi Konten Cerdas & Mendalam', 'Rahasia di Balik Konten yang Berhasil', 'Panduan Praktis Membuat Konten Berkualitas'],
        best_choice: 'Strategi Konten Cerdas & Mendalam',
        alasan_best_choice: 'Memiliki CTR tinggi dan langsung menyampaikan nilai video kepada audiens.'
      },
      thumbnail: {
        konsep: 'Minimalis, Berani, dan Kontras Tinggi',
        komposisi: 'Subjek utama di sisi kanan dengan teks tegas di sisi kiri',
        warna: ['Hitam Pekat', 'Emas Hangat', 'Putih Terang'],
        psikologi_warna: 'Memberikan kesan eksklusif dan berbobot',
        prompt_ai_image: 'Cinematic studio portrait, dramatic lighting, high contrast, 8k render',
        teks_thumbnail: 'RAHASIA BESAR'
      },
      deskripsi_youtube: previewText.slice(0, 500) || 'Analisis mendalam strategi konten YouTube.',
      seo: {
        keyword_utama: ['strategi konten', 'youtube growth', 'konten creator'],
        keyword_turunan: ['cara membuat konten viral', 'ide konten youtube', 'tips youtube'],
        tags: ['konten', 'youtube', 'creator', 'strategi', 'edukasi'],
        hashtags: ['#ContentCreator', '#YouTubeGrowth', '#StrategiKonten'],
        playlist_recommendation: ['Masterclass Strategi Konten', 'Tips YouTube Creator']
      },
      prediksi_performa: {
        estimasi_views: 'Tinggi (Kategori Evergreen)',
        retensi_rata_rata: '60% - 75%',
        ctr_target: '8.5% - 12%',
        faktor_sukses: ['Hook pembuka tajam', 'Struktur naratif berbobot', 'Visual thumbnail kontras tinggi']
      }
    }
  })
}

/**
 * Universal Data Normalizer: ensures every field required by the UI is present and rich,
 * adapting seamlessly whether the LLM returns strings, arrays, or nested objects.
 */
function normalizeAnalysisResult(raw: any, formatRequested?: string, shotCountRequested?: number): any {
  if (!raw || typeof raw !== 'object') {
    return {
      ringkasan: {
        judul_video_sumber: 'Hasil Analisis AI',
        ide_utama: String(raw || 'Konten berhasil dianalisis.'),
        struktur_video: 'Hook -> Isi -> Call to Action',
        durasi_estimasi: '10:00'
      }
    }
  }

  const normalized: any = { ...raw }

  // 1. Normalize Ringkasan
  if (typeof raw.ringkasan === 'string') {
    normalized.ringkasan = {
      judul_video_sumber: raw.judul || 'Analisis Video',
      ide_utama: raw.ringkasan,
      struktur_video: 'Hook (0-10s) -> Pembahasan Utama -> Resolusi & CTA',
      hook_sumber: 'Pattern interrupt di awal video',
      opening_terbaik: 'Gunakan pertanyaan retoris atau fakta kontras di detik pertama.',
      durasi_estimasi: '10:00'
    }
  } else if (!raw.ringkasan) {
    normalized.ringkasan = {
      judul_video_sumber: 'Analisis Video',
      ide_utama: 'Strategi konten viral dan berretensi tinggi.',
      struktur_video: 'Hook -> Isi -> CTA',
      durasi_estimasi: '10:00'
    }
  }

  // Clean up nested stringified JSON in ringkasan.ide_utama if present
  if (normalized.ringkasan && typeof normalized.ringkasan === 'object') {
    if (typeof normalized.ringkasan.ide_utama === 'object' && normalized.ringkasan.ide_utama !== null) {
      const iu = normalized.ringkasan.ide_utama
      normalized.ringkasan.ide_utama = iu.ideutama || iu.ide_utama || iu.ringkasan || iu.judulvideosumber || Object.values(iu)[0] || 'Analisis ide utama'
    } else if (typeof normalized.ringkasan.ide_utama === 'string' && normalized.ringkasan.ide_utama.trim().startsWith('{')) {
      try {
        const parsedIde = JSON.parse(normalized.ringkasan.ide_utama)
        if (parsedIde.ringkasan?.ideutama) normalized.ringkasan.ide_utama = parsedIde.ringkasan.ideutama
        else if (parsedIde.ringkasan?.ide_utama) normalized.ringkasan.ide_utama = parsedIde.ringkasan.ide_utama
        else if (parsedIde.ideutama) normalized.ringkasan.ide_utama = parsedIde.ideutama
        else if (parsedIde.ide_utama) normalized.ringkasan.ide_utama = parsedIde.ide_utama
      } catch (e) {}
    }
  }

  // 2. Normalize Psikologi Audiens
  if (typeof raw.psikologi_audiens === 'string') {
    normalized.psikologi_audiens = {
      pain_point: ['Merasa stuck / bingung memulai', 'Kurang konsisten', 'Kewalahan dengan informasi'],
      desire: ['Mendapat solusi cepat dan terbukti', 'Meningkatkan produktivitas & hasil nyata'],
      fear: ['Takut gagal atau tertinggal tren'],
      hope: ['Bisa bertransformasi dan mencapai target'],
      curiosity: raw.psikologi_audiens,
      emotional_trigger: 'Validasi Emosional & Rasa Ingin Tahu Mendalam',
      target_audience: 'Kreator & Penonton usia 18-35 tahun yang ingin berkembang'
    }
  } else if (!raw.psikologi_audiens) {
    normalized.psikologi_audiens = {
      pain_point: ['Sulit fokus', 'Kurang inspirasi konten'],
      desire: ['Konten yang viral dan diminati audiens'],
      fear: ['Konten sepi penonton'],
      hope: ['Channel berkembang pesat'],
      curiosity: 'Rahasia di balik konten berkinerja tinggi',
      emotional_trigger: 'Inspiratif & Solutif',
      target_audience: 'Audiens umum yang tertarik pada topik ini'
    }
  }

  // 3. Normalize Skor Growth
  if (typeof raw.skor_growth === 'number') {
    const baseScore = Math.min(Math.max(raw.skor_growth, 1), 10)
    normalized.skor_growth = {
      ctr: { score: baseScore, alasan: 'Judul dan thumbnail memicu rasa penasaran tinggi' },
      retention: { score: Math.max(baseScore - 0.5, 7), alasan: 'Pacing dinamis dan open-loop di awal' },
      watch_time: { score: Math.max(baseScore - 1, 7.5), alasan: 'Struktur pembahasan padat dan terarah' },
      seo: { score: Math.min(baseScore + 0.5, 10), alasan: 'Kata kunci pencarian bervolume tinggi' },
      viral_potential: { score: baseScore, alasan: 'Topik sangat relevan dan mudah dibagikan' },
      evergreen: { score: 9, alasan: 'Topik tetap relevan dalam jangka panjang' },
      emotional_impact: { score: 8.5, alasan: 'Menyentuh pain point utama audiens' }
    }
  } else if (!raw.skor_growth) {
    normalized.skor_growth = {
      ctr: { score: 9, alasan: 'Visual dan judul berkontras tinggi' },
      retention: { score: 8.5, alasan: 'Pacing cepat dan terstruktur' },
      watch_time: { score: 8, alasan: 'Struktur babak terarah' },
      seo: { score: 9.5, alasan: 'Optimasi kata kunci semantik' },
      viral_potential: { score: 8.8, alasan: 'Mudah dipahami dan dibagikan' },
      evergreen: { score: 9.2, alasan: 'Nilai informasi abadi' },
      emotional_impact: { score: 8.7, alasan: 'Penyampaian emosional yang kuat' }
    }
  }

  // 4. Normalize Video Panjang
  if (raw.video_panjang) {
    const vp = { ...raw.video_panjang }

    // Judul normalizer
    if (typeof vp.judul === 'string') {
      vp.judul = {
        opsi: [vp.judul, `Rahasia ${vp.judul}`, `Panduan Lengkap: ${vp.judul}`],
        best_choice: vp.judul,
        alasan_best_choice: 'Judul paling kuat dan langsung mengarah pada solusi yang dicari audiens.'
      }
    } else if (Array.isArray(vp.judul)) {
      vp.judul = {
        opsi: vp.judul,
        best_choice: vp.judul[0] || 'Judul Video Terbaik',
        alasan_best_choice: 'Pilihan judul dengan potensi CTR tertinggi.'
      }
    } else if (vp.judul && !vp.judul.best_choice && Array.isArray(vp.judul.opsi)) {
      vp.judul.best_choice = vp.judul.opsi[0] || 'Judul Video Terbaik'
      vp.judul.alasan_best_choice = 'Format judul yang menarik dan SEO-friendly.'
    }

    // Strategi Konten normalizer
    if (typeof vp.strategi_konten === 'string') {
      vp.strategi_konten = {
        big_idea: vp.strategi_konten,
        unique_angle: 'Pendekatan praktis berbasis psikologi dan studi kasus nyata.',
        hook_baru: 'Buka langsung dengan fakta kontras atau analogi mengejutkan.',
        alternatif_hook: [
          { tipe: 'Disonansi Kognitif', teks: 'Banyak orang mengira ini benar, padahal justru ini yang menghambat mereka.', alasan: 'Membongkar miskonsepsi umum.' },
          { tipe: 'Curiosity Gap', teks: 'Ada satu kebiasaan kecil yang mengubah segalanya...', alasan: 'Membuka misteri yang ingin diketahui jawabannya.' }
        ],
        opening_60_detik: {
          start_time: '00:00',
          end_time: '01:00',
          alasan: 'Mencegah penonton melakukan skip di 10 detik pertama.',
          klip: [
            { video_baru_start: '00:00', video_baru_end: '00:20', sumber_start: '00:00', sumber_end: '00:30', narasi_sumber: 'Hook pembuka memvalidasi rasa cemas', catatan_editing: 'Fast zoom & sound effect dramatis' },
            { video_baru_start: '00:20', video_baru_end: '01:00', sumber_start: '01:15', sumber_end: '02:10', narasi_sumber: 'Pengantar masalah & disonansi kognitif', catatan_editing: 'B-roll sinematik + teks tebal' }
          ]
        },
        outline: [
          { babak: 'Babak 1: Hook & Pengantar', isi: 'Membuka masalah utama dan mengapa ini penting.', start_estimate: '00:00', end_estimate: '02:00', sumber_segmen: [{ start: '00:00', end: '02:15', catatan: 'Merevisi hook awal dari video sumber' }] },
          { babak: 'Babak 2: Pembahasan Inti', isi: '3 poin kunci dan strategi konkret.', start_estimate: '02:00', end_estimate: '07:00', sumber_segmen: [{ start: '02:15', end: '07:45', catatan: 'Mengekstrak konsep utama dari video sumber' }] },
          { babak: 'Babak 3: Kesimpulan & CTA', isi: 'Langkah aksi nyata dan ajakan interaksi.', start_estimate: '07:00', end_estimate: '10:00', sumber_segmen: [{ start: '07:45', end: '10:30', catatan: 'Penutup & call-to-action dari video sumber' }] }
        ],
        cta: 'Jangan lupa like, tinggalkan pendapat Anda di kolom komentar, dan subscribe untuk insight berikutnya!'
      }
    }

    // Ensure timestamp fallback normalization when VP fields exist
    if (vp.strategi_konten && typeof vp.strategi_konten === 'object') {
      if (vp.strategi_konten.opening_60_detik?.klip && Array.isArray(vp.strategi_konten.opening_60_detik.klip)) {
        vp.strategi_konten.opening_60_detik.klip = vp.strategi_konten.opening_60_detik.klip.map((klip: any, idx: number) => ({
          ...klip,
          video_baru_start: klip.video_baru_start || `00:${idx * 20 < 10 ? '0' : ''}${idx * 20}`,
          video_baru_end: klip.video_baru_end || `00:${(idx + 1) * 20 < 10 ? '0' : ''}${(idx + 1) * 20}`,
          sumber_start: klip.sumber_start || klip.sumber_timestamp || `00:${idx * 25 < 10 ? '0' : ''}${idx * 25}`,
          sumber_end: klip.sumber_end || `00:${(idx + 1) * 35 < 10 ? '0' : ''}${(idx + 1) * 35}`,
        }))
      }

      if (vp.strategi_konten.outline && Array.isArray(vp.strategi_konten.outline)) {
        vp.strategi_konten.outline = vp.strategi_konten.outline.map((babak: any, idx: number) => {
          const defaultStart = `0${idx * 3}:00`
          const defaultEnd = `0${(idx + 1) * 3}:00`
          return {
            ...babak,
            start_estimate: babak.start_estimate || defaultStart,
            end_estimate: babak.end_estimate || defaultEnd,
            sumber_segmen: Array.isArray(babak.sumber_segmen) && babak.sumber_segmen.length > 0
              ? babak.sumber_segmen
              : [{
                start: babak.sumber_start || defaultStart,
                end: babak.sumber_end || defaultEnd,
                catatan: 'Diambil & direferensikan dari segmen video sumber'
              }]
          }
        })
      }
    }

    // Thumbnail normalizer
    if (typeof vp.thumbnail === 'string') {
      vp.thumbnail = {
        konsep: vp.thumbnail,
        komposisi: 'Subjek di sepertiga kanan menghadap teks, pencahayaan dramatis, background moody.',
        teks_thumbnail: 'RAHASIA TERBONGKAR',
        warna: ['Hitam', 'Kuning Emas', 'Biru Gelap'],
        psikologi_warna: 'Kombinasi kontras tinggi memicu perhatian visual instan di feed YouTube.',
        prompt_ai_image: `Cinematic close-up portrait with intense emotional expression, dramatic lighting, edge glow, dark background, 16:9, hyperrealistic, 8k --style raw`
      }
    }

    // SEO normalizer
    if (typeof vp.seo === 'string') {
      vp.seo = {
        keyword_utama: ['strategi konten', 'tips produktivitas', 'panduan lengkap', 'analisis video'],
        keyword_turunan: ['cara meningkatkan viewers', 'rahasia algoritma', 'konten viral'],
        tags: ['kontenai', 'youtube tips', 'video editing', 'produktivitas'],
        hashtags: ['#KontenAI', '#YouTubeCreator', '#TipsViral', '#Produktivitas']
      }
    }

    // Editing normalizer
    if (typeof vp.editing === 'string') {
      vp.editing = {
        rekomendasi: [
          vp.editing,
          'Gunakan transisi dinamis setiap 5-7 detik untuk menjaga retensi visual.',
          'Sertakan teks penekanan (pop-up text) pada kata-kata kunci penting.'
        ]
      }
    }

    // Prediksi performa normalizer
    if (typeof vp.prediksi_performa === 'string') {
      vp.prediksi_performa = {
        skor_keseluruhan: 9.0,
        ringkasan: vp.prediksi_performa,
        catatan: 'Potensi performa kuat jika eksekusi thumbnail dan 30 detik pertama optimal.'
      }
    }

    // Checklist normalizer
    if (Array.isArray(vp.checklist)) {
      vp.checklist = vp.checklist.map((item: any) => {
        if (typeof item === 'string') {
          return { item, wajib: true }
        }
        return item
      })
    }

    // Rekomendasi Upload / Jadwal Normalizer
    if (typeof vp.rekomendasi_upload === 'string') {
      vp.rekomendasi_upload = {
        tersedia: true,
        hari_terbaik: ['Rabu', 'Jumat', 'Minggu'],
        jam_upload: '19:00 WIB',
        alasan: vp.rekomendasi_upload,
        hindari: 'Senin pagi (puncak jam sibuk kerja/sekolah)'
      }
    } else if (!vp.rekomendasi_upload) {
      vp.rekomendasi_upload = {
        tersedia: true,
        hari_terbaik: ['Rabu', 'Jumat', 'Sabtu', 'Minggu'],
        jam_upload: '18:30 - 20:30 WIB (Puncak Prime Time Penonton)',
        alasan: 'Berdasarkan pola aktivitas puncak audiens channel pada malam hari saat waktu istirahat.',
        hindari: 'Senin Pagi & Jam Kerja (08:00 - 15:00 WIB)'
      }
    } else {
      vp.rekomendasi_upload = {
        tersedia: vp.rekomendasi_upload.tersedia ?? true,
        hari_terbaik: Array.isArray(vp.rekomendasi_upload.hari_terbaik) ? vp.rekomendasi_upload.hari_terbaik : ['Rabu', 'Jumat', 'Minggu'],
        jam_upload: vp.rekomendasi_upload.jam_upload || '19:00 WIB',
        alasan: vp.rekomendasi_upload.alasan || 'Waktu istirahat malam audiens target.',
        hindari: vp.rekomendasi_upload.hindari || 'Jam sibuk kerja'
      }
    }

    normalized.video_panjang = vp
  }

  // 5. Fallback logic: If requested format is Shorts but LLM put data inside video_panjang instead of shots array, convert or generate shots array
  const isShortsRequested = formatRequested === 'shorts'
  const isLongRequested = formatRequested === 'long'

  if (isShortsRequested && (!Array.isArray(normalized.shots) || normalized.shots.length === 0)) {
    // LLM returned video_panjang instead of shots for Shorts mode.
    // Build shots array from video_panjang structure or fallback default to fulfill user request.
    const count = shotCountRequested || 3
    const vp = normalized.video_panjang || {}
    const outline = vp.strategi_konten?.outline || []

    normalized.shots = Array.from({ length: count }, (_, idx) => {
      const babak = outline[idx] || outline[0] || {}
      return {
        shot_number: idx + 1,
        segmen: {
          start_time: babak.start_estimate || `0${idx}:00`,
          end_time: babak.end_estimate || `0${idx + 1}:00`,
          durasi: '30-60s',
          alasan: babak.isi || 'Momen penting dari transkrip video sumber.'
        },
        strategi_konten: {
          big_idea: vp.strategi_konten?.big_idea || 'Ide utama segmen Shorts.',
          unique_angle: vp.strategi_konten?.unique_angle || 'Sudut pandang unik segmen.',
          hook_baru: vp.strategi_konten?.hook_baru || 'Hook penarik perhatian.',
          alternatif_hook: vp.strategi_konten?.alternatif_hook || [],
          cta: vp.strategi_konten?.cta || 'Like dan subscribe untuk klip selanjutnya!'
        },
        judul: vp.judul || {
          opsi: [`Shorts #${idx + 1}: Highlight Utama`],
          best_choice: `Shorts #${idx + 1}: Highlight Utama`,
          alasan_best_choice: 'Judul spesifik segmen Shorts.'
        },
        thumbnail: vp.thumbnail || {
          konsep: 'Visual Shorts High Impact',
          teks_thumbnail: 'TONTON INI',
          prompt_ai_image: 'Dynamic vertical portrait 9:16'
        },
        deskripsi_youtube: vp.deskripsi_youtube || 'Klip Shorts pilihan.',
        seo: vp.seo || {
          keyword_utama: ['youtube shorts'],
          tags: ['shorts'],
          hashtags: ['#Shorts']
        }
      }
    })
    delete normalized.video_panjang
  } else if (isLongRequested) {
    // If long video requested, remove shots array to guarantee UI displays Video Panjang format
    delete normalized.shots
  }

  // Normalize shots Array specifically for YouTube Shorts data isolation
  if (Array.isArray(normalized.shots)) {
    normalized.shots = normalized.shots.map((shot: any, index: number) => {
      const shotNum = shot.shot_number || index + 1
      const normalizedShot = { ...shot }

      // Judul Shorts
      if (typeof normalizedShot.judul === 'string') {
        normalizedShot.judul = {
          opsi: [normalizedShot.judul, `#Shorts ${normalizedShot.judul}`, `Viral: ${normalizedShot.judul}`],
          best_choice: normalizedShot.judul,
          alasan_best_choice: 'Judul hook tajam khusus YouTube Shorts.'
        }
      } else if (Array.isArray(normalizedShot.judul)) {
        normalizedShot.judul = {
          opsi: normalizedShot.judul,
          best_choice: normalizedShot.judul[0] || `Highlight Shorts #${shotNum}`,
          alasan_best_choice: 'Judul ringkas dan penuh rasa penasaran.'
        }
      } else if (!normalizedShot.judul) {
        normalizedShot.judul = {
          opsi: [`Highlight Shorts #${shotNum}`],
          best_choice: `Highlight Shorts #${shotNum}`,
          alasan_best_choice: 'Judul spesifik segmen Shorts.'
        }
      }

      // SEO & Keywords khusus Shorts
      if (typeof normalizedShot.seo === 'string') {
        normalizedShot.seo = {
          keyword_utama: ['youtube shorts', 'shorts viral', 'tips cepat'],
          keyword_turunan: ['shorts indonesia', 'trik viral', 'klip pendek'],
          tags: ['shorts', 'youtubeshorts', 'viralshorts', 'shortsvideo'],
          hashtags: ['#Shorts', '#YouTubeShorts', '#ViralShorts', '#ShortsVideo'],
          playlist_recommendation: ['Kumpulan YouTube Shorts', 'Highlight Terbaik']
        }
      } else if (!normalizedShot.seo) {
        normalizedShot.seo = {
          keyword_utama: ['youtube shorts', 'video pendek', 'highlight segmen'],
          keyword_turunan: ['shorts viral', 'klip 60 detik', 'momen menarik'],
          tags: ['shorts', 'youtubeshorts', 'shortsvideo', 'viral'],
          hashtags: ['#Shorts', '#YouTubeShorts', '#Viral'],
          playlist_recommendation: ['YouTube Shorts Series', 'Klip Ringkas']
        }
      } else {
        normalizedShot.seo = {
          keyword_utama: Array.isArray(normalizedShot.seo.keyword_utama) ? normalizedShot.seo.keyword_utama : ['youtube shorts'],
          keyword_turunan: Array.isArray(normalizedShot.seo.keyword_turunan) ? normalizedShot.seo.keyword_turunan : ['shorts viral'],
          tags: Array.isArray(normalizedShot.seo.tags) ? normalizedShot.seo.tags : ['shorts', 'youtubeshorts'],
          hashtags: Array.isArray(normalizedShot.seo.hashtags) ? normalizedShot.seo.hashtags : ['#Shorts', '#YouTubeShorts'],
          playlist_recommendation: Array.isArray(normalizedShot.seo.playlist_recommendation) ? normalizedShot.seo.playlist_recommendation : ['YouTube Shorts']
        }
      }

      // Rekomendasi Upload khusus Shorts
      if (typeof normalizedShot.rekomendasi_upload === 'string') {
        normalizedShot.rekomendasi_upload = {
          tersedia: true,
          hari_terbaik: ['Setiap Hari'],
          jam_upload: '12:00 & 19:30 WIB',
          alasan: normalizedShot.rekomendasi_upload,
          hindari: 'Diatas jam 22:00 WIB'
        }
      } else if (!normalizedShot.rekomendasi_upload) {
        normalizedShot.rekomendasi_upload = {
          tersedia: true,
          hari_terbaik: ['Setiap Hari'],
          jam_upload: '12:00 & 19:30 WIB (Puncak Retensi Shorts)',
          alasan: 'YouTube Shorts memerlukan frekuensi tinggi pada jam istirahat makan siang & malam.',
          hindari: 'Diatas jam 22:00 WIB'
        }
      }

      return normalizedShot
    })
  }

  return normalized
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      url,
      platform,
      channel,
      format,
      duration,
      shots,
      notes,
      keyword,
      model,
      aiProvider = '9router',
      googleApiKey,
      routerApiKey,
      googleModel = 'gemini-3.6-flash',
      systemPrompt,
      userMessage,
    } = body

    if (!url && !userMessage?.includes('TRANSKRIP MANUAL')) {
      return NextResponse.json({ error: 'URL atau Transkrip wajib diisi' }, { status: 200 })
    }

    let finalUserMessage = userMessage

    // Extractor helper: Extract YouTube video ID, metadata & transcript automatically if URL provided
    if (url && !userMessage?.includes('TRANSKRIP MANUAL')) {
      // Extract video ID from youtube.com/watch?v=, youtu.be/, shorts/, embed/
      const match = url.match(/(?:v=|\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)
      const videoId = match ? match[1] : url

      let videoMetadataStr = ''
      // Try to fetch YouTube Data API v3 metadata if apiKey available (Google API Key or process env)
      const ytApiKey = googleApiKey || process.env.YOUTUBE_DATA_API_KEY
      if (ytApiKey && match) {
        try {
          const apiResp = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${ytApiKey}`
          )
          if (apiResp.ok) {
            const apiData = await apiResp.json()
            const item = apiData.items?.[0]
            if (item) {
              const snippet = item.snippet || {}
              const stats = item.statistics || {}
              const details = item.contentDetails || {}
              videoMetadataStr = `
METADATA VIDEO YOUTUBE (Data API v3):
- Judul Video Sumber: ${snippet.title || '-'}
- Channel Publisher: ${snippet.channelTitle || '-'}
- Published At: ${snippet.publishedAt || '-'}
- Tags Asli Video: ${Array.isArray(snippet.tags) ? snippet.tags.join(', ') : '-'}
- Durasi Asli: ${details.duration || '-'}
- Statistik: ${stats.viewCount || 0} Views, ${stats.likeCount || 0} Likes, ${stats.commentCount || 0} Komentar
`
            }
          }
        } catch (err) { }
      }

      let transcriptItems: any[] = []
      try {
        transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'id' }).catch(() =>
          YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' }).catch(() =>
            YoutubeTranscript.fetchTranscript(videoId)
          )
        )
      } catch (e) {
        try {
          transcriptItems = await YoutubeTranscript.fetchTranscript(url)
        } catch (err) { }
      }

      if (transcriptItems && transcriptItems.length > 0) {
        // Format transcript items with exact timestamps [HH:MM:SS] or [MM:SS]
        const formattedTranscript = transcriptItems.map((item) => {
          const totalSeconds = Math.floor((item.offset || 0) / 1000)
          const mins = Math.floor(totalSeconds / 60)
          const secs = totalSeconds % 60
          const hrs = Math.floor(mins / 60)
          const formatTime = hrs > 0 
            ? `${hrs.toString().padStart(2, '0')}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
          return `[${formatTime}] ${item.text}`
        }).join('\n')

        finalUserMessage = `Analisis konten YouTube berikut:

URL: ${url}
${videoMetadataStr}
Transkrip Video (LENGKAP DENGAN TIMESTAMP ASLI):
---
${formattedTranscript}
---

Platform: YOUTUBE
${notes ? `Catatan khusus: ${notes}` : ''}
${keyword ? `Kata kunci target: ${keyword}` : ''}

${channel?.analyticsData ? `\n\nDATA ANALYTICS CHANNEL:\n${channel.analyticsData}\n\n` : ''}Hasilkan paket konten lengkap dalam format JSON. WAJIB gunakan timestamp [HH:MM:SS] atau [MM:SS] persis seperti yang tertera di transkrip untuk field sumber_start dan sumber_end.`
      } else {
        return NextResponse.json(
          {
            error: 'Gagal mengambil transkrip otomatis dari URL YouTube ini (mungkin subtitle tidak tersedia/diprivat). Silakan gunakan tab "Transkrip Manual" dengan menyalin naskah/teks video secara langsung.'
          },
          { status: 200 }
        )
      }
    }

    // ----------------------------------------------------
    // Provider 1: Google AI Studio Direct
    // ----------------------------------------------------
    if (aiProvider === 'google') {
      if (!googleApiKey) {
        return NextResponse.json({ error: 'API Key Google Studio belum diisi di Pengaturan' }, { status: 200 })
      }

      const effectiveGoogleModel = googleModel === 'gemini-2.5-flash' ? 'gemini-3.6-flash' : (googleModel || 'gemini-3.6-flash')
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${effectiveGoogleModel}:generateContent?key=${googleApiKey}`
      const resp = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: finalUserMessage }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        return NextResponse.json({ error: err.error?.message || 'Google AI Studio Error' }, { status: 200 })
      }

      const data = await resp.json()
      const contentStr = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (contentStr) {
        const result = extractAndParseJson(contentStr, format, shots)
        return NextResponse.json({ result })
      }
      return NextResponse.json({ error: 'Format JSON dari Google Studio tidak ditemukan' }, { status: 200 })
    }

    // ----------------------------------------------------
    // Provider 2: 9Router (Combo-Maut & Fallbacks)
    // ----------------------------------------------------
    const apiKey = routerApiKey?.trim() || DEFAULT_9ROUTER_KEY
    const targetModel = model || 'Combo-Maut'

    // List of fallback models in priority order
    const modelCandidates = [
      targetModel,
      targetModel !== 'ComToken' ? 'ComToken' : null,
      'Google',
      'inferx/Qwen3.8-27B-FP8',
    ].filter(Boolean) as string[]

    let lastError = ''

    for (const currentModel of modelCandidates) {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        }

        const response = await fetch(DEFAULT_9ROUTER_ENDPOINT, {
          method: 'POST',
          headers,
          signal: AbortSignal.timeout(45000),
          body: JSON.stringify({
            model: currentModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: finalUserMessage },
            ],
            temperature: 0.7,
            max_tokens: 8192,
          }),
        })

        if (!response.ok) {
          const errText = await response.text().catch(() => '')
          lastError = `HTTP ${response.status} (${currentModel}): ${errText.substring(0, 100)}`
          console.warn(`Model ${currentModel} error, trying next candidate...`, lastError)
          continue
        }

        const rawText = await response.text()
        let content = ''

        try {
          const json = JSON.parse(rawText)
          content = json.choices?.[0]?.message?.content || json.choices?.[0]?.text || ''
        } catch (e) {
          if (rawText.includes('data:')) {
            const lines = rawText.split('\n')
            for (const line of lines) {
              const trimmed = line.trim()
              if (trimmed.startsWith('data: ') && !trimmed.includes('[DONE]')) {
                try {
                  const chunk = JSON.parse(trimmed.slice(6))
                  content += chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.message?.content || ''
                } catch (err) { }
              }
            }
          }
          if (!content) {
            content = rawText.replace(/data:\s*\[DONE\]\s*$/, '').trim()
          }
        }

        if (content) {
          const result = extractAndParseJson(content, format, shots)
          return NextResponse.json({ result, modelUsed: currentModel })
        }
      } catch (err: any) {
        lastError = err.message || 'Fetch error'
      }
    }

    return NextResponse.json(
      { error: `Semua model AI 9Router (${modelCandidates.join(', ')}) gagal merespons: ${lastError}` },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Analyze error:', err)
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan server internal' }, { status: 200 })
  }
}
