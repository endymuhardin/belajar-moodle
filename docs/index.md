# Panduan Lengkap Moodle dengan Docker

![Moodle Logo](img/moodle-logo.svg)

## Selamat Datang!

Buku ini adalah panduan komprehensif untuk mempelajari **Moodle Learning Management System (LMS)** dari dasar hingga mahir. Dengan pendekatan praktis menggunakan `Docker Compose`, Anda akan belajar instalasi, konfigurasi, administrasi, dan pengelolaan Moodle untuk berbagai keperluan pendidikan.

## 🎯 Untuk Siapa Buku Ini?

- **`System Administrator`** - `Deploy` dan `maintain` Moodle di institusi
- **`IT Support`** - Memecahkan masalah dan mendukung pengguna Moodle
- **Guru/Instruktur** - Maksimalkan fitur Moodle untuk pembelajaran
- **`Developer`** - `Setup` `environment` pengembangan untuk Moodle
- **Mahasiswa IT** - Pelajari `platform` LMS perusahaan

## 📚 Apa yang Akan Anda Pelajari?

### Fundamental
- ✅ Instalasi Moodle dengan `Docker Compose`
- ✅ Konfigurasi `environment` di Windows dengan WSL 2
- ✅ `Setup` `database` dan `web server`

### Administrasi
- ✅ Konfigurasi situs dan keamanan
- ✅ Manajemen pengguna dan otentikasi
- ✅ `Backup`, `restore`, dan pemulihan bencana
- ✅ Penyesuaian dan optimasi kinerja

### Manajemen `Course`
- ✅ Membuat dan mengelola `courses`
- ✅ `Activities` dan `resources`
- ✅ Penilaian dan `assessment`
- ✅ Metode pendaftaran

### Topik Lanjutan
- ✅ Instalasi dan manajemen `plugin`
- ✅ Kustomisasi `theme`
- ✅ Integrasi dengan sistem eksternal
- ✅ Pemantauan dan analitik

## 🚀 Mulai Cepat

### Prasyarat
- Windows 10/11 dengan minimum 8GB RAM
- Koneksi internet untuk mengunduh `Docker images`
- Pengetahuan dasar tentang `command line`

### 3 Langkah Mudah

1. **Instal `Docker Desktop` dan WSL 2**
   ```powershell
   wsl --install
   ```

2. **`Clone` repositori dan `setup`**
   ```bash
   git clone <repository-url>
   cd moodle-docker
   docker compose up -d
   ```

3. **Akses Moodle**
   ```
   http://localhost
   Username: user
   Password: bitnami
   ```

## 📖 Struktur Buku

### Bagian 1: Persiapan
- [Bab 1: Deskripsi dan Garis Besar](deskripsi-dan-outline.md)
- [Bab 2: Persiapan Komputer Windows](persiapan-komputer-windows.md)

### Bagian 2: Instalasi
- [Bab 3: `Setup` Moodle dengan `Docker Compose`](setup-moodle-docker-compose.md)

### Bagian 3: Administrasi
- [Bab 4: Administrasi Moodle](administrasi-moodle.md)
- [Bab 5: Manajemen Pengguna dan `Role`](pengguna-dan-role.md)

### Bagian 4: Manajemen `Course`
- [Bab 6: Membuat dan Mengelola `Course`](course-management.md)

### Bagian 5: Pemeliharaan
- [Bab 7: `Backup` dan `Restore`](backup-restore.md)
- [Bab 8: Pemecahan Masalah](troubleshooting.md)

### Lampiran
- [Referensi dan Dokumentasi](referensi.md)

## 💡 Fitur Buku Ini

### Pendekatan Praktis
- **Tutorial langkah-demi-langkah** dengan `screenshot`
- **Skenario dunia nyata** dan kasus penggunaan
- **Latihan langsung** di setiap bab
- **Panduan pemecahan masalah** untuk masalah umum

### `Stack` Teknologi Modern
- **`Docker Compose`** untuk `deployment` yang mudah
- **WSL 2** untuk `environment` Linux di Windows
- **`Bitnami Images`** untuk `setup` yang siap `production`
- **`Local volumes`** untuk penyimpanan persisten

### Praktik Terbaik
- Pengerasan keamanan
- Optimasi kinerja
- Strategi `backup`
- Pemantauan dan pemeliharaan

## 🛠️ `Stack` Teknologi

| Komponen | Teknologi | Versi |
|---|---|---|
| `Platform` LMS | Moodle | 5.0 |
| `Container` | Docker | Terbaru |
| Orkestrasi | `Docker Compose` | v2 |
| `Database` | MariaDB | Terbaru |
| `Web Server` | Apache | 2.4 |
| OS | Windows + WSL 2 | 10/11 |

## 📝 Konvensi

### `Command Line`
```bash
# Komentar diawali dengan #
$ user-command
# root-command
```

### Catatan Penting

> **📌 Catatan:** Informasi tambahan

> **⚠️ Peringatan:** Peringatan penting

> **💡 Kiat:** Petunjuk bermanfaat

> **🔧 Pemecahan Masalah:** Solusi masalah

## 🤝 Kontribusi

Buku ini adalah `open source`! Kami menyambut:
- Laporan dan perbaikan `bug`
- Saran perbaikan
- Konten tambahan
- Terjemahan

Silakan buat **`Issue`** atau **`Pull Request`** di repositori GitHub.

## 📜 Lisensi

Buku ini menggunakan lisensi **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.

Anda bebas untuk:
- **Berbagi** - salin dan distribusikan ulang
- **Adaptasi** - `remix`, ubah, dan bangun di atasnya

Dengan syarat:
- **Atribusi** - memberikan kredit
- **BerbagiSerupa** - distribusikan dengan lisensi yang sama

## 🙏 Ucapan Terima Kasih

- Komunitas Moodle untuk dokumentasi yang luar biasa
- Tim Bitnami untuk `Docker images` berkualitas tinggi
- Tim Docker untuk `platform` `containerization`
- Semua kontributor yang telah membantu

## 📧 Kontak & Dukungan

- **`GitHub Issues`:** [Laporkan masalah](https://github.com/...)
- **Diskusi:** [`Forum` komunitas](https://github.com/...)
- **Email:** support@example.com

## 🎓 Sertifikasi

Setelah menyelesaikan buku ini, Anda siap untuk:
- Sertifikasi Administrator Moodle
- `Deploy` Moodle di `environment` `production`
- Mengelola LMS tingkat perusahaan

---

## Mari Mulai! 🚀

Siap untuk memulai perjalanan pembelajaran Moodle? 

**[→ Mulai dari Bab 1: Deskripsi dan Garis Besar](deskripsi-dan-outline.md)**

Atau jika sudah siap dengan `environment`:

**[→ Langsung ke Bab 3: `Setup` Moodle](setup-moodle-docker-compose.md)**

---

*Selamat Belajar! Semoga buku ini membantu Anda menguasai Moodle dengan cepat dan efektif.*

**Versi:** 1.0.0  
**Terakhir Diperbarui:** September 2025  
**Penulis:** Tim Pembelajaran Moodle