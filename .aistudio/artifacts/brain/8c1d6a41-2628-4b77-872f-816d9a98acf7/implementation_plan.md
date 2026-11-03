# Perombakan Total Desain Estetik Minimalis & Glassmorphism FZTOOLS

Rencana komprehensif untuk merombak seluruh modul alat dan komponen antarmuka FZTOOLS | RIZ UNIVERSE menjadi desain modern, estetik minimalis, dengan sentuhan glassmorphism bersih, border halus, dan bayangan lembut serta penegakan aturan anti-slop.

## User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan berikut didasarkan pada jawaban klarifikasi pengguna dan pedoman Universal Frontend Design:

- **Confirmed Decision 1**: Prioritas utama adalah perombakan total seluruh modul tool (`BratTool`, `QrTool`, `IndoMemeTool`, `FakeTtCommentTool`, `FileConverterTool`, `SarcasticMemeTool`, `TiktokDownloaderTool`, `IqcTool`, `IqcV2Tool`) ke desain estetik minimalis modern.
- **Confirmed Decision 2**: Penerapan visual kartu dan kontrol menggunakan glassmorphism bersih (`backdrop-blur-xl`, `bg-white/70` & `bg-zinc-900/70`, border halus `border-zinc-200/60` & `border-zinc-800/60`) dengan bayangan lembut bertingkat.
- **Confirmed Discipline 3 (Anti-Slop)**: Mengeliminasi total ikon generik AI seperti Sparkles/Stars (mengganti dengan ikon utilitas kontekstual Lucide seperti `Flame`, `Sliders`, `Download`, `Layers`), menghilangkan badge sandwich statis, dan memastikan zero code comments pada kode.
- **Confirmed Discipline 4**: Konsistensi Bahasa Indonesia profesional dan ramah pengguna di seluruh antarmuka.

## 1. Overview & Core Concept

- **Tujuan**: Mengubah FZTOOLS dari sisa-sisa gaya neobrutalism (tepi tebal hitam, drop shadow solid kaku, warna kontras tinggi yang kasar) menjadi suite utilitas kreator kelas premium dengan standar visual agensi desain modern.
- **Target Pengguna**: Kreator konten sosial media, desainer grafis, dan kreator viral yang membutuhkan utilitas instan cepat pakai di perangkat mobile maupun desktop.
- **Nilai Utama**: Tampilan visual yang menenangkan, modern, responsif, dan memberikan pengalaman interaksi haptik serta animasi transisi yang mulus.

## 2. User Experience & Visual Design

- **Alur Interaksi Pengguna**:
  1. Pengguna membuka beranda dengan hero berlatar video sinematik dan bilah navigasi minimalis berlogo Alice.
  2. Memilih alat dari grid direktori atau bilah tab cepat dengan transisi spring halus.
  3. Setiap alat menampilkan panel kontrol di satu sisi (atau bagian atas pada mobile) dan preview interaktif di sisi lain dengan kartu glassmorphism terpadu.
  4. Pengguna memanipulasi kontrol (slider ukuran, pemilihan warna, input teks, upload gambar) dengan respons visual instan tanpa lag.
  5. Pengunduhan hasil resolusi tinggi (PNG/MP4/MP3) disertai umpan balik haptik dan notifikasi toast elegan.

- **Identitas Visual & Tema**:
  - *Arah Estetik*: Minimalis editorial kontemporer dengan glassmorphism lembut.
  - *Palet Warna*: Slate/Zinc netral (`bg-zinc-50 dark:bg-zinc-950`), aksen indigo dan violet yang tenang (`text-indigo-600 dark:text-indigo-400`, `bg-indigo-600`), serta kartu semi-transparan.
  - *Tipografi*: Sans-serif modern berskala proporsional, `tabular-nums` untuk angka/dimensi/slider, serta teks kicker kecil dengan tracking lebar (`tracking-[0.2em]`).
  - *Elemen Kontrol*: Input teks dan slider didesain dengan rounded-xl halus, focus-ring tipis, serta tombol aksi dengan micro-interaction `active:scale-[0.98]`.

## 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Standardisasi Kontainer Tool**
  - *Pilihan*: Menggunakan layout 2 kolom responsif (grid `lg:grid-cols-12` dengan pembagian 5 kolom kontrol dan 7 kolom preview kanvas) yang konsisten di semua modul tool.
  - *Alasan*: Menjamin ergonomi mobile-first saat diakses di ponsel layar sentuh dan tata letak berdampingan yang produktif di desktop.
- **Keputusan 2: Pembersihan Ikon Slop & Badge Menumpuk**
  - *Pilihan*: Menghapus `Sparkles` di halaman beranda dan `SarcasticMemeTool`, menggantinya dengan ikon fungsional (`Wand2` atau `Bot` diganti dengan `Cpu` / `MessageSquare` / `Flame`).
  - *Alasan*: Memenuhi aturan anti-slop ketat tanpa mengurangi fungsionalitas.
- **Keputusan 3: Penyelarasan Tombol Kembali & Navigasi Antar Halaman**
  - *Pilihan*: Memastikan tombol kembali ke beranda seragam di setiap modul aktif dengan animasi hover panah halus.
  - *Alasan*: Memudahkan navigasi pengguna di perangkat mobile tanpa perlu scroll jauh ke atas.

## 4. Technical Architecture & Component Flow

```unicode
┌─────────────────────────────────────────────────────────────────┐
│                      FZTOOLS App Architecture                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Navigation Bar (Alice Logo + Mode Gelap + Laci Riwayat)   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                │                                │
│                                ▼                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Hero Sinematik (Video Background + Segmented Quick Tabs)  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                │                                │
│                                ▼                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Modul-Modul Utilitas (Glassmorphism + Border Halus)       │  │
│  │                                                           │  │
│  │ ┌──────────────────────┐        ┌───────────────────────┐ │  │
│  │ │ Panel Kontrol Input  │───────▶│ Panel Kanvas Preview  │ │  │
│  │ │ - Sliders & Inputs   │        │ - High-DPI Render     │ │  │
│  │ │ - Preset Picker      │        │ - Export PNG / MP4    │ │  │
│  │ └──────────────────────┘        └───────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                │                                │
│                                ▼                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Footer (FZTOOLS | RIZ UNIVERSE + Alice Avatar + Meta)     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

- **Rencana File & Modul**:
  1. `app/page.tsx`: Bersihkan sisa ikon `Sparkles`, perhalus transisi, dan pastikan responsive padding sempurna.
  2. `components/tools/BratTool.tsx`: Ganti border tebal/solid neobrutalism dengan kartu glassmorphism, slider minimalis, dan opsi resolusi rapi.
  3. `components/tools/QrTool.tsx`: Rombak kontrol QR dengan form glassmorphism, pemilih warna modern, dan pratinjau kartu poster estetik.
  4. `components/tools/IndoMemeTool.tsx`: Rombak kartu pemilihan template dan editor caption menjadi galeri kartu modern.
  5. `components/tools/FakeTtCommentTool.tsx`: Desain ulang form kontrol komentar, avatar upload, dan metrik viral dengan visual glassmorphism.
  6. `components/tools/FileConverterTool.tsx`: Rombak area dropzone file dan tombol konversi dengan garis putus-putus lembut dan status konversi modern.
  7. `components/tools/SarcasticMemeTool.tsx`: Hapus ikon slop, ganti tata letak roasting AI dengan antarmuka bubble dialog kontemporer.
  8. `components/tools/TiktokDownloaderTool.tsx`: Perbarui antarmuka unduhan video/audio dengan kartu preview media dan tombol kualitas bertingkat.
