# Moodle Learning Project

## Deskripsi Project
Project ini merupakan lingkungan pembelajaran untuk memahami instalasi, konfigurasi, administrasi, dan penggunaan Moodle Learning Management System (LMS) menggunakan Docker Compose. Mencakup pembelajaran untuk semua role pengguna yang tersedia di Moodle seperti Administrator, Manager, Course Creator, Teacher, Non-editing Teacher, dan Student.

## Kebutuhan Software

### Requirements
- **Docker Desktop**: Versi terbaru untuk Windows/Mac/Linux
- **Docker Compose**: Biasanya sudah termasuk dalam Docker Desktop
- **RAM**: Minimum 2GB (disarankan 4GB+)
- **Disk Space**: Minimum 2GB untuk images dan data
- **Port**: Port 80 dan 443 harus tersedia

## Setup di Windows 10/11 dengan WSL

### 1. Instalasi Docker Desktop
1. Download Docker Desktop dari [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Install Docker Desktop dengan mengikuti wizard instalasi
3. Pastikan WSL 2 backend diaktifkan (Settings → General → Use WSL 2 based engine)
4. Restart komputer jika diminta

### 2. Clone Repository Project
```bash
# Buka Terminal/PowerShell/WSL
git clone <repository-url>
cd moodle

# Atau buat direktori baru jika belum ada repository
mkdir moodle
cd moodle
```

### 3. Setup File docker-compose.yml
File `docker-compose.yml` sudah dikonfigurasi dengan:
- **Moodle**: Versi 5.0 dengan Bitnami image
- **MariaDB**: Database server untuk Moodle
- **Local Volumes**: Data disimpan di folder `./volumes/` untuk kemudahan backup
  - `./volumes/mariadb` - Database files
  - `./volumes/moodle` - Moodle application files
  - `./volumes/moodledata` - Moodle data files (uploads, cache, etc)

### 4. Konfigurasi Environment (Opsional)
Buat file `.env` untuk custom configuration:
```bash
# Database Configuration
MARIADB_USER=bn_moodle
MARIADB_DATABASE=bitnami_moodle
MARIADB_ROOT_PASSWORD=rootpassword
MOODLE_DATABASE_PASSWORD=moodlepassword

# Moodle Configuration
MOODLE_USERNAME=admin
MOODLE_PASSWORD=adminpassword
MOODLE_EMAIL=admin@example.com
MOODLE_SITE_NAME=Moodle Learning Platform
```

## Cara Menjalankan Aplikasi

### 1. Start Container
```bash
# Buat folder volumes dengan permission yang tepat (hanya perlu sekali)
mkdir -p volumes/mariadb volumes/moodle volumes/moodledata
chmod -R 777 volumes/

# Start semua services
docker compose up -d

# Atau dengan output log
docker compose up

# Cek status container
docker compose ps
```

**Catatan**: Jika terjadi error permission denied, jalankan:
```bash
# Stop container jika sedang berjalan
docker compose down

# Set permission untuk Bitnami containers
chmod -R 777 volumes/

# Atau jika memiliki akses sudo
sudo chown -R 1001:1001 volumes/

# Start ulang container
docker compose up -d
```

### 2. Akses Moodle

#### Dari WSL/Linux
- **URL**: http://localhost
- **HTTPS**: https://localhost (akan ada warning SSL certificate)

#### Dari Windows Browser
Jika `localhost` tidak bisa diakses dari Windows, gunakan IP address WSL:
1. Cek IP address WSL dengan perintah:
   ```bash
   ip addr show eth0 | grep inet | awk '{print $2}' | cut -d/ -f1 | head -1
   ```
2. Akses Moodle di browser Windows menggunakan IP tersebut:
   - Contoh: `http://172.29.130.195`
   - Atau: `https://172.29.130.195` (akan ada warning SSL certificate)

#### Default Credentials
- Username: `user`
- Password: `bitnami`

**PENTING**: Segera ganti password default setelah login pertama!

### 3. Monitoring Container
```bash
# Lihat log container
docker compose logs -f

# Lihat log spesifik service
docker compose logs -f moodle
docker compose logs -f mariadb

# Masuk ke container Moodle
docker compose exec moodle bash

# Masuk ke container MariaDB
docker compose exec mariadb bash
```

### 4. Stop dan Restart Container
```bash
# Stop semua container
docker compose stop

# Stop dan remove container (data tetap tersimpan)
docker compose down

# Remove container dan volumes (HATI-HATI: akan menghapus semua data!)
docker compose down -v

# Restart container
docker compose restart
```

## Administrasi Moodle

### Login sebagai Administrator
1. Akses http://localhost
2. Login dengan credentials default atau yang sudah dikonfigurasi
3. Akses Site Administration dari menu utama

### Manage Users dan Roles
1. **Tambah User Baru**:
   - Site Administration → Users → Add a new user
   - Isi form registrasi
   - Assign role yang sesuai

2. **Role yang Tersedia**:
   - **Administrator**: Full system control
   - **Manager**: Manage courses dan categories
   - **Course Creator**: Create dan manage courses
   - **Teacher**: Full control dalam course
   - **Non-editing Teacher**: View dan grade tanpa edit
   - **Student**: Akses learning materials

### Membuat Course
1. Site Administration → Courses → Add a new course
2. Isi detail course:
   - Course full name
   - Course short name
   - Course category
   - Description
3. Configure enrollment methods
4. Add activities dan resources

### Backup dan Restore

#### Backup Database
```bash
# Backup database MariaDB
docker compose exec mariadb mysqldump -u root -p bitnami_moodle > backup_$(date +%Y%m%d).sql

# Atau backup langsung dari folder local
tar czf mariadb_backup_$(date +%Y%m%d).tar.gz ./volumes/mariadb
```

#### Backup Moodle Data
```bash
# Backup semua volumes sekaligus
tar czf moodle_full_backup_$(date +%Y%m%d).tar.gz ./volumes/

# Atau backup per folder
tar czf moodle_backup_$(date +%Y%m%d).tar.gz ./volumes/moodle
tar czf moodledata_backup_$(date +%Y%m%d).tar.gz ./volumes/moodledata
```

#### Restore dari Backup
```bash
# Restore database
docker compose exec -T mariadb mysql -u root -p bitnami_moodle < backup_20240101.sql

# Restore volumes dari backup tar
tar xzf moodle_full_backup_20240101.tar.gz

# Atau restore specific folder
tar xzf moodledata_backup_20240101.tar.gz
```

#### Backup Manual
Karena menggunakan local volumes, Anda juga bisa:
1. Stop container: `docker compose stop`
2. Copy folder `./volumes/` ke tempat backup
3. Start container: `docker compose start`

## Tips & Troubleshooting

### Port Conflicts
Jika port 80 atau 443 sudah digunakan:
```bash
# Edit docker-compose.yml untuk ganti port
ports:
  - '8080:8080'  # Ganti 80 dengan 8080
  - '8443:8443'  # Ganti 443 dengan 8443
```

### Akses dari Windows Host Issues
Jika tidak bisa akses dari Windows browser:
1. Pastikan container sudah selesai instalasi (cek logs)
2. Gunakan IP WSL sebagai pengganti localhost:
   ```bash
   # Di WSL, cek IP address
   ip addr show eth0 | grep inet
   ```
3. Jika masih bermasalah, restart Docker Desktop dan WSL:
   ```powershell
   # Di PowerShell Windows (as Administrator)
   wsl --shutdown
   # Restart Docker Desktop
   # Start WSL lagi dan jalankan docker compose up
   ```

### Reset Admin Password
```bash
# Masuk ke container Moodle
docker compose exec moodle bash

# Reset password menggunakan Moodle CLI
php admin/cli/reset_password.php
```

### Troubleshooting Container
```bash
# Cek logs untuk error
docker compose logs moodle
docker compose logs mariadb

# Rebuild container jika ada masalah
docker compose down
docker compose build --no-cache
docker compose up -d

# Cek resource usage
docker stats
```

### Permission Issues
Jika mengalami error "Permission denied":
```bash
# Option 1: Set permission 777 (development only)
chmod -R 777 volumes/

# Option 2: Set ownership untuk Bitnami user (lebih secure)
sudo chown -R 1001:1001 volumes/

# Option 3: Hapus volumes dan buat ulang dengan permission
docker compose down -v
rm -rf volumes/
mkdir -p volumes/mariadb volumes/moodle volumes/moodledata
chmod -R 777 volumes/
docker compose up -d
```

### Performance Tuning
```bash
# Increase PHP memory limit
docker compose exec moodle bash
echo "php_value memory_limit 512M" >> /opt/bitnami/moodle/.htaccess

# Restart container
docker compose restart moodle
```

### Update Moodle Version
1. Edit `docker-compose.yml`:
   ```yaml
   moodle:
     image: docker.io/bitnami/moodle:5.1  # Ganti ke versi baru
   ```
2. Pull image baru dan restart:
   ```bash
   docker compose pull
   docker compose up -d
   ```

## Sumber dan Dokumentasi

### Docker Image
- [Bitnami Moodle Docker Hub](https://hub.docker.com/r/bitnami/moodle)
- [Bitnami Moodle GitHub](https://github.com/bitnami/containers/tree/main/bitnami/moodle)

### Moodle Documentation
- [Moodle Official Documentation](https://docs.moodle.org)
- [Moodle Administrator Guide](https://docs.moodle.org/en/Administrator_documentation)
- [Moodle Teacher Guide](https://docs.moodle.org/en/Teacher_documentation)
- [Moodle Developer Documentation](https://moodledev.io)

### Docker Documentation
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/)
- [WSL 2 Backend](https://docs.docker.com/desktop/windows/wsl/)

## Kontribusi
Jika menemukan bug atau ingin berkontribusi, silakan buat issue atau pull request di repository ini.