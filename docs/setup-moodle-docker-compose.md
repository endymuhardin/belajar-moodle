# Bab 3: Setup Moodle dengan Docker Compose

Pada bab ini, kita akan melakukan instalasi Moodle menggunakan Docker Compose dengan image dari Bitnami. Pendekatan ini memberikan kemudahan dalam deployment dan maintenance.

## Pengenalan Docker Compose

### Apa itu Docker Compose?

Docker Compose adalah tool untuk mendefinisikan dan menjalankan multi-container Docker applications. Dengan file YAML, kita dapat:
- Konfigurasi multiple services (Moodle, MariaDB)
- Define networks dan volumes
- Start/stop semua services dengan satu command

### Mengapa Bitnami Images?

Bitnami menyediakan pre-configured images yang:
- Production-ready dan secure by default
- Regular updates dan patches
- Optimized untuk performance
- Dokumentasi lengkap

## Langkah 1: Setup Project Directory

### Membuat Struktur Project

1. **Buka WSL/Ubuntu Terminal**

2. **Buat directory project:**
   ```bash
   mkdir ~/moodle-docker
   cd ~/moodle-docker
   ```

3. **Buat struktur folder:**
   ```bash
   mkdir -p volumes/mariadb volumes/moodle volumes/moodledata
   ```

   Struktur folder:
   ```
   moodle-docker/
   ├── docker-compose.yml
   ├── .env (optional)
   ├── .gitignore
   └── volumes/
       ├── mariadb/      # Database files
       ├── moodle/       # Moodle application
       └── moodledata/   # User uploads, cache
   ```

## Langkah 2: Membuat Docker Compose Configuration

### File docker-compose.yml

Buat file `docker-compose.yml`:

```bash
nano docker-compose.yml
```

Isi dengan configuration berikut:

```yaml
# Moodle Docker Compose Configuration
# Using Bitnami Images

services:
  mariadb:
    image: docker.io/bitnami/mariadb:latest
    environment:
      # Database Configuration
      - ALLOW_EMPTY_PASSWORD=yes  # Development only!
      - MARIADB_USER=bn_moodle
      - MARIADB_DATABASE=bitnami_moodle
      - MARIADB_CHARACTER_SET=utf8mb4
      - MARIADB_COLLATE=utf8mb4_unicode_ci
    volumes:
      # Persistent storage for database
      - './volumes/mariadb:/bitnami/mariadb'
    networks:
      - moodle-network

  moodle:
    image: docker.io/bitnami/moodle:5.0
    ports:
      # Map container ports to host
      - '80:8080'
      - '443:8443'
    environment:
      # Database Connection
      - MOODLE_DATABASE_HOST=mariadb
      - MOODLE_DATABASE_PORT_NUMBER=3306
      - MOODLE_DATABASE_USER=bn_moodle
      - MOODLE_DATABASE_NAME=bitnami_moodle
      - ALLOW_EMPTY_PASSWORD=yes  # Development only!
      
      # Moodle Configuration (Optional)
      # - MOODLE_USERNAME=admin
      # - MOODLE_PASSWORD=admin123
      # - MOODLE_EMAIL=admin@example.com
      # - MOODLE_SITE_NAME=My Moodle Site
    volumes:
      # Persistent storage
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

### Environment Variables (.env)

Untuk production, buat file `.env` untuk sensitive data:

```bash
nano .env
```

Isi dengan:
```env
# Database Configuration
MARIADB_ROOT_PASSWORD=strong_root_password
MARIADB_PASSWORD=strong_db_password

# Moodle Admin Configuration  
MOODLE_USERNAME=admin
MOODLE_PASSWORD=Admin@123456
MOODLE_EMAIL=admin@yourdomain.com
MOODLE_SITE_NAME=Moodle Learning Platform
```

Update `docker-compose.yml` untuk use .env:
```yaml
environment:
  - MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}
  - MARIADB_PASSWORD=${MARIADB_PASSWORD}
```

### Git Ignore File

Buat `.gitignore`:

```bash
nano .gitignore
```

Isi dengan:
```gitignore
# Docker volumes
volumes/
volumes/mariadb/
volumes/moodle/
volumes/moodledata/

# Environment files
.env
.env.local
.env.*.local

# Backup files
*.sql
*.tar.gz
*.zip
backup_*

# IDE files
.vscode/
.idea/
*.swp

# OS files
.DS_Store
Thumbs.db
```

## Langkah 3: Mengatasi Permission Issues

### Setting Permissions untuk Bitnami

Bitnami containers run dengan user ID 1001. Set proper permissions:

```bash
# Set permissions untuk volumes
chmod -R 777 volumes/

