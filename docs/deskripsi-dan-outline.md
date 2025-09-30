# Bab 1: Deskripsi dan Garis Besar

## Tentang Buku Ini

Buku ini merupakan panduan komprehensif untuk mempelajari Moodle Learning Management System (LMS) dari perspektif instalasi, konfigurasi, administrasi, dan penggunaan untuk berbagai `role` pengguna. Dengan menggunakan `Docker Compose`, kita akan membuat `environment` Moodle yang mudah di-`setup` dan `maintain`.

## Tujuan Pembelajaran

Setelah menyelesaikan buku ini, pembaca diharapkan mampu:

1. **Instalasi dan Konfigurasi**
   - Menginstal Moodle menggunakan `Docker Compose`
   - Mengkonfigurasi `environment` pengembangan di Windows dengan WSL
   - Mengelola `container` Docker untuk Moodle

2. **Administrasi Sistem**
   - Mengelola konfigurasi Moodle
   - Melakukan `backup` dan `restore`
   - Memecahkan masalah umum

3. **Manajemen Pengguna**
   - Memahami `role` dan `permission` di Moodle
   - Membuat dan mengelola akun pengguna
   - Mengatur metode otentikasi

4. **Pengelolaan `Course`**
   - Membuat dan mengatur `course`
   - Mengelola pendaftaran
   - Mengatur `activities` dan `resources`

## Target Pembaca

Buku ini ditujukan untuk:

- **`System Administrator`** yang ingin men-`deploy` Moodle
- **`IT Support`** yang mengelola Moodle di institusi pendidikan
- **Instruktur/Guru** yang ingin memahami Moodle lebih dalam
- **`Developer`** yang ingin membuat `environment` pengembangan Moodle
- **Mahasiswa** yang mempelajari `platform` `e-learning`

## Prasyarat

Sebelum memulai, pembaca sebaiknya memiliki:

- Pengetahuan dasar tentang `command line` (Terminal/CMD)
- Pemahaman dasar tentang `web server` dan `database`
- Komputer dengan Windows 10/11 (minimum 8GB RAM)
- Koneksi internet untuk mengunduh `Docker images`

## Struktur Buku

### **Bagian 1: Persiapan `Environment`**
- **Bab 2:** Persiapan Komputer Windows
  - Instalasi WSL 2
  - Instalasi `Docker Desktop`
  - Konfigurasi `environment`

### **Bagian 2: Instalasi Moodle**
- **Bab 3:** `Setup` Moodle dengan `Docker Compose`
  - Memahami `Docker Compose`
  - Konfigurasi `container`
  - Menjalankan Moodle

### **Bagian 3: Administrasi Dasar**
- **Bab 4:** Administrasi Moodle
  - Konfigurasi situs
  - Pengaturan keamanan
  - Penyesuaian kinerja

### **Bagian 4: Pengguna dan `Course`**
- **Bab 5:** Manajemen Pengguna dan `Role`
  - `Role` pengguna di Moodle
  - Manajemen `permission`
  - Metode otentikasi

- **Bab 6:** Manajemen `Course`
  - Membuat `course`
  - `Activities` dan `resources`
  - Penilaian dan `assessment`

### **Bagian 5: Pemeliharaan**
- **Bab 7:** `Backup` dan `Restore`
  - Strategi `backup`
  - `Backup` otomatis
  - Pemulihan bencana

- **Bab 8:** Pemecahan Masalah
  - Masalah umum
  - Optimasi kinerja
  - Mode `debug`

## Metode Pembelajaran

Setiap bab dalam buku ini menggunakan pendekatan:

1. **Teori**: Penjelasan konsep dan praktik terbaik
2. **Praktik**: Tutorial langkah-demi-langkah dengan `screenshot`
3. **Latihan**: Latihan langsung untuk memperkuat pembelajaran
4. **Kiat & Trik**: Kiat praktis dari pengalaman dunia nyata
5. **Pemecahan Masalah**: Solusi untuk masalah umum

## Konvensi yang Digunakan

### `Command Line`
```bash
# Komentar diawali dengan #
$ command-untuk-user-biasa
# command-untuk-root
```

### Informasi Penting

> **Catatan:** Informasi tambahan yang perlu diperhatikan

> **Peringatan:** Peringatan untuk menghindari masalah

> **Kiat:** Kiat dan trik untuk efisiensi

### `Placeholder`
- `<your-value>`: Ganti dengan nilai Anda sendiri
- `[optional]`: Parameter opsional
- `command | alternative`: Pilihan `command`

## `Environment` yang Digunakan

Dalam buku ini, kita menggunakan:

- **Sistem Operasi**: Windows 10/11 dengan WSL 2
- **`Platform` `Container`**: `Docker Desktop`
- **Orkestrasi**: `Docker Compose`
- **Versi Moodle**: 5.0 (Bitnami)
- **`Database`**: MariaDB (terbaru)
- **`Web Server`**: Apache (termasuk dengan Bitnami)

## Repositori dan Sumber Daya

- **Repositori GitHub**: Berisi semua konfigurasi dan `script`
- **`Docker Images`**: `Images` resmi Bitnami dari `Docker Hub`
- **Dokumentasi**: Tautan ke dokumentasi resmi Moodle

## Dukungan dan Umpan Balik

Jika menemukan kesalahan atau memiliki saran:
- Buat `issue` di repositori GitHub
- Kontribusi melalui `pull request`
- Diskusi di `forum` komunitas

## Lisensi

Buku ini menggunakan lisensi Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0), yang memungkinkan:
- **Berbagi**: salin dan distribusikan ulang dalam format apa pun
- **Adaptasi**: `remix`, ubah, dan bangun di atas materi
- Dengan syarat atribusi dan berbagi-serupa

---

**Mari mulai perjalanan pembelajaran Moodle!**

Pada bab selanjutnya, kita akan mempersiapkan komputer Windows Anda untuk menjalankan Moodle dengan `Docker Compose`.