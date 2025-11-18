# Bab 10: E-Learning Standards (SCORM, CMI5, H5P)

Bab ini membahas berbagai standar e-learning yang didukung Moodle: SCORM, CMI5, dan H5P. Anda akan mempelajari teori, implementasi praktis, dan best practices untuk konten pembelajaran interaktif menggunakan standar industri.

## 🎯 Quick Reference: LRS Requirements

| Standard | Built-in Moodle | Needs LRS | Complexity |
|----------|----------------|-----------|------------|
| **SCORM 1.2** | ✅ Yes | ❌ No | Low |
| **SCORM 2004** | ✅ Yes | ❌ No | Low |
| **H5P** | ✅ Yes | ❌ No | Low |
| **CMI5** | ❌ No | ✅ Yes | High |
| **xAPI/TinCan** | ❌ No | ✅ Yes | High |

**Rekomendasi:**
- **Pemula**: Mulai dengan SCORM 1.2 atau H5P (tidak perlu LRS)
- **Intermediate**: Gunakan SCORM 2004 untuk fitur sequencing
- **Advanced**: CMI5 + LRS untuk tracking yang sangat detail

---

## PART A: SCORM (Sharable Content Object Reference Model)

### Pengenalan SCORM

**SCORM** adalah seperangkat standar teknis untuk e-learning yang dikembangkan oleh ADL (Advanced Distributed Learning).

**✅ Keuntungan SCORM untuk Moodle:**
- **Built-in support**: Langsung didukung Moodle tanpa plugin tambahan
- **No LRS needed**: Tracking langsung disimpan di Moodle database
- **Wide adoption**: Format paling umum, banyak authoring tools
- **Simple deployment**: Upload ZIP, langsung jalan

**SCORM memastikan bahwa:**
- Konten dapat dioperasikan di berbagai LMS
- Progress pembelajaran dapat dilacak
- Data dapat dikomunikasikan antara konten dan LMS
- Konten dapat dikemas dan didistribusikan dengan mudah

### Versi SCORM

1. **SCORM 1.1** (Versi pertama, jarang digunakan)
2. **SCORM 1.2** (Masih banyak digunakan, kompatibilitas luas)
3. **SCORM 2004** (Versi terbaru, fitur lebih lengkap)
   - 2nd Edition (2004)
   - 3rd Edition (2006)
   - 4th Edition (2009)

### Komponen SCORM

**Content Aggregation Model (CAM):**

- Manifest file (imsmanifest.xml)
- Organization structure
- Resource files
- Metadata

**Run-Time Environment (RTE):**

- API communication
- Data model
- Launch and tracking

**Sequencing and Navigation (SN):**

- Learning activities sequencing
- Navigation controls
- Rollup rules

## Implementasi SCORM di Moodle

### 1. Menambahkan SCORM Package

**Metode 1: Melalui Antarmuka Moodle**

1. Masuk ke course dan aktifkan **Edit mode**
2. Klik **Add an activity or resource**
3. Pilih **SCORM package**
4. Klik **Add**

**Metode 2: URL Langsung (untuk admin)**

```
http://localhost/course/modedit.php?add=scorm&type=&course=[COURSE_ID]&section=0
```

![SCORM package upload](img/scorm/01-scorm-upload.png)

### 2. Konfigurasi SCORM

**General Settings:**

- **Name**: Nama aktivitas SCORM
- **Description**: Deskripsi konten pembelajaran
- **Package**: Upload file .zip SCORM

**Display Settings:**

- **Display**: Cara menampilkan SCORM (Current window, New window, etc.)
- **Display course structure**: Menampilkan atau menyembunyikan struktur
- **Toc display**: Posisi table of contents
- **Auto-update frequency**: Frekuensi update progress

**Grade Settings:**

- **Grading method**: Cara penilaian
  - Learning objects
  - Highest grade
  - Average grade
  - Sum grade
- **Maximum grade**: Nilai maksimum
- **Attempts number**: Jumlah percobaan yang diizinkan
- **What to grade when**: Waktu penilaian (First attempt, Last attempt, etc.)

**Completion Settings:**

