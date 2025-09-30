# Bab 3: `Setup` Moodle dengan `Docker Compose`

Pada bab ini, kita akan melakukan instalasi Moodle menggunakan `Docker Compose` dengan `image` dari Bitnami. Pendekatan ini memberikan kemudahan dalam `deployment` dan pemeliharaan.

## Pengenalan `Docker Compose`

### Apa itu `Docker Compose`?

`Docker Compose` adalah alat untuk mendefinisikan dan menjalankan aplikasi Docker multi-`container`. Dengan `file` YAML, kita dapat:
- Mengkonfigurasi beberapa `services` (Moodle, MariaDB)
- Mendefinisikan `networks` dan `volumes`
- Memulai/menghentikan semua `services` dengan satu `command`

### Mengapa `Image` Bitnami?

Bitnami menyediakan `image` yang sudah dikonfigurasi sebelumnya yang:
- Siap `production` dan aman secara `default`
- Pembaruan dan `patch` rutin
- Dioptimalkan untuk kinerja
- Dokumentasi lengkap

## Langkah 1: `Setup` Direktori Proyek

### Membuat Struktur Proyek

1. **Buka Terminal WSL/Ubuntu**

2. **Buat direktori proyek:**
   ```bash
   mkdir ~/moodle-docker
   cd ~/moodle-docker
   ```

3. **Buat struktur `folder`:**
   ```bash
   mkdir -p volumes/mariadb volumes/moodle volumes/moodledata
   ```

   Struktur `folder`:
   ```
   moodle-docker/
   ├── docker-compose.yml
   ├── .env (opsional)
   ├── .gitignore
   └── volumes/
       ├── mariadb/      # `File` `database`
       ├── moodle/       # Aplikasi Moodle
       └── moodledata/   # Unggahan pengguna, `cache`
   ```

## Langkah 2: Membuat Konfigurasi `Docker Compose`

### `File` `docker-compose.yml`

Buat `file` `docker-compose.yml`:

```bash
nano docker-compose.yml
```

Isi dengan konfigurasi berikut:

```yaml
# Konfigurasi Moodle Docker Compose
# Menggunakan Image Bitnami

services:
  mariadb:
    image: docker.io/bitnami/mariadb:latest
    environment:
      # Konfigurasi Database
      - ALLOW_EMPTY_PASSWORD=yes  # Hanya untuk pengembangan!
      - MARIADB_USER=bn_moodle
      - MARIADB_DATABASE=bitnami_moodle
      - MARIADB_CHARACTER_SET=utf8mb4
      - MARIADB_COLLATE=utf8mb4_unicode_ci
    volumes:
      # Penyimpanan persisten untuk database
      - './volumes/mariadb:/bitnami/mariadb'
    networks:
      - moodle-network

  moodle:
    image: docker.io/bitnami/moodle:5.0
    ports:
      # Petakan port container ke host
      - '80:8080'
      - '443:8443'
    environment:
      # Koneksi Database
      - MOODLE_DATABASE_HOST=mariadb
      - MOODLE_DATABASE_PORT_NUMBER=3306
      - MOODLE_DATABASE_USER=bn_moodle
      - MOODLE_DATABASE_NAME=bitnami_moodle
      - ALLOW_EMPTY_PASSWORD=yes  # Hanya untuk pengembangan!
      
      # Konfigurasi Moodle (Opsional)
      # - MOODLE_USERNAME=admin
      # - MOODLE_PASSWORD=admin123
      # - MOODLE_EMAIL=admin@example.com
      # - MOODLE_SITE_NAME=My Moodle Site
    volumes:
      # Penyimpanan persisten
      - './volumes/moodle:/bitnami/moodle'
      - './volumes/moodledata:/bitnami/moodledata'
    depends_on:
      - mariadb
    networks:
      - moodle-network

networks:
  moodle-network:
    driver: bridge
```

### Variabel `Environment` (.env)

Untuk `production`, buat `file` `.env` untuk data sensitif:

```bash
nano .env
```

Isi dengan:
```env
# Konfigurasi Database
MARIADB_ROOT_PASSWORD=strong_root_password
MARIADB_PASSWORD=strong_db_password

# Konfigurasi Admin Moodle  
MOODLE_USERNAME=admin
MOODLE_PASSWORD=Admin@123456
MOODLE_EMAIL=admin@yourdomain.com
MOODLE_SITE_NAME=Moodle Learning Platform
```

