# KontenAI Pro 🚀
> **AI Content Intelligence & Creator Studio for YouTube & TikTok**

KontenAI Pro adalah platform kecerdasan konten berbasis AI yang membantu kreator menganalisis video kompetitor/referensi, mengekstrak pola viral, dan menghasilkan paket produksi konten baru yang 100% orisinal lengkap dengan skrip scene-by-scene, hook viral, judul high-CTR, strategi SEO, dan prompt visual thumbnail.

---

## ✨ Fitur Utama

- 🧠 **Deep Reverse-Engineering Video**: Membongkar ide utama, pacing struktur, hook pembuka, dan mekanisme emosional dari video referensi.
- 🎯 **Viral Hook Generation (0-3 Detik)**: Menghasilkan ragam hook berbasis Disonansi Kognitif, Kesenjangan Informasi, Emosi Ekstrem, dan Paradoks.
- 🎬 **Scene & Script Generation**: Menghasilkan naskah lengkap per-shot untuk format **Shorts/TikTok** atau outline terstruktur + Opening 60 Detik untuk **Video Panjang**.
- 🖼️ **Thumbnail Concept & AI Image Prompt**: Rekomendasi komposisi warna, psikologi visual, dan prompt Midjourney/DALL-E fotorealistik siap pakai.
- 📈 **Audience Psychology & Growth Score**: Penilaian potensi viral, retensi penonton, CTR, SEO, dan kalibrasi performa.
- 🌐 **Multi-Provider AI Gateway**: Terintegrasi langsung dengan **9Router API** (didukung model `Combo-Maut`, `ComToken`, `Claude 5`, `Gemini 3.7`, `Qwen 3.8`) dan Google AI Studio.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Library**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) dengan LocalStorage Persistence
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Memulai Proyek

### 1. Kloning & Instalasi Dependensi
```bash
git clone https://github.com/username/kontenai-pro.git
cd kontenai-pro
npm install
```

### 2. Konfigurasi Environment (Opsional)
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Konfigurasi Model AI (9Router)

Aplikasi ini sudah dikonfigurasi secara bawaan untuk terhubung ke 9Router:
- **Endpoint**: `https://ai.sahru.my.id/v1`
- **Default Model**: `Combo-Maut` (dengan failover otomatis ke `ComToken`)

Anda dapat mengubah API Key atau beralih ke model lain kapan saja melalui menu **Pengaturan** di aplikasi.

---

## 📄 Lisensi
Didistribusikan di bawah lisensi MIT. Silakan gunakan dan kembangkan secara bebas!
