# Bab 1: Deskripsi dan Outline

## Tentang Buku Ini

Buku ini merupakan panduan komprehensif untuk mempelajari Moodle Learning Management System (LMS) dari perspektif instalasi, konfigurasi, administrasi, dan penggunaan untuk berbagai role pengguna. Dengan menggunakan Docker Compose, kita akan membuat environment Moodle yang mudah di-setup dan maintain.

## Tujuan Pembelajaran

Setelah menyelesaikan buku ini, pembaca diharapkan mampu:

1. **Instalasi dan Konfigurasi**
   - Menginstal Moodle menggunakan Docker Compose
   - Mengkonfigurasi environment development di Windows dengan WSL
   - Mengelola container Docker untuk Moodle

2. **Administrasi Sistem**
   - Mengelola konfigurasi Moodle
   - Melakukan backup dan restore
   - Troubleshooting masalah umum

3. **Manajemen Pengguna**
   - Memahami role dan permission di Moodle
   - Membuat dan mengelola user accounts
   - Mengatur authentication methods

4. **Pengelolaan Course**
   - Membuat dan mengatur course
   - Mengelola enrollment
   - Mengatur activities dan resources

## Target Pembaca

Buku ini ditujukan untuk:

- **System Administrator** yang ingin deploy Moodle
- **IT Support** yang mengelola Moodle di institusi pendidikan
- **Instruktur/Guru** yang ingin memahami Moodle lebih dalam
- **Developer** yang ingin membuat development environment Moodle
- **Mahasiswa** yang mempelajari e-learning platform

## Prasyarat

Sebelum memulai, pembaca sebaiknya memiliki:

- Pengetahuan dasar tentang command line (Terminal/CMD)
- Pemahaman dasar tentang web server dan database
- Komputer dengan Windows 10/11 (minimum 8GB RAM)
- Koneksi internet untuk download Docker images

## Struktur Buku

### **Bagian 1: Persiapan Environment**
- **Bab 2:** Persiapan Komputer Windows
  - Instalasi WSL 2
  - Instalasi Docker Desktop
  - Konfigurasi environment

### **Bagian 2: Instalasi Moodle**
- **Bab 3:** Setup Moodle dengan Docker Compose
  - Memahami Docker Compose
  - Konfigurasi container
  - Running Moodle

### **Bagian 3: Administrasi Dasar**
- **Bab 4:** Administrasi Moodle
  - Site configuration
  - Security settings
  - Performance tuning

### **Bagian 4: Pengguna dan Course**
- **Bab 5:** Manajemen Pengguna dan Role
  - User roles di Moodle
  - Permission management
  - Authentication methods

- **Bab 6:** Course Management
  - Membuat course
  - Activities dan resources
  - Grading dan assessment

### **Bagian 5: Maintenance**
- **Bab 7:** Backup dan Restore
  - Strategi backup
  - Automated backup
  - Disaster recovery

- **Bab 8:** Troubleshooting
  - Common issues
  - Performance optimization
  - Debug mode

## Metode Pembelajaran

Setiap bab dalam buku ini menggunakan pendekatan:

1. **Teori**: Penjelasan konsep dan best practices
2. **Praktik**: Step-by-step tutorial dengan screenshot
3. **Latihan**: Hands-on exercises untuk reinforce learning
4. **Tips & Tricks**: Practical tips dari real-world experience
5. **Troubleshooting**: Solusi untuk masalah umum

## Konvensi yang Digunakan

### Command Line
```bash
# Komentar diawali dengan #
$ command-untuk-user-biasa
# command-untuk-root
```

### Informasi Penting

> **Note:** Informasi tambahan yang perlu diperhatikan

> **Warning:** Peringatan untuk menghindari masalah

> **Tip:** Tips dan tricks untuk efisiensi

### Placeholder
- `<your-value>`: Ganti dengan nilai Anda sendiri
- `[optional]`: Parameter optional
- `command | alternative`: Pilihan command

## Environment yang Digunakan

Dalam buku ini, kita menggunakan:

- **Operating System**: Windows 10/11 dengan WSL 2
- **Container Platform**: Docker Desktop
- **Orchestration**: Docker Compose
- **Moodle Version**: 5.0 (Bitnami)
- **Database**: MariaDB (latest)
- **Web Server**: Apache (bundled dengan Bitnami)

## Repository dan Resources

- **GitHub Repository**: Berisi semua konfigurasi dan script
- **Docker Images**: Bitnami official images dari Docker Hub
- **Documentation**: Links ke official Moodle documentation

## Dukungan dan Feedback

Jika menemukan kesalahan atau memiliki saran:
- Buat issue di GitHub repository
- Kontribusi melalui pull request
- Diskusi di forum komunitas

## Lisensi

Buku ini menggunakan lisensi Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0), yang memungkinkan:
- Share: copy dan redistribute dalam format apapun
- Adapt: remix, transform, dan build upon material
- Dengan syarat attribution dan share-alike

---

**Mari mulai perjalanan pembelajaran Moodle!**

Pada bab selanjutnya, kita akan mempersiapkan komputer Windows Anda untuk menjalankan Moodle dengan Docker Compose.