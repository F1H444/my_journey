# 🌟 f1h444/my_journey — Personal Journal Web App

Selamat datang di **f1h444/my_journey**, sebuah aplikasi jurnal digital pribadi (*daily log*) yang dirancang khusus dengan visual yang mempesona, *full color*, penuh dengan animasi mikro yang interaktif, dan performa tinggi yang berjalan sepenuhnya di sisi klien (*client-side*).

Aplikasi ini dibuat murni menggunakan teknologi web dasar (*vanilla web stack*) tanpa dependensi eksternal yang berat untuk memastikan kecepatan muat yang kilat (*fast performance*).

---

## ✨ Fitur Utama

*   **🔒 Local Authentication Gate:** Keamanan data lokal dengan halaman login yang memikat sebelum masuk ke area dashboard utama.
*   **🎨 Vibrant Neo-Brutalism & UI/UX Mempesona:** Tampilan penuh warna, berani, dengan bayangan tegas dan layout grid kartu jurnal yang memanjakan mata.
*   **🌓 Smart Theme Switcher:** Berpindah seketika antara *Light Mode* (ceria & penuh warna) dan *Dark Mode* (cyberpunk neon) yang nyaman di mata.
*   **⚡ High-Performance Animations:** Transisi antarhalaman dan efek hover kartu yang halus (*smooth 60fps*) memanfaatkan akselerasi perangkat keras CSS.
*   **💾 Client-Side Database:** Semua data tulisan harian, tanggal, dan pelacak suasana hati (*mood*) disimpan aman di dalam `localStorage` browser Anda.
*   **📦 Data Portability (Export/Import JSON):** Fitur krusial untuk mencadangkan (*backup*) semua tulisan ke file JSON lokal dan memulihkannya (*restore*) kapan saja.

---

## 📂 Struktur Proyek

Proyek ini dibangun secara modular agar pengelolaan kode logika dan tampilan menjadi mudah:

```text
f1h444/my_journey/
│
├── index.html          # Struktur utama halaman web (Login & Dashboard)
├── favicon.svg         # Ikon aplikasi
│
├── css/                # Manajemen Gaya Visual (CSS3)
│   ├── variables.css   # Variabel warna tema (Light/Dark)
│   ├── base.css        # Reset style dasar & tipografi
│   ├── login.css       # Desain halaman masuk
│   ├── dashboard.css   # Tata letak area utama aplikasi
│   ├── cards.css       # Tampilan grid kartu jurnal harian
│   └── animations.css  # Logika transisi dan animasi mikro
│
└── js/                 # Manajemen Logika Aplikasi (ES6+ JS)
    ├── app.js          # Entry point utama inisialisasi aplikasi
    ├── auth.js         # Sistem simulasi enkripsi & sesi login lokal
    ├── storage.js      # Driver manajemen data LocalStorage
    ├── theme.js        # Logika switch tema (Light/Dark)
    ├── ui.js           # Manipulasi DOM dan rendering komponen web
    └── utils.js        # Fungsi helper (format tanggal, id, dll)
