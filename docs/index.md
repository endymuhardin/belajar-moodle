# Panduan Lengkap Moodle dengan Docker

![Moodle Logo](img/moodle-logo.svg)

## Selamat Datang!

Buku ini adalah panduan komprehensif untuk mempelajari **Moodle Learning Management System (LMS)** dari dasar hingga mahir. Dengan pendekatan praktis menggunakan Docker Compose, Anda akan belajar instalasi, konfigurasi, administrasi, dan pengelolaan Moodle untuk berbagai keperluan pendidikan.

## 🎯 Untuk Siapa Buku Ini?

- **System Administrator** - Deploy dan maintain Moodle di institusi
- **IT Support** - Troubleshoot dan support pengguna Moodle
- **Guru/Instruktur** - Maksimalkan fitur Moodle untuk pembelajaran
- **Developer** - Setup development environment untuk Moodle
- **Mahasiswa IT** - Pelajari enterprise LMS platform

## 📚 Apa yang Akan Anda Pelajari?

### Fundamental
- ✅ Instalasi Moodle dengan Docker Compose
- ✅ Konfigurasi environment di Windows dengan WSL 2
- ✅ Setup database dan web server

### Administration
- ✅ Site configuration dan security
- ✅ User management dan authentication
- ✅ Backup, restore, dan disaster recovery
- ✅ Performance tuning dan optimization

### Course Management
- ✅ Membuat dan mengelola courses
- ✅ Activities dan resources
- ✅ Grading dan assessment
- ✅ Enrollment methods

### Advanced Topics
- ✅ Plugin installation dan management
- ✅ Theme customization
- ✅ Integration dengan external systems
- ✅ Monitoring dan analytics

## 🚀 Quick Start

### Prerequisites
- Windows 10/11 dengan minimum 8GB RAM
- Internet connection untuk download Docker images
- Basic knowledge tentang command line

### 3 Langkah Mudah

1. **Install Docker Desktop dan WSL 2**
   ```powershell
   wsl --install
   ```

2. **Clone repository dan setup**
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
- [Bab 1: Deskripsi dan Outline](deskripsi-dan-outline.md)
- [Bab 2: Persiapan Komputer Windows](persiapan-komputer-windows.md)

### Bagian 2: Instalasi
- [Bab 3: Setup Moodle dengan Docker Compose](setup-moodle-docker-compose.md)

### Bagian 3: Administrasi
- [Bab 4: Administrasi Moodle](administrasi-moodle.md)
- [Bab 5: Manajemen Pengguna dan Role](pengguna-dan-role.md)

### Bagian 4: Course Management
- [Bab 6: Membuat dan Mengelola Course](course-management.md)

### Bagian 5: Maintenance
- [Bab 7: Backup dan Restore](backup-restore.md)
- [Bab 8: Troubleshooting](troubleshooting.md)

### Appendix
- [Referensi dan Dokumentasi](referensi.md)

## 💡 Fitur Buku Ini

### Pendekatan Praktis
- **Step-by-step tutorials** dengan screenshot
- **Real-world scenarios** dan use cases
- **Hands-on exercises** di setiap bab
- **Troubleshooting guide** untuk masalah umum

### Modern Technology Stack
- **Docker Compose** untuk easy deployment
- **WSL 2** untuk Linux environment di Windows
- **Bitnami Images** untuk production-ready setup
- **Local volumes** untuk persistent storage

### Best Practices
- Security hardening
- Performance optimization
- Backup strategies
- Monitoring dan maintenance

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| LMS Platform | Moodle | 5.0 |
| Container | Docker | Latest |
| Orchestration | Docker Compose | v2 |
| Database | MariaDB | Latest |
| Web Server | Apache | 2.4 |
| OS | Windows + WSL 2 | 10/11 |

## 📝 Conventions

### Command Line
```bash
# Comments start with #
$ user-command
# root-command
```

### Important Notes

> **📌 Note:** Additional information

> **⚠️ Warning:** Important caution

> **💡 Tip:** Helpful hints

> **🔧 Troubleshooting:** Problem solutions

## 🤝 Kontribusi

Buku ini adalah open source! Kami welcome:
- Bug reports dan fixes
- Improvement suggestions
- Additional content
- Translations

Silakan buat **Issue** atau **Pull Request** di GitHub repository.

## 📜 Lisensi

Buku ini menggunakan lisensi **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.

Anda bebas untuk:
- **Share** - copy dan redistribute
- **Adapt** - remix, transform, dan build upon

Dengan syarat:
- **Attribution** - memberikan kredit
- **ShareAlike** - distribute dengan lisensi sama

## 🙏 Acknowledgments

- Moodle Community untuk excellent documentation
- Bitnami team untuk high-quality Docker images
- Docker team untuk containerization platform
- Semua kontributor yang telah membantu

## 📧 Contact & Support

- **GitHub Issues:** [Report problems](https://github.com/...)
- **Discussions:** [Community forum](https://github.com/...)
- **Email:** support@example.com

## 🎓 Certification

Setelah menyelesaikan buku ini, Anda siap untuk:
- Moodle Administrator Certification
- Deploy Moodle di production environment
- Manage enterprise-level LMS

---

## Mari Mulai! 🚀

Ready untuk memulai journey pembelajaran Moodle? 

**[→ Mulai dari Bab 1: Deskripsi dan Outline](deskripsi-dan-outline.md)**

Atau jika sudah siap dengan environment:

**[→ Langsung ke Bab 3: Setup Moodle](setup-moodle-docker-compose.md)**

---

*Happy Learning! Semoga buku ini membantu Anda menguasai Moodle dengan cepat dan efektif.*

**Version:** 1.0.0  
**Last Updated:** September 2025  
**Author:** Moodle Learning Team