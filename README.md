# Moodle Learning Project

## Deskripsi Project
Project ini merupakan lingkungan pembelajaran untuk memahami instalasi, konfigurasi, administrasi, dan penggunaan Moodle Learning Management System (LMS). Mencakup pembelajaran untuk semua role pengguna yang tersedia di Moodle seperti Administrator, Manager, Course Creator, Teacher, Non-editing Teacher, dan Student.

## Kebutuhan Software

### Minimum Requirements
- **PHP**: 8.0 atau lebih tinggi
- **Database**: MySQL 5.7+ / MariaDB 10.6+ / PostgreSQL 13+
- **Web Server**: Apache 2.4+ / Nginx 1.20+
- **RAM**: Minimum 512MB (disarankan 1GB+)
- **Disk Space**: Minimum 200MB untuk kode Moodle + ruang untuk data

### Software Pendukung
- **Git**: Untuk version control
- **Composer**: Untuk dependency management PHP
- **Node.js & npm**: Untuk kompilasi asset JavaScript/CSS

## Setup di Windows 10/11 dengan WSL

### 1. Instalasi WSL
```bash
# Buka PowerShell sebagai Administrator
wsl --install

# Atau install distribusi Linux spesifik
wsl --install -d Ubuntu-22.04

# Restart komputer setelah instalasi
```

### 2. Setup Environment di WSL
```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Install Apache
sudo apt install apache2 -y

# Install MySQL
sudo apt install mysql-server mysql-client -y

# Install PHP dan ekstensi yang diperlukan
sudo apt install php8.1 php8.1-cli php8.1-common php8.1-mysql \
php8.1-zip php8.1-gd php8.1-mbstring php8.1-curl php8.1-xml \
php8.1-bcmath php8.1-intl php8.1-soap php8.1-xmlrpc -y

# Install Git
sudo apt install git -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 3. Konfigurasi Database
```bash
# Masuk ke MySQL
sudo mysql

# Buat database dan user untuk Moodle
CREATE DATABASE moodle DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'moodleuser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON moodle.* TO 'moodleuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Download dan Setup Moodle
```bash
# Clone repository Moodle (atau download dari moodle.org)
cd /var/www/html
sudo git clone https://github.com/moodle/moodle.git
cd moodle

# Checkout ke versi stable terbaru
sudo git checkout MOODLE_403_STABLE

# Buat direktori moodledata
sudo mkdir /var/moodledata
sudo chown -R www-data:www-data /var/moodledata
sudo chmod -R 755 /var/moodledata

# Set permission untuk direktori Moodle
sudo chown -R www-data:www-data /var/www/html/moodle
sudo chmod -R 755 /var/www/html/moodle
```

### 5. Konfigurasi Apache
```bash
# Buat virtual host untuk Moodle
sudo nano /etc/apache2/sites-available/moodle.conf
```

Isi dengan:
```apache
<VirtualHost *:80>
    ServerAdmin admin@localhost
    DocumentRoot /var/www/html/moodle
    ServerName localhost
    
    <Directory /var/www/html/moodle>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/moodle-error.log
    CustomLog ${APACHE_LOG_DIR}/moodle-access.log combined
</VirtualHost>
```

```bash
# Enable site dan module yang diperlukan
sudo a2ensite moodle.conf
sudo a2enmod rewrite
sudo a2dissite 000-default.conf
sudo systemctl restart apache2
```

## Cara Menjalankan Aplikasi

### 1. Start Services
```bash
# Start Apache
sudo service apache2 start

# Start MySQL
sudo service mysql start

# Cek status services
sudo service apache2 status
sudo service mysql status
```

### 2. Akses Moodle
1. Buka browser dan akses: `http://localhost`
2. Ikuti wizard instalasi Moodle:
   - Pilih bahasa
   - Konfirmasi paths
   - Pilih database driver (mysqli)
   - Masukkan database settings:
     - Database host: `localhost`
     - Database name: `moodle`
     - Database user: `moodleuser`
     - Database password: `yourpassword`
   - Konfirmasi lisensi
   - Cek system requirements
   - Install Moodle
   - Setup admin account

### 3. Login dan Eksplorasi
Setelah instalasi selesai:
- Login sebagai Administrator
- Buat course baru
- Tambahkan user dengan berbagai role
- Test fitur-fitur untuk setiap role:
  - **Administrator**: Full system access
  - **Manager**: Manage courses dan users
  - **Course Creator**: Buat dan manage course
  - **Teacher**: Manage course content dan grading
  - **Non-editing Teacher**: View dan grade tanpa edit
  - **Student**: Akses course dan submit tugas

### 4. Stop Services (Opsional)
```bash
# Stop services ketika tidak digunakan
sudo service apache2 stop
sudo service mysql stop
```

## Tips & Troubleshooting

### Akses dari Windows Host
- Moodle dapat diakses dari Windows browser di: `http://localhost`
- Pastikan tidak ada aplikasi lain yang menggunakan port 80

### Reset Admin Password
```bash
cd /var/www/html/moodle
sudo -u www-data php admin/cli/reset_password.php
```

### Backup Database
```bash
mysqldump -u moodleuser -p moodle > moodle_backup.sql
```

### Update Moodle
```bash
cd /var/www/html/moodle
sudo git fetch
sudo git checkout MOODLE_404_STABLE  # Ganti dengan versi yang diinginkan
sudo -u www-data php admin/cli/upgrade.php
```

## Dokumentasi Tambahan
- [Moodle Documentation](https://docs.moodle.org)
- [Moodle Installation Guide](https://docs.moodle.org/en/Installing_Moodle)
- [Moodle Administrator Documentation](https://docs.moodle.org/en/Administrator_documentation)
- [Moodle Teacher Documentation](https://docs.moodle.org/en/Teacher_documentation)