- **Require view**: Harus dilihat untuk complete
- **Require status**: Status yang diperlukan untuk completion
  - Completed
  - Passed
  - Completed and passed

### 3. SCORM Tracking

**Data yang Dilacak:**

- `cmi.core.lesson_status`: Status (completed, passed, failed, etc.)
- `cmi.core.score.raw`: Nilai mentah
- `cmi.core.session_time`: Waktu sesi
- `cmi.core.exit`: Mode exit
- `cmi.objectives.n.id`: ID objektif pembelajaran
- `cmi.objectives.n.status`: Status objektif

**Progress Tracking:**

- Completion status
- Success status
- Score tracking
- Time spent
- Interaction data

### 4. Membuat SCORM Package Sederhana

Anda dapat membuat contoh SCORM package untuk testing:

**1. Buat folder "scorm-content"**

**2. Tambahkan file `imsmanifest.xml`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="test-scorm" version="1.3"
    xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
    xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3">
    <metadata>
        <schema>ADL SCORM</schema>
        <schemaversion>2004 4th Edition</schemaversion>
    </metadata>
    <organizations default="org">
        <organization identifier="org">
            <title>Test SCORM Content</title>
            <item identifier="item1" identifierref="resource1">
                <title>Lesson 1</title>
            </item>
        </organization>
    </organizations>
    <resources>
        <resource identifier="resource1" type="webcontent"
            adlcp:scormType="sco" href="index.html">
            <file href="index.html"/>
        </resource>
    </resources>
</manifest>
```

**3. Tambahkan file `index.html`:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test SCORM Content</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .progress { margin-top: 20px; }
    </style>
</head>
<body>
    <h1>Test SCORM Content</h1>
    <p>This is a simple SCORM package for testing.</p>

    <div class="progress">
        <button onclick="markComplete()">Mark as Complete</button>
        <button onclick="setScore()">Set Score (80%)</button>
    </div>

    <script>
        // Find SCORM API
        function findAPI(win) {
            while (win.API == null && win.parent != null && win.parent != win) {
                win = win.parent;
            }
            return win.API;
        }

        // Initialize SCORM
        var api = findAPI(window);
        if (api != null) {
            api.LMSInitialize("");
            api.LMSSetValue("cmi.core.lesson_status", "incomplete");
        }

        // Mark as complete
        function markComplete() {
            if (api != null) {
                api.LMSSetValue("cmi.core.lesson_status", "completed");
                api.LMSCommit("");
                alert("Marked as completed!");
            }
        }

        // Set score
        function setScore() {
            if (api != null) {
                api.LMSSetValue("cmi.core.score.raw", "80");
                api.LMSSetValue("cmi.core.score.min", "0");
                api.LMSSetValue("cmi.core.score.max", "100");
                api.LMSCommit("");
                alert("Score set to 80!");
            }
        }

        // Finish on unload
        window.onunload = function() {
            if (api != null) {
                api.LMSFinish("");
            }
        };
    </script>
</body>
</html>
```

**4. Zip folder menjadi `test-scorm.zip`**

## PART B: CMI5 (Computer Managed Instruction v5)

### Pengenalan CMI5

CMI5 adalah generasi terbaru dari standar e-learning yang menggantikan SCORM. Dikembangkan oleh AICC (Aviation Industry Computer-Based Training Committee) dan sekarang dikelola oleh ADL (Advanced Distributed Learning).

**⚠️ PENTING: CMI5 memerlukan LRS (Learning Record Store)**

Berbeda dengan SCORM, CMI5 **tidak bisa berjalan tanpa LRS**. Ini karena CMI5 menggunakan xAPI untuk tracking, yang memerlukan tempat penyimpanan statements (LRS).

**Keuntungan CMI5 vs SCORM:**

- **Modern Architecture**: Menggunakan xAPI (Experience API) untuk tracking yang lebih kaya
- **Better Tracking**: Melacak berbagai jenis learning experiences, bukan hanya quiz scores
- **Mobile Friendly**: Designed untuk mobile dan offline learning
- **Flexible Deployment**: Mendukung berbagai deployment scenarios
- **Better Security**: Improved authentication dan data security
- **Cross-Platform**: Tidak terbatas pada web browser