Perbarui `docker-compose.yml` untuk menggunakan `.env`:
```yaml
environment:
  - MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}
  - MARIADB_PASSWORD=${MARIADB_PASSWORD}
```

### `File` `Git Ignore`

Buat `.gitignore`:

```bash
nano .gitignore
```

Isi dengan:
```gitignore
# Volume Docker
volumes/
volumes/mariadb/
volumes/moodle/
volumes/moodledata/

# File Environment
.env
.env.local
.env.*.local

# File Cadangan
*.sql
*.tar.gz
*.zip
backup_*

# File IDE
.vscode/
.idea/
*.swp

# File OS
.DS_Store
Thumbs.db
```

## Langkah 3: Mengatasi Masalah Izin

### Mengatur Izin untuk Bitnami

`Container` Bitnami berjalan dengan `user ID` 1001. Atur izin yang benar:

```bash
# Atur izin untuk volume
chmod -R 777 volumes/

# Alternatif: Atur kepemilikan (memerlukan sudo)
sudo chown -R 1001:1001 volumes/
```

> **Catatan:** Izin 777 hanya untuk pengembangan. Untuk `production`, gunakan kepemilikan yang benar.

## Langkah 4: Menjalankan Moodle

### Memulai `Services`

1. **Tarik `image` Docker:**
   ```bash
   docker compose pull
   ```

2. **Mulai `container`:**
   ```bash
   docker compose up -d
   ```

   `Flag` `-d` untuk berjalan di latar belakang (`detached mode`).

3. **Pantau proses `startup`:**
   ```bash
   docker compose logs -f moodle
   ```

   Tunggu sampai melihat:
   ```
   moodle_1 | INFO  ==> ** Moodle setup finished! **
   moodle_1 | INFO  ==> ** Starting Apache **
   ```

   Proses instalasi pertama memakan waktu 5-10 menit.

### Verifikasi `Services`

Periksa status `container`:
```bash
docker compose ps
```

Keluaran yang diharapkan:
```
NAME                IMAGE                         STATUS
moodle-mariadb-1    bitnami/mariadb:latest       Up 5 minutes
moodle-moodle-1     bitnami/moodle:5.0          Up 5 minutes
```

## Langkah 5: Mengakses Moodle

### Dari WSL/Linux

Tes dengan `curl`:
```bash
curl -I http://localhost
```

### Dari `Browser` Windows

#### Metode 1: `Localhost`
Buka `browser` dan akses:
- HTTP: `http://localhost`
- HTTPS: `https://localhost` (akan ada peringatan SSL)

#### Metode 2: Alamat IP WSL

Jika `localhost` tidak bisa diakses:

1. **Periksa IP WSL:**
   ```bash
   ip addr show eth0 | grep inet | awk '{print $2}' | cut -d/ -f1
   ```
   
   Contoh keluaran: `172.29.130.195`

2. **Akses melalui IP:**
   - `http://172.29.130.195`
   - `https://172.29.130.195`

Jika berhasil, Anda akan melihat halaman depan Moodle sebelum `login`:

![Moodle Front Page](img/instalasi/frontpage.png)

### Kredensial `Default`

`Login` dengan kredensial `default` Bitnami:
- **`Username`:** `user`
- **`Password`:** `bitnami`

![Moodle Login Page](img/instalasi/login.png)

> **PENTING:** Segera ganti `password` `default` setelah `login`!

## Langkah 6: Konfigurasi Awal

### Ubah `Password` Admin

1. `Login` dengan kredensial `default`
2. Klik menu pengguna (kanan atas)
3. Pilih **Preferences** → **Change password**
4. Masukkan `password` baru yang kuat

### Konfigurasi Situs

1. Navigasi ke **`Site administration`**

![Moodle Admin Dashboard](img/instalasi/dashboard.png)

2. Konfigurasi:
   - **`Site name`**
   - **`Front page settings`**
   - **`Location settings`** (`timezone`)
   - **`Language settings`**

### Pengaturan Keamanan

1. Buka **`Site administration`** → **`Security`**
2. Konfigurasi:
   - **`Site policies`**
   - **`HTTP security`**
   - **`Notifications`**