# Alternative: Set ownership (memerlukan sudo)
sudo chown -R 1001:1001 volumes/
```

> **Note:** Permission 777 hanya untuk development. Untuk production, gunakan proper ownership.

## Langkah 4: Menjalankan Moodle

### Start Services

1. **Pull Docker images:**
   ```bash
   docker compose pull
   ```

2. **Start containers:**
   ```bash
   docker compose up -d
   ```

   Flag `-d` untuk run in background (detached mode).

3. **Monitor startup process:**
   ```bash
   docker compose logs -f moodle
   ```

   Tunggu sampai melihat:
   ```
   moodle_1 | INFO  ==> ** Moodle setup finished! **
   moodle_1 | INFO  ==> ** Starting Apache **
   ```

   Proses instalasi pertama memakan waktu 5-10 menit.

### Verify Services

Check container status:
```bash
docker compose ps
```

Output expected:
```
NAME                IMAGE                         STATUS
moodle-mariadb-1    bitnami/mariadb:latest       Up 5 minutes
moodle-moodle-1     bitnami/moodle:5.0          Up 5 minutes
```

## Langkah 5: Mengakses Moodle

### Dari WSL/Linux

Test dengan curl:
```bash
curl -I http://localhost
```

### Dari Windows Browser

#### Method 1: Localhost
Buka browser dan akses:
- HTTP: `http://localhost`
- HTTPS: `https://localhost` (akan ada SSL warning)

#### Method 2: WSL IP Address

Jika localhost tidak bisa diakses:

1. **Check WSL IP:**
   ```bash
   ip addr show eth0 | grep inet | awk '{print $2}' | cut -d/ -f1
   ```
   
   Example output: `172.29.130.195`

2. **Akses via IP:**
   - `http://172.29.130.195`
   - `https://172.29.130.195`

### Default Credentials

Login dengan credentials default Bitnami:
- **Username:** `user`
- **Password:** `bitnami`

> **IMPORTANT:** Segera ganti password default setelah login!

## Langkah 6: Initial Configuration

### Change Admin Password

1. Login dengan default credentials
2. Click user menu (top right)
3. Select **Preferences** → **Change password**
4. Enter new strong password

### Site Configuration

1. Navigate to **Site administration**
2. Configure:
   - **Site name**
   - **Front page settings**
   - **Location settings** (timezone)
   - **Language settings**

### Security Settings

1. Go to **Site administration** → **Security**
2. Configure:
   - **Site policies**
   - **HTTP security**
   - **Notifications**

## Langkah 7: Container Management

### Basic Commands

**Start containers:**
```bash
docker compose up -d
```

**Stop containers:**
```bash
docker compose stop
```

**Restart containers:**
```bash
docker compose restart
```

**Remove containers (keep data):**
```bash
docker compose down
```

**Remove everything (including data):**
```bash
docker compose down -v
rm -rf volumes/
```

### Monitoring

**View logs:**
```bash
# All services
docker compose logs

# Specific service
docker compose logs moodle
docker compose logs mariadb

# Follow logs (real-time)
docker compose logs -f moodle
```

**Check resource usage:**
```bash
docker stats
```

**Enter container shell:**
```bash
# Moodle container
docker compose exec moodle bash

# MariaDB container  
docker compose exec mariadb bash
```

## Troubleshooting

### Permission Denied Error

**Symptom:**
```
mkdir: cannot create directory '/bitnami/mariadb/data': Permission denied
```

**Solution:**
```bash
# Stop containers
docker compose down

# Fix permissions
chmod -R 777 volumes/

# Or with sudo
sudo chown -R 1001:1001 volumes/

# Start again
docker compose up -d
```

### Container Not Starting

**Check logs:**
```bash
docker compose logs mariadb
docker compose logs moodle
```

**Common issues:**
- Port already in use
- Insufficient memory
- Corrupted volumes

### Cannot Access from Browser

1. **Check if containers running:**
   ```bash
   docker compose ps
   ```

2. **Check if installation complete:**
   ```bash
   docker compose logs --tail=50 moodle | grep "setup finished"
   ```

3. **Try WSL IP instead of localhost:**
   ```bash
   ip addr show eth0
   ```

4. **Check Windows Firewall**

### Reset Installation

Untuk fresh install:
```bash
# Stop and remove containers
docker compose down

# Remove all data
rm -rf volumes/

# Recreate folders
mkdir -p volumes/mariadb volumes/moodle volumes/moodledata
chmod -R 777 volumes/

# Start fresh
docker compose up -d
```

## Best Practices

### Development Environment

1. **Use .env file** untuk configuration
2. **Regular backups** dengan script automation
3. **Monitor logs** untuk early problem detection
4. **Document changes** di README

### Security

1. **Change default passwords immediately**
2. **Use strong passwords** di production
3. **Enable HTTPS** dengan proper SSL certificate
4. **Regular updates** untuk Docker images
5. **Limit exposed ports** di production

### Performance

1. **Allocate sufficient resources** ke Docker
2. **Use local volumes** untuk better I/O
3. **Regular maintenance** dan cleanup
4. **Monitor resource usage**

## Kesimpulan

Anda telah berhasil:
- ✅ Setup Moodle dengan Docker Compose
- ✅ Configure persistent storage dengan volumes
- ✅ Access Moodle dari browser
- ✅ Understand basic container management

Pada bab selanjutnya, kita akan explore:
- Administrasi Moodle
- User management
- Course creation
- Advanced configuration

---

**Quick Reference:**

| Command | Description |
|---------|------------|
| `docker compose up -d` | Start services |
| `docker compose stop` | Stop services |
| `docker compose logs -f` | View logs |
| `docker compose ps` | Check status |
| `docker compose exec moodle bash` | Enter container |

**Next:** [Bab 4 - Administrasi Moodle →](administrasi-moodle.md)