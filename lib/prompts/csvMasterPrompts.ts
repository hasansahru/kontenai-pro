export interface MasterPrompt {
    id: string
    title: string
    category: 'longform' | 'shorts' | 'religi' | 'thumbnail' | 'seo'
    targetChannel: string
    description: string
    performanceInsight: string
    template: string
    variables: string[]
}

export const MASTER_PROMPTS: MasterPrompt[] = [
    {
        id: 'prompt-longform',
        title: 'Naskah Video Durasi Panjang (8-12 Menit)',
        category: 'longform',
        targetChannel: 'Suara Filsuf / Nalar Senyap',
        description: 'Naskah edukasi relaksasi batin & filsafat dengan pembuka provokatif memvalidasi emosi penonton.',
        performanceInsight: 'Berdasarkan data Suara Filsuf (126K views, 60.9K jam watch time) - Metafora & Kintsugi mencapai CTR hingga 9.83%.',
        template: `Bertindaklah sebagai Content Strategist & Scriptwriter profesional untuk channel Filsafat/Self-Development berformat Edukasi Relaksasi Batin.

Berdasarkan data performa terbaik:
- Tema: Kebijaksanaan Lokal / Sufi / Filsafat Stoa & Kintsugi.
- Tonus: Tenang, hangat, reflektif, menyentuh kedalaman batin.

Tolong buatkan naskah video YouTube lengkap (durasi 10 menit) dengan struktur:
1. Title Options (3 variasi judul tinggi CTR dengan rumus pertanyaan reflektif & nama tokoh/filosofi).
2. Hook (0:00 - 1:00): Pembuka provokatif yang memvalidasi emosi penonton (rasa lelah, cemas, hampa).
3. Inti Pembahasan (3 Poin Utama): Solusi konseptual berlandaskan studi kasus / ajaran filsafat.
4. Refleksi & Reframe Jiwa: Aplikasi praktis untuk kehidupan modern.
5. Outro & Call to Action: Penutup lembut yang mengajak berdiskusi di kolom komentar.

Topik Pilihan: "{topik}"`,
        variables: ['topik'],
    },
    {
        id: 'prompt-shorts',
        title: 'Naskah YouTube Shorts / TikTok (60 Detik)',
        category: 'shorts',
        targetChannel: 'Nalar Senyap / Suara Filsuf',
        description: '5 naskah video pendek 60 detik berstruktur Hook visual, body concept, plot twist, & CTA.',
        performanceInsight: 'Pendekatan Psikologi Ego & Hubungan menghasilkan watch time tinggi & angka retensi konsisten.',
        template: `Bertindaklah sebagai Content Creator Specialist khusus video pendek (Shorts/Reels/TikTok).

Buatkan 5 naskah video Shorts (durasi max 60 detik) berdasarkan tema hubungan & pengembangan diri berkinerja tinggi.

Format Setiap Script:
- Hook Visual & Audio (0-3 detik): Kata-kata pembuka yang langsung menghentikan scroll penonton.
- Body Concept (4-45 detik): Pesan padat, tajam, dan langsung menohok ego atau kesadaran penonton.
- Plot Twist / Insight Utama (46-55 detik): Pemahaman baru yang mencerahkan.
- Call to Action (56-60 detik): Ajak simpan/bagikan jika merasa relevan.

Topik Shorts 1: Pernikahan & Hubungan (Tema: {topik1})
Topik Shorts 2: Menghadapi Zaman Edan (Tema: {topik2})
Topik Shorts 3: Self-Acceptance (Tema: {topik3})
Topik Shorts 4: Mengendalikan Amarah & Ego (Tema: {topik4})
Topik Shorts 5: Ketenangan Batin (Tema: {topik5})`,
        variables: ['topik1', 'topik2', 'topik3', 'topik4', 'topik5'],
    },
    {
        id: 'prompt-religi',
        title: 'Naskah Hikmah Religi & Keberkahan Hidup (Tutur Kyai)',
        category: 'religi',
        targetChannel: 'Tutur Kyai',
        description: 'Naskah ceramah Islami & hikmah kehidupan yang menyejukkan, santun, tanpa menghakimi.',
        performanceInsight: 'Analisis CSV Tutur Kyai menunjukkan CTR hingga 16.67% pada video keberkahan rumah tangga & rezeki.',
        template: `Bertindaklah sebagai Penulis Naskah Edukasi Religi Islami & Hikmah Kehidupan berpendekatan sejuk, bijak, tanpa menghakimi.

Berdasarkan data performa tinggi channel "Tutur Kyai":
- Tema Fokus: Keberkahan Rumah Tangga, Rahasia Waktu & Rezeki, Taubat & Perbaikan Diri.
- Tonus: Menyentuh, relatable dengan kehidupan modern, sarat hikmah ulama/kiai.

Buatkan naskah video Shorts / Video Pendek 60 detik dengan struktur:
1. Hook (0-5 detik): Masalah nyata dalam rumah tangga/kehidupan sehari-hari (contoh: "{masalah_utamas}").
2. Insight Hikmah (6-40 detik): Penjelasan spiritual/nasihat kiai tentang akar penyebab keberkahan yang dicabut.
3. Solusi Amalan Ringan (41-55 detik): 1-2 amalan sederhana penenang hati & penarik keberkahan.
4. Penutup (56-60 detik): Doa singkat & pengingat lembut.`,
        variables: ['masalah_utama'],
    },
    {
        id: 'prompt-thumbnail',
        title: 'AI Thumbnail & Text-to-Image Prompt (Midjourney / DALL-E 3)',
        category: 'thumbnail',
        targetChannel: 'Semua Channel',
        description: 'Prompt visual sinematik estetis dengan efek Kintsugi, lighting dramatis & high contrast.',
        performanceInsight: 'Elemen visual Kintsugi & tone dramatis meningkatkan CTR sebesar 9.83% - 10.53%.',
        template: `Create a cinematic, emotionally resonant YouTube thumbnail background. 
Style: Minimalist digital painting with deep moody lighting, dramatic gold leaf accents, hyper-detailed texture, high contrast.
Concept: {visual_concept} (Kintsugi style), surrounded by deep navy and dark charcoal smoke. 
Mood: Philosophical, tranquil, healing, mysterious. 
Aspect Ratio: 16:9 (--ar 16:9)`,
        variables: ['visual_concept'],
    },
    {
        id: 'prompt-seo',
        title: 'Paket SEO YouTube (Judul, Deskripsi & Tag)',
        category: 'seo',
        targetChannel: 'Semua Channel',
        description: 'Generasi metadata YouTube lengkap: 5 variasi judul CTR, deskripsi teroptimasi SEO, chapter, & 20 tag.',
        performanceInsight: 'Mengombinasikan Keyword Curiosity Gap + Solusi Spesifik memperluas impresi pencarian YouTube.',
        template: `Bertindaklah sebagai SEO YouTube Specialist.

Buatkan paket metadata YouTube lengkap untuk topik: "{topik_seo}".

Output yang dibutuhkan:
1. 5 Variasi Judul (Gabungan Curiosity Gap + High CTR Keywords).
2. Deskripsi YouTube (Paragraf 1: Hook & Ringkasan SEO, Paragraf 2: Timestamps/Chapter, Paragraf 3: Hashtags relevan).
3. 20 Tag YouTube Relevan (Kombinasi Broad, Specific, dan Long-tail keywords seperti: filsafat hidup, cara tenang hadapi masalah, kintsugi jepang, fahruddin faiz, motivasi hidup).`,
        variables: ['topik_seo'],
    },
]

export const CSV_PERFORMANCE_INSIGHTS = [
    {
        channel: 'Suara Filsuf',
        views: '126.312',
        watchTime: '60.910 jam',
        impressions: '1,4 JT',
        topThemes: [
            { topic: 'Semar & Kebijaksanaan Jawa', views: '37K', ctr: '4.92%' },
            { topic: 'Ronggowarsito (Zaman Edan)', views: '7.8K', ctr: '6.73%' },
            { topic: 'Retakan Itu Emas: Kintsugi', views: '5.2K', ctr: '9.83% (Tertinggi)' },
            { topic: 'Imam Syafi\'i & Umar bin Khattab', views: '5K+', ctr: '5.4%' },
        ]
    },
    {
        channel: 'Nalar Senyap',
        views: '6.351',
        watchTime: '432 jam',
        impressions: '85.4K',
        topThemes: [
            { topic: 'Hubunganmu Melelahkan... Atau Egomu?', views: '1.9K', ctr: '6.2%' },
            { topic: 'Psikologi Overthinking & Healing', views: '1.2K', ctr: '5.8%' },
            { topic: 'Bicara Pada Diri Sendiri Malam Hari', views: '980', ctr: '7.1%' },
        ]
    },
    {
        channel: 'Tutur Kyai',
        views: '8.979',
        watchTime: '310 jam',
        impressions: '112K',
        topThemes: [
            { topic: 'Dapur Cantik Tapi Tidak Berkah', views: '880', ctr: '16.67% (Sangat Tinggi)' },
            { topic: 'Mencari Barokah Dengan Cara Unik', views: '1.0K', ctr: '10.53%' },
            { topic: 'Rahasia Waktu Yang Hilang', views: '1.1K', ctr: '7.69%' },
        ]
    }
]