## Langkah 7: Manajemen `Container`

### `Command` Dasar

**Mulai `container`:**
```bash
docker compose up -d
```

**Hentikan `container`:**
```bash
docker compose stop
```

**`Restart` `container`:**
```bash
docker compose restart
```

**Hapus `container` (simpan data):**
```bash
docker compose down
```

**Hapus semuanya (termasuk data):**
```bash
docker compose down -v
rm -rf volumes/
```

### Pemantauan

**Lihat `log`:**
```bash
# Semua services
docker compose logs

# Service spesifik
docker compose logs moodle
docker compose logs mariadb

# Ikuti log (real-time)
docker compose logs -f moodle
```

**Periksa penggunaan sumber daya:**
```bash
docker stats
```

**Masuk ke `shell` `container`:**
```bash
# Container Moodle
docker compose exec moodle bash

# Container MariaDB  
docker compose exec mariadb bash
```

## Pemecahan Masalah

### `Error` Izin Ditolak

**Gejala:**
```
mkdir: cannot create directory '/bitnami/mariadb/data': Permission denied
```

**Solusi:**
```bash
# Hentikan container
docker compose down

# Perbaiki izin
chmod -R 777 volumes/

# Atau dengan sudo
sudo chown -R 1001:1001 volumes/

# Mulai lagi
docker compose up -d
```

### `Container` Tidak Memulai

**Periksa `log`:**
```bash
docker compose logs mariadb
docker compose logs moodle
```

**Masalah umum:**
- `Port` sudah digunakan
- Memori tidak cukup
- `Volume` rusak

### Tidak Dapat Mengakses dari `Browser`

1. **Periksa apakah `container` berjalan:**
   ```bash
   docker compose ps
   ```

2. **Periksa apakah instalasi selesai:**
   ```bash
   docker compose logs --tail=50 moodle | grep "setup finished"
   ```

3. **Coba IP WSL alih-alih `localhost`:**
   ```bash
   ip addr show eth0
   ```

4. **Periksa `Firewall` Windows**

### `Reset` Instalasi

Untuk instalasi baru:
```bash
# Hentikan dan hapus container
docker compose down

# Hapus semua data
rm -rf volumes/

# Buat ulang folder
mkdir -p volumes/mariadb volumes/moodle volumes/moodledata
chmod -R 777 volumes/

# Mulai dari awal
docker compose up -d
```

## Praktik Terbaik

### `Environment` Pengembangan

1. **Gunakan `file` `.env`** untuk konfigurasi
2. **`Backup` rutin** dengan otomatisasi `script`
3. **Pantau `log`** untuk deteksi masalah dini
4. **Dokumentasikan perubahan** di `README`

### Keamanan

1. **Segera ganti `password` `default`**
2. **Gunakan `password` yang kuat** di `production`
3. **Aktifkan HTTPS** dengan sertifikat SSL yang benar
4. **Pembaruan rutin** untuk `image` Docker
5. **Batasi `port` yang diekspos** di `production`

### Kinerja

1. **Alokasikan sumber daya yang cukup** ke Docker
2. **Gunakan `local volumes`** untuk I/O yang lebih baik
3. **Pemeliharaan** dan pembersihan rutin
4. **Pantau penggunaan sumber daya**

## Kesimpulan

Anda telah berhasil:
- ✅ `Setup` Moodle dengan `Docker Compose`
- ✅ Mengkonfigurasi penyimpanan persisten dengan `volumes`
- ✅ Mengakses Moodle dari `browser`
- ✅ Memahami manajemen `container` dasar

Pada bab selanjutnya, kita akan menjelajahi:
- Administrasi Moodle
- Manajemen pengguna
- Pembuatan `course`
- Konfigurasi lanjutan

---

**Referensi Cepat:**

| `Command` | Deskripsi |
|---|---|
| `docker compose up -d` | Memulai `services` |
| `docker compose stop` | Menghentikan `services` |
| `docker compose logs -f` | Melihat `log` |
| `docker compose ps` | Memeriksa status |
| `docker compose exec moodle bash` | Masuk ke `container` |

**Selesai!** Moodle sudah siap digunakan. Selanjutnya pelajari cara administrasi sistem.

**Berikutnya:** [Bab 4 - Administrasi Moodle →](administrasi-moodle.md)