**Trade-offs:**
- ❌ Perlu LRS (setup lebih kompleks)
- ❌ Plugin tambahan untuk Moodle
- ❌ Learning curve lebih tinggi
- ✅ Tracking data jauh lebih kaya
- ✅ Future-proof standard

### Komponen CMI5

**cmi5 Package Structure:**
```
package.zip
├── cmi5.xml           # Course structure definition
├── index.html         # Launch page
├── tincan.xml         # xAPI configuration
└── resources/         # Learning content
    ├── lesson1/
    ├── lesson2/
    └── assets/
```

**cmi5.xml Example:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<courseStructure xmlns="https://w3id.org/xapi/profiles/cmi5/v1/CourseStructure.xsd">
    <course id="https://example.com/course/123">
        <title>
            <langstring lang="en">Introduction to CMI5</langstring>
        </title>
        <description>
            <langstring lang="en">Learn CMI5 basics</langstring>
        </description>
        <au id="https://example.com/course/123/au/1"
            launchMethod="OwnWindow"
            masteryScore="0.8">
            <title>
                <langstring lang="en">Lesson 1: Understanding CMI5</langstring>
            </title>
            <url>lesson1/index.html</url>
        </au>
    </course>
</courseStructure>
```

### Implementasi CMI5 di Moodle

#### Plugin Requirements

CMI5 memerlukan plugin tambahan di Moodle:

1. **Install CMI5 Plugin**
   ```bash
   # Download plugin dari Moodle plugins directory
   cd /path/to/moodle/mod/
   git clone https://github.com/xxxx/moodle-mod_cmi5launch.git cmi5launch

   # Atau install via Site administration
   ```

2. **Configure Plugin**
   - Site administration → Plugins → Activity modules → CMI5
   - Set LRS (Learning Record Store) endpoint
   - Configure authentication settings

#### Creating CMI5 Content

**1. Setup Development Environment:**
```javascript
// Initialize xAPI
var conf = {
    endpoint: "https://your-lrs.com/data/xAPI/",
    auth: "Basic " + btoa("username:password")
};

var tincan = new TinCan({
    recordStores: [{
        endpoint: conf.endpoint,
        username: conf.username,
        password: conf.password,
        allowFail: false
    }]
});
```

**2. Send Statements:**
```javascript
// Launch statement
var stmt = {
    actor: {
        objectType: "Agent",
        account: {
            homePage: "https://your-lms.com",
            name: "student@example.com"
        }
    },
    verb: {
        id: "http://adlnet.gov/expapi/verbs/launched",
        display: {"en-US": "launched"}
    },
    object: {
        id: "https://example.com/course/123/au/1",
        definition: {
            name: {"en-US": "Lesson 1"},
            type: "http://adlnet.gov/expapi/activities/lesson"
        }
    }
};

tincan.sendStatement(stmt);

// Completed statement
var completedStmt = {
    actor: stmt.actor,
    verb: {
        id: "http://adlnet.gov/expapi/verbs/completed",
        display: {"en-US": "completed"}
    },
    object: stmt.object,
    result: {
        completion: true,
        success: true,
        score: {
            scaled: 0.85,
            raw: 85,
            min: 0,
            max: 100
        },
        duration: "PT30M"  // ISO 8601 duration
    }
};

tincan.sendStatement(completedStmt);
```

### CMI5 vs SCORM Comparison

| Feature | SCORM 2004 | CMI5 |
|---------|-----------|------|
| **Data Model** | SCORM RTE | xAPI (TinCan) |
| **Tracking** | Quiz scores, completion | Any learning experience |
| **Mobile Support** | Limited | Excellent |
| **Offline Support** | Poor | Good |
| **Launch Method** | Browser only | Multiple methods |
| **Security** | Basic | Enhanced |
| **Data Format** | XML | JSON |
| **Adoption** | Widespread | Growing |

### CMI5 Best Practices

1. **Statement Design**
   - Use standard verb IDs from xAPI registry
   - Include meaningful context data
   - Follow ADL's cmi5 profile strictly

2. **Package Structure**
   - Keep packages modular
   - Include fallback content for older LMS
   - Test across different LRS implementations

3. **Testing**
   - Use cmi5 conformance test suite
   - Test in multiple browsers
   - Validate xAPI statements

### LRS (Learning Record Store)

CMI5 memerlukan LRS untuk menyimpan xAPI statements:

**Pilihan LRS yang Aktif Dimaintain:**

1. **Trax LRS** (Open Source - **Recommended**)
   - Self-hosted, Docker support
   - xAPI 1.0.3 compliant
   - Aktif dimaintain
   - Laravel-based, mudah di-deploy

2. **Ralph** (Open Source)
   - Modern Python-based LRS
   - Dikembangkan Kementerian Pendidikan Perancis
   - Cloud-native, Kubernetes ready
   - Aktif development

3. **Veracity Learning LRS** (Commercial)
   - Cloud-hosted
   - Enterprise features
   - Support 24/7

4. **Yet Analytics Watershed** (Commercial)
   - Advanced analytics
   - Multi-tenant
   - Integration tools

> **⚠️ Catatan**: Learning Locker sudah tidak dimaintain sejak 2020. Gunakan Trax LRS atau Ralph untuk deployment baru.

### Panduan Lengkap Setup LRS (Trax LRS)

#### Langkah 1: Install Trax LRS dengan Docker

**1. Buat docker-compose.yml untuk Trax LRS:**

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=traxlrs
      - MYSQL_USER=traxlrs
      - MYSQL_PASSWORD=traxlrspassword
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - lrs-network

  trax-lrs:
    image: traxlrs/traxlrs-apache:latest
    restart: unless-stopped
    depends_on:
      - mysql
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
      - APP_URL=http://localhost:8080
      - DB_CONNECTION=mysql
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_DATABASE=traxlrs
      - DB_USERNAME=traxlrs
      - DB_PASSWORD=traxlrspassword
      - TRAX_XP_STORE=on
      - TRAX_GATEWAY_ENABLED=off
    ports:
      - "8080:80"
    volumes:
      - trax-storage:/var/www/html/storage
    networks:
      - lrs-network

networks:
  lrs-network:
    driver: bridge

volumes:
  mysql-data:
  trax-storage:
```

**2. Jalankan Trax LRS:**

```bash
# Buat direktori
mkdir ~/trax-lrs
cd ~/trax-lrs

# Simpan docker-compose.yml
nano docker-compose.yml
# (paste config di atas)

# Jalankan containers
docker compose up -d

# Cek status
docker compose ps

# Lihat logs
docker compose logs -f trax-lrs
```

**3. Tunggu inisialisasi (30-60 detik)**

```bash
# Cek apakah LRS sudah ready
curl http://localhost:8080/trax/api/gateway/xapi

# Output yang diharapkan: 401 Unauthorized (normal, karena belum auth)
```

#### Langkah 2: Konfigurasi Trax LRS & Dapatkan Credentials

**1. Akses Trax LRS Admin UI:**

```
Buka browser: http://localhost:8080/trax
```

**2. Login sebagai Admin:**

```
Default credentials:
- Email: admin@traxlrs.com
- Password: ChangeMe!
```

**3. Buat Basic Store:**

```
Menu: Basic Stores → Create

Store Settings:
- Name: Moodle CMI5 Store
- Description: LRS untuk Moodle CMI5 content
- Click "Create"
```

**4. Buat Access Token untuk Moodle:**

```
Menu: Access Tokens → Create

Token Settings:
- Store: Pilih "Moodle CMI5 Store"
- Consumer: Moodle
- Authority: https://your-moodle.com
- Permissions: xAPI All Permissions
- Click "Create"

Simpan credentials yang di-generate:
✅ Basic HTTP: dXNlcjpwYXNz... (base64 encoded)
✅ Username: generated-username
✅ Password: generated-password
```

#### Langkah 3: Konfigurasi Moodle CMI5 Plugin

**1. Install CMI5 Plugin di Moodle:**

```bash
# SSH ke Moodle container
docker compose exec moodle sh

# Download plugin
cd /var/www/html/mod
wget https://moodle.org/plugins/download.php/xxxxx/mod_cmi5launch.zip
unzip mod_cmi5launch.zip
rm mod_cmi5launch.zip

# Set permissions
chown -R www-data:www-data cmi5launch
chmod -R 755 cmi5launch
```

**2. Selesaikan Instalasi via Moodle:**

```
Site administration → Notifications
- Klik "Upgrade Moodle database now"
- Tunggu sampai instalasi selesai
```

**3. Konfigurasi CMI5 Plugin:**

```
Site administration → Plugins → Activity modules → CMI5 Launch

LRS Settings:
- LRS Endpoint: http://localhost:8080/trax/api/gateway/xapi/
- LRS Key: generated-username (dari Trax LRS)
- LRS Secret: generated-password (dari Trax LRS)
- LRS Auth Method: Basic Auth

Additional Settings:
- Enable cmi5 AU registration: Yes
- Enable progress tracking: Yes
- Debug mode: Yes (untuk testing)

Klik "Save changes"
```

#### Langkah 4: Test Koneksi LRS

**1. Test dari Moodle:**

```
Site administration → Plugins → Activity modules → CMI5 Launch → Test Connection

Hasil yang diharapkan: ✅ Connection successful
```

**2. Test Manual dengan curl:**

```bash
# Test authentication
curl -X GET http://localhost:8080/trax/api/gateway/xapi/statements \
  -u "generated-username:generated-password" \
  -H "X-Experience-API-Version: 1.0.3"

# Expected: {"statements":[], "more":""}
```

**3. Buat Test CMI5 Package:**

Buat simple test package untuk memverifikasi tracking berfungsi.

#### Langkah 5: Deploy CMI5 Content

**1. Upload CMI5 Package ke Moodle:**

```
Course → Turn editing on → Add activity → CMI5 Launch

Settings:
- Activity name: Test CMI5 Lesson
- Package: Upload file .zip Anda
- Launch method: New window
- LRS settings: Use default (dari plugin config)

Save and display
```

**2. Test sebagai Student:**

```
1. Enroll sebagai student
2. Klik CMI5 activity
3. Selesaikan lesson
4. Cek apakah data tercatat di LRS
```

**3. Verifikasi di Trax LRS:**

```
Trax LRS UI → Data → Statements

Anda akan melihat:
- Initialized statement
- Launched statement
- Progressed statements
- Completed statement
- Passed/Failed statement (jika ada quiz)
```

#### Langkah 6: Troubleshooting LRS

**Masalah Umum:**

**1. Connection Refused**

```bash
# Cek apakah containers berjalan
docker compose ps

# Cek Trax LRS logs
docker compose logs trax-lrs

# Restart containers
docker compose restart
```

**2. Authentication Failed**

```bash
# Verifikasi credentials di Moodle sesuai dengan Trax LRS
# Buat ulang access token jika diperlukan

Trax LRS UI → Access Tokens → Delete old → Create new
```

**3. Statements Tidak Muncul**

```bash
# Aktifkan debug mode di Moodle CMI5 plugin
Site administration → Plugins → CMI5 Launch → Debug: ON

# Cek Moodle logs
Site administration → Reports → Logs
Filter by: CMI5 activity

# Cek MySQL langsung untuk statements
docker compose exec mysql sh
mysql -u traxlrs -ptraxlrspassword traxlrs
SELECT * FROM xapi_statements ORDER BY created_at DESC LIMIT 5;
```

**4. CORS Issues (jika akses dari domain berbeda)**

```yaml
# Tambahkan ke trax-lrs environment di docker-compose.yml
environment:
  - APP_ENV=production
  - APP_CORS_ALLOWED_ORIGINS=https://your-moodle.com
```

#### Langkah 7: Pertimbangan Production

**Security:**

```yaml
# Gunakan password yang kuat
environment:
  - MYSQL_ROOT_PASSWORD: [Generate 32-char random]
  - MYSQL_PASSWORD: [Generate 32-char random]
  - APP_KEY: [Generate dengan: php artisan key:generate]

# Gunakan HTTPS di production
  - APP_URL: https://lrs.yourdomain.com

# Batasi CORS
  - APP_CORS_ALLOWED_ORIGINS: https://moodle.yourdomain.com
```

**Performance:**

```yaml
# Tingkatkan MySQL resources
mysql:
  deploy:
    resources:
      limits:
        memory: 2G
        cpus: '2'
      reservations:
        memory: 1G
        cpus: '1'
```

**Backup:**

```bash
# Backup MySQL database
docker compose exec mysql sh -c \
  'mysqldump -u root -p$MYSQL_ROOT_PASSWORD traxlrs' \
  > backup-lrs-$(date +%Y%m%d).sql

# Backup volumes
docker run --rm \
  -v trax-lrs_mysql-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mysql-data-$(date +%Y%m%d).tar.gz -C /data .
```

### Alternative: Hosted LRS Solutions

Jika tidak ingin self-host, gunakan hosted LRS:

**1. Veracity Learning LRS**
- URL: https://www.veracitylrs.com/
- Pricing: From $500/year
- Features: Managed hosting, support, compliance

**2. Yet Analytics Watershed**
- URL: https://www.yetanalytics.com/
- Pricing: Enterprise (contact sales)
- Features: Advanced analytics, multi-tenant

**3. Learning Pool LRS**
- URL: https://learningpool.com/
- Pricing: Custom
- Features: Integration support, training

**Setup untuk Hosted LRS:**

```
1. Daftar akun di penyedia LRS pilihan Anda
2. Dapatkan API credentials (endpoint, key, secret)
3. Konfigurasi di Moodle:
   - LRS Endpoint: https://cloud.lrs.io/xapi/
   - LRS Key: provided-key
   - LRS Secret: provided-secret
4. Test koneksi
5. Deploy content
```

**Keuntungan Hosted:**
- ✅ Tidak perlu kelola infrastructure
- ✅ Backup otomatis
- ✅ Support 24/7
- ✅ Skalabilitas tinggi
- ✅ Compliance (GDPR, dll)

**Kerugian:**
- ❌ Biaya bulanan/tahunan
- ❌ Data di server eksternal
- ❌ Vendor lock-in

## PART C: H5P (HTML5 Package)

### Pengenalan H5P

H5P memungkinkan pembuatan, berbagi, dan menggunakan konten HTML5 interaktif. Keuntungan H5P:

- **Tidak perlu coding**: Antarmuka visual untuk membuat konten
- **Reusable**: Konten dapat dibagikan dan dimodifikasi
- **Interactive**: Berbagai jenis interaksi (drag-drop, quiz, games)
- **Responsive**: Otomatis menyesuaikan dengan device
- **Open Source**: Gratis dan dapat dikustomisasi

### Tipe Konten H5P Populer

1. **Interactive Video** - Video dengan pertanyaan embedded
2. **Course Presentation** - Slide presentasi interaktif
3. **Quiz (Question Set)** - Kumpulan pertanyaan
4. **Drag and Drop** - Aktivitas drag and drop
5. **Flashcards** - Kartu belajar digital
6. **Memory Game** - Permainan mencocokkan
7. **Timeline** - Timeline interaktif
8. **Interactive Book** - E-book dengan aktivitas

### Implementasi H5P di Moodle

#### Status Plugin

Di instalasi Moodle saat ini:
- ✅ **SCORM Plugin** - Sudah terinstal dan diaktifkan
- ✅ **H5P Plugin** - Sudah terinstal dan diaktifkan

### 1. Menambahkan H5P Content

**Metode 1: Melalui Antarmuka Moodle**

1. Masuk ke course dan aktifkan **Edit mode**
2. Klik **Add an activity or resource**
3. Pilih **H5P Interactive Content**
4. Klik **Add**

**Metode 2: URL Langsung**

```
http://localhost/course/modedit.php?add=h5pactivity&type=&course=[COURSE_ID]&section=0
```

### 2. Konfigurasi H5P

**General Settings:**

- **Name**: Nama aktivitas H5P
- **Description**: Deskripsi konten

**Package Settings:**

- **Package file**: Upload file .h5p
- **Display options**: Embed, Download, Copyright
- **H5P Content Type**: Pilih jenis konten

**Grade Settings:**

- **Grade to pass**: Nilai minimal untuk lulus
- **Maximum grade**: Nilai maksimum
- **Grade category**: Kategori nilai

**Completion Settings:**

- **Require view**: Harus dilihat
- **Require grade**: Harus mendapat nilai tertentu

### 3. Membuat Konten H5P

#### Menggunakan H5P Hub

1. Di halaman setting H5P, klik **Get H5P content types**
2. Browse konten dari H5P Hub
3. Download atau create new dari template

#### Membuat dari Scratch

1. Pilih **Content type**
2. Isi konten sesuai template
3. Preview sebelum save
4. Test di berbagai device

### 4. Contoh: Membuat Interactive Video

**Langkah-langkah:**

1. Upload video (MP4, WebM, atau YouTube URL)
2. Add interactions:
   - True/False questions
   - Multiple choice
   - Fill in the blanks
   - Text/Label
3. Set timing untuk setiap interaction
4. Configure behavior settings
5. Preview dan test

## Best Practices

### SCORM Best Practices

1. **Compatibility**
   - Gunakan SCORM 1.2 untuk kompatibilitas maksimal
   - Test di multiple browsers
   - Validate manifest file sebelum upload

2. **File Size**
   - Compress images dan media
   - Keep package size < 100MB
   - Use external hosting untuk large media files

3. **Tracking**
   - Test tracking data sebelum deploy
   - Document tracking requirements
   - Set completion criteria clearly

### H5P Best Practices

1. **Content Design**
   - Keep interactions simple dan clear
   - Use consistent design patterns
   - Provide immediate feedback

2. **Accessibility**
   - Add alt text untuk images
   - Ensure keyboard navigation works
   - Test with screen readers

3. **Performance**
   - Optimize media files
   - Test pada slow connections
   - Consider offline usage

## Troubleshooting

### Masalah SCORM Umum

**1. Plugin tidak muncul**
- Solusi: Site administration → Plugins → Activity modules → SCORM → Enable

**2. Upload gagal**
- Check file format (.zip)
- Verify `imsmanifest.xml` exists
- Check upload size limits (Site admin → Server → PHP info)

**3. Tracking tidak berfungsi**
- Check browser console for API errors
- Verify SCORM version compatibility
- Test dengan simple SCORM package dulu

**4. Display issues**
- Try different display modes
- Check popup blocker settings
- Verify iframe permissions

### Masalah H5P Umum

**1. Content tidak tampil**
- Clear cache (Site admin → Development → Purge caches)
- Check H5P library versions
- Verify file upload completed

**2. Grading tidak berfungsi**
- Ensure "Enable attempt review" is on
- Check grade aggregation settings
- Verify completion criteria

**3. Performance lambat**
- Optimize images dan videos
- Reduce number of interactions
- Use CDN untuk external resources

## Debugging

### Enable Debug Mode

```php
// config.php
$CFG->debug = E_ALL | E_STRICT;
$CFG->debugdisplay = 1;
```

### Check Plugin Status

1. Site administration → Notifications
2. Site administration → Plugins → Activity modules
3. Verify SCORM and H5P are "Enabled"

### View Error Logs

1. Site administration → Reports → Logs
2. Filter by SCORM or H5P activities
3. Check for error messages

## Resources

### SCORM Resources

- [ADL SCORM Documentation](https://adlnet.gov/scorm)
- [SCORM Cloud](https://cloud.scorm.com/) - Testing tool
- [iSpring Suite](https://www.ispringsolutions.com/) - Authoring tool
- [Articulate Storyline](https://articulate.com/360/storyline) - Authoring tool

### H5P Resources

- [H5P Official Site](https://h5p.org/)
- [H5P Content Types](https://h5p.org/content-types-and-applications)
- [H5P Examples](https://h5p.org/content-types-and-applications)
- [H5P Community Forum](https://h5p.org/forum)

### Moodle Documentation

- [Moodle SCORM Docs](https://docs.moodle.org/en/SCORM)
- [Moodle H5P Docs](https://docs.moodle.org/en/H5P)

---

**Berikutnya:** [Bab 11 - Learning Progress & Assessment →](learning-progress-tracking.md)
