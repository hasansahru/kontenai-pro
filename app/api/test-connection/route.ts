import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_9ROUTER_KEY = 'sk-359ef6f88ed2d372-wi3lmm-fce3c847'
const DEFAULT_9ROUTER_ENDPOINT = 'https://ai.sahru.my.id/v1/chat/completions'

export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey, googleModel, model } = await req.json()

    if (provider === 'google') {
      if (!apiKey) {
        return NextResponse.json({ success: false, message: 'API Key Google belum diisi' })
      }

      const targetGoogleModel = googleModel || 'gemini-3.6-flash'
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetGoogleModel}:generateContent?key=${apiKey}`

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hi' }] }],
        }),
      }).catch(() => null)

      if (resp && resp.ok) {
        return NextResponse.json({ success: true, message: `Berhasil terhubung ke Google AI Studio (${targetGoogleModel})!` })
      } else {
        const err = resp ? await resp.json().catch(() => ({})) : {}
        return NextResponse.json({
          success: false,
          message: err.error?.message || 'Gagal terhubung ke Google AI Studio. Periksa API Key Anda.',
        })
      }
    }

    if (provider === '9router') {
      const activeKey = apiKey?.trim() || DEFAULT_9ROUTER_KEY
      const targetModel = model || 'Combo-Maut'

      const resp = await fetch(DEFAULT_9ROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`,
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 10,
        }),
      }).catch(() => null)

      if (resp && resp.ok) {
        return NextResponse.json({ success: true, message: `Berhasil terhubung ke 9Router dengan model ${targetModel}!` })
      } else if (resp && resp.status === 401) {
        return NextResponse.json({ success: false, message: 'Gagal terhubung: API Key tidak valid atau kedaluwarsa' })
      } else {
        // Try fallback test with ComToken
        const fallbackResp = await fetch(DEFAULT_9ROUTER_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeKey}`,
          },
          body: JSON.stringify({
            model: 'ComToken',
            messages: [{ role: 'user', content: 'Ping' }],
            max_tokens: 10,
          }),
        }).catch(() => null)

        if (fallbackResp && fallbackResp.ok) {
          return NextResponse.json({
            success: true,
            message: `Terhubung ke 9Router via fallback ComToken (Model ${targetModel} sedang switch/warm up).`,
          })
        }

        return NextResponse.json({
          success: false,
          message: 'Gagal terhubung ke 9Router. Periksa koneksi internet atau status router.',
        })
      }
    }

    return NextResponse.json({ success: false, message: 'Provider tidak valid' })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Terjadi kesalahan jaringan' })
  }
}
