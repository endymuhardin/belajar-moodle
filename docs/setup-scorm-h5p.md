# Setup SCORM and H5P di Moodle

Panduan ini menjelaskan cara mengatur dan menggunakan SCORM dan H5P di instalasi Moodle Anda.

## Status Plugin

Di instalasi Moodle saat ini:
- ✅ **SCORM Plugin** - Sudah terinstal dan diaktifkan
- ✅ **H5P Plugin** - Sudah terinstal dan diaktifkan

## Cara Menggunakan SCORM

### 1. Menambahkan SCORM Package melalui URL Langsung

Cara termudah untuk menambahkan SCORM package adalah dengan menggunakan URL langsung:

```
http://localhost/course/modedit.php?add=scorm&type=&course=[COURSE_ID]&section=0
```

### 2. Melalui Antarmuka Moodle

1. Masuk ke kursus Anda
2. Aktifkan mode edit dengan toggle "Edit mode"
3. Klik tombol "Add content" (⨁) di bagian mana pun
4. Pilih "Activity or resource" dari menu dropdown
5. Pilih "SCORM package" dari daftar aktivitas

### 3. Pengaturan SCORM

Setelah memilih SCORM package, Anda akan melihat halaman pengaturan:

- **Name**: Nama aktivitas SCORM
- **Description**: Deskripsi konten SCORM
- **Package**: Upload file SCORM (.zip)
- **Display options**: Cara menampilkan konten
- **Grade options**: Pengaturan penilaian
- **Attempts**: Jumlah percobaan yang diizinkan
- **Completion criteria**: Kriteria penyelesaian

## Cara Menggunakan H5P

### 1. Menambahkan H5P Content melalui URL Langsung

Cara termudah untuk menambahkan H5P content:

```
http://localhost/course/modedit.php?add=h5pactivity&type=&course=[COURSE_ID]&section=0
```

### 2. Melalui Antarmuka Moodle

1. Masuk ke kursus Anda
2. Aktifkan mode edit dengan toggle "Edit mode"
3. Klik tombol "Add content" (⨁) di bagian mana pun
4. Pilih "Activity or resource" dari menu dropdown
5. Pilih "H5P Interactive Content" dari daftar aktivitas

### 3. Pengaturan H5P

Setelah memilih H5P Interactive Content, Anda akan melihat halaman pengaturan:

- **Name**: Nama aktivitas H5P
- **Description**: Deskripsi konten H5P
- **H5P Content Type**: Pilih jenis konten H5P
- **Upload**: Upload file H5P atau buat baru
- **Display options**: Cara menampilkan konten
- **Grade options**: Pengaturan penilaian

## Contoh File SCORM dan H5P

### Contoh SCORM Package

Anda dapat membuat contoh SCORM package sederhana:

1. Buat folder bernama "scorm-content"
2. Tambahkan file `imsmanifest.xml`:
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
                <title>Test Content</title>
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

3. Tambahkan file `index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test SCORM Content</title>
</head>
<body>
    <h1>Test SCORM Content</h1>
    <p>This is a test SCORM package.</p>
    <script>
        // SCORM API initialization
        function findAPI(win) {
            while (win.API == null && win.parent != null && win.parent != win) {
                win = win.parent;
            }
            return win.API;
        }

        function initAPI() {
            var api = findAPI(window);
            if (api != null) {
                api.LMSInitialize("");
                api.LMSSetValue("cmi.core.lesson_status", "incomplete");
            }
        }

        window.onload = initAPI;
    </script>
</body>
</html>
```

4. Zip folder tersebut menjadi `test-scorm.zip`

### Contoh H5P Content

Anda dapat membuat berbagai jenis konten H5P:
- Interactive presentations
- Quizzes and questions
- Interactive videos
- Drag and drop activities
- Flashcards
- Games and simulations

## Troubleshooting

### Masalah Umum

1. **Plugin tidak muncul di activity chooser**
   - Pastikan plugin sudah diaktifkan di Site administration > Plugins > Activity modules
   - Refresh halaman kursus setelah mengaktifkan plugin

2. **Tidak bisa mengupload SCORM package**
   - Pastikan file berformat .zip
   - Periksa ukuran file (maksimal upload size)
   - Pastikan file berisi `imsmanifest.xml`

3. **H5P content tidak berfungsi**
   - Pastikan H5P plugin terinstal dengan benar
   - Periksa pengaturan H5P di Site administration
   - Coba gunakan H5P content type yang berbeda

### Debugging

Untuk memeriksa status plugin:

1. Kunjungi: Site administration > Notifications
2. Periksa ada notifikasi tentang plugin yang perlu diinstall
3. Kunjungi: Site administration > Plugins > Activity modules
4. Pastikan SCORM dan H5P dalam keadaan "Enabled"

## Screenshot Referensi

Berikut adalah screenshot yang menunjukkan plugin berfungsi dengan baik:

### SCORM Package Settings
![SCORM Settings](../img/scorm/01-scorm-add.png)

### H5P Interactive Content Settings
![H5P Settings](../img/advanced-courseware/01-interactive-content.png)

## Tips dan Best Practices

### SCORM Best Practices
- Gunakan SCORM versi 1.2 atau 2004 untuk kompatibilitas terbaik
- Test SCORM package di berbagai browser sebelum deploy
- Periksa tracking data untuk memastikan pelacakan progress berfungsi

### H5P Best Practices
- Pilih H5P content type yang sesuai dengan tujuan pembelajaran
- Gunakan H5P Hub untuk mendapatkan konten yang sudah dibuat
- Test interaktivitas di berbagai perangkat

## Dukungan

Jika Anda mengalami masalah:
1. Periksa dokumentasi resmi Moodle
2. Kunjungi forum Moodle community
3. Cek error logs di Site administration > Reports > Logs