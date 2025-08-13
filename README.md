# ProvisioningTSEL - Sidebar

Sidebar sederhana untuk sistem ProvisioningTSEL berdasarkan desain yang diberikan.

## Fitur

- **Sesuai Desain**: Menggunakan warna dan layout yang tepat sesuai gambar
- **Responsive**: Bekerja di desktop dan mobile
- **Active State**: Otomatis highlight halaman aktif
- **Clean**: Kode sederhana dan mudah dipahami

## Struktur

```
src/
├── components/
│   ├── ui/
│   │   └── sidebar.tsx          # Komponen sidebar dari shadcn/ui
│   └── app-sidebar.tsx          # Implementasi sidebar utama
└── app/
    ├── layout.tsx               # Layout dengan sidebar
    ├── page.tsx                 # Halaman Dashboard
    ├── upload/page.tsx          # Halaman Upload
    ├── laporan/page.tsx         # Halaman Laporan
    ├── monitoring/page.tsx      # Halaman Monitoring
    └── settings/page.tsx        # Halaman Settings
```

## Warna

- **Background**: `#282c34` (Dark charcoal gray)
- **Text**: `#ffffff` (White)
- **Brand**: `#60a5fa` (Blue-400 untuk "Provisioning")
- **Active**: `#3b82f6` (Blue-500)
- **Border**: `#404552` (Medium gray)
- **Hover**: `#3a3f4b` (Slightly lighter gray)

## Penggunaan

Sidebar sudah terintegrasi di layout utama. Untuk menambah halaman baru:

1. Buat file di `src/app/nama-halaman/page.tsx`
2. Tambahkan item navigasi di `src/components/app-sidebar.tsx`
3. Sidebar akan otomatis highlight halaman aktif

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.
