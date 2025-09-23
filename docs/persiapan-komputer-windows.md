# Bab 2: Persiapan Komputer Windows

Pada bab ini, kita akan mempersiapkan komputer Windows Anda untuk menjalankan Moodle menggunakan Docker. Proses ini meliputi instalasi WSL 2 dan Docker Desktop.

## Persyaratan Sistem

### Minimum Requirements
- **Operating System**: Windows 10 version 2004 atau lebih tinggi (Build 19041+) atau Windows 11
- **Processor**: 64-bit processor dengan Second Level Address Translation (SLAT)
- **RAM**: 8 GB (minimum), 16 GB (recommended)
- **Storage**: 20 GB ruang kosong
- **Virtualization**: Harus diaktifkan di BIOS

### Cek Versi Windows
1. Tekan `Windows + R`
2. Ketik `winver` dan tekan Enter
3. Pastikan versi Anda memenuhi requirement

![Windows Version](images/windows-version.png)

## Langkah 1: Mengaktifkan Virtualization

### Cek Status Virtualization
1. Buka Task Manager (`Ctrl + Shift + Esc`)
2. Klik tab **Performance**
3. Pilih **CPU**
4. Lihat bagian **Virtualization** - harus **Enabled**

![Virtualization Status](images/virtualization-status.png)

### Mengaktifkan Virtualization di BIOS
Jika Virtualization belum aktif:

1. **Restart komputer** dan masuk BIOS/UEFI
   - Dell: Tekan F2 atau F12
   - HP: Tekan F10 atau Esc
   - Lenovo: Tekan F1 atau F2
   - ASUS: Tekan F2 atau Delete

2. Cari setting **Virtualization Technology** (VT-x/AMD-V)
   - Biasanya di: Advanced → CPU Configuration
   - Atau: Security → Virtualization

3. **Enable** Virtualization Technology
4. **Save and Exit** (biasanya F10)

## Langkah 2: Instalasi WSL 2

Windows Subsystem for Linux (WSL) memungkinkan kita menjalankan Linux environment di Windows.

### Install WSL 2

1. **Buka PowerShell sebagai Administrator**
   - Klik kanan Start Menu
   - Pilih "Windows PowerShell (Admin)"

2. **Install WSL dengan command berikut:**
   ```powershell
   wsl --install
   ```

   Command ini akan:
   - Enable WSL feature
   - Enable Virtual Machine Platform
   - Download dan install Linux kernel
   - Set WSL 2 sebagai default
   - Install Ubuntu sebagai default distro

3. **Restart komputer** setelah instalasi selesai

### Setup WSL Setelah Restart

1. Setelah restart, Ubuntu akan otomatis terbuka
2. Tunggu proses instalasi selesai (beberapa menit)
3. Buat **username** dan **password** untuk Ubuntu
   
   > **Note:** Password tidak akan terlihat saat diketik (normal untuk Linux)

### Verifikasi WSL Installation

Buka PowerShell dan jalankan:
```powershell
wsl --list --verbose
```

Output seharusnya:
```
NAME      STATE           VERSION
Ubuntu    Running         2
```

### Update WSL Kernel (Jika Diperlukan)

Jika ada error tentang kernel:
```powershell
wsl --update
```

## Langkah 3: Instalasi Docker Desktop

### Download Docker Desktop

1. Kunjungi [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. Klik **Download Docker Desktop**
3. Simpan file installer (sekitar 500MB)

### Install Docker Desktop

1. **Double-click** Docker Desktop Installer.exe
2. Pada configuration page, pastikan opsi berikut **dicentang**:
   - ✅ Use WSL 2 instead of Hyper-V
   - ✅ Add shortcut to desktop

3. Klik **Ok** untuk mulai instalasi
4. Tunggu proses instalasi (5-10 menit)
5. Klik **Close and restart** untuk restart komputer

### Konfigurasi Docker Desktop

Setelah restart:

1. **Docker Desktop akan start otomatis**
   - Jika tidak, cari "Docker Desktop" di Start Menu

2. **Accept Docker Subscription Service Agreement**

3. **Skip tutorial** (kita akan belajar langsung dengan praktik)

4. **Verifikasi WSL 2 Backend**:
   - Klik Docker icon di system tray
   - Pilih **Settings** (⚙️)
   - Di **General** tab, pastikan:
     - ✅ Use the WSL 2 based engine
   - Klik **Apply & restart**

### Konfigurasi Resources

1. Di Docker Desktop Settings
2. Pilih **Resources** → **WSL Integration**
3. Pastikan:
   - ✅ Enable integration with my default WSL distro
   - ✅ Ubuntu (atau distro yang Anda install)
4. Klik **Apply & restart**

![Docker WSL Integration](images/docker-wsl-integration.png)

## Langkah 4: Verifikasi Instalasi

### Test Docker dari Windows PowerShell

```powershell
docker --version
docker compose version
```

Output expected:
```
Docker version 24.0.x, build xxxxx
Docker Compose version v2.x.x
```

### Test Docker dari WSL

1. Buka Ubuntu/WSL:
   - Dari Start Menu, cari "Ubuntu"
   - Atau dari PowerShell, ketik: `wsl`

2. Test Docker commands:
   ```bash
   docker --version
   docker compose version
   docker run hello-world
   ```

### Test Docker Compose

Buat test file untuk verifikasi:

1. Di WSL/Ubuntu, buat directory:
   ```bash
   mkdir ~/docker-test
   cd ~/docker-test
   ```

2. Buat file `docker-compose.yml`:
   ```bash
   cat > docker-compose.yml << EOF
   version: '3'
   services:
     web:
       image: nginx:alpine
       ports:
         - "8080:80"
   EOF
   ```

3. Run test container:
   ```bash
   docker compose up -d
   ```

4. Test akses:
   - Dari WSL: `curl http://localhost:8080`
   - Dari Windows browser: `http://localhost:8080`

5. Stop dan clean up:
   ```bash
   docker compose down
   cd ~
   rm -rf docker-test
   ```

## Langkah 5: Instalasi Tools Tambahan (Optional)

### Git untuk Windows

1. Download dari [git-scm.com](https://git-scm.com/download/win)
2. Install dengan default settings
3. Verifikasi: `git --version`

### Visual Studio Code

1. Download dari [code.visualstudio.com](https://code.visualstudio.com)
2. Install dengan default settings
3. Install extensions:
   - Docker
   - Remote - WSL
   - YAML

### Windows Terminal (Recommended)

1. Install dari Microsoft Store
2. Memberikan better terminal experience
3. Support multiple tabs (PowerShell, CMD, WSL)

## Troubleshooting

### WSL 2 Installation Issues

**Error: "WSL 2 requires an update to its kernel component"**
- Download update dari: https://aka.ms/wsl2kernel
- Install dan restart

**Error: "Virtualization is not enabled"**
- Ikuti langkah aktivasi virtualization di BIOS

### Docker Desktop Issues

**Docker Desktop starting forever**
- Restart Docker Desktop
- Jika masih bermasalah, restart Windows

**Cannot connect to Docker daemon**
- Pastikan Docker Desktop running
- Check WSL integration di settings

**Port already in use**
- Ganti port di docker-compose.yml
- Atau stop aplikasi yang menggunakan port tersebut

### WSL Performance

Untuk meningkatkan performance WSL:

1. Buat file `.wslconfig` di `C:\Users\[username]\`
2. Isi dengan:
   ```ini
   [wsl2]
   memory=4GB
   processors=2
   swap=4GB
   ```
3. Restart WSL: `wsl --shutdown`

## Checklist Persiapan

Sebelum lanjut ke bab berikutnya, pastikan:

- [ ] Windows version 2004+ atau Windows 11
- [ ] Virtualization enabled di BIOS
- [ ] WSL 2 terinstall dengan Ubuntu
- [ ] Docker Desktop terinstall
- [ ] WSL integration enabled di Docker
- [ ] Docker commands berjalan di WSL dan PowerShell
- [ ] Test container nginx berhasil diakses

## Kesimpulan

Komputer Windows Anda sekarang siap untuk menjalankan Moodle dengan Docker Compose. Pada bab selanjutnya, kita akan:
- Setup struktur project Moodle
- Konfigurasi Docker Compose untuk Moodle
- Menjalankan Moodle container
- Mengakses Moodle dari browser

---

**Tips Performance:**
- Alokasikan minimum 4GB RAM untuk WSL
- Gunakan SSD untuk better I/O performance
- Close aplikasi yang tidak perlu saat running Docker
- Regular restart Docker Desktop untuk clear cache

**Next:** [Bab 3 - Setup Moodle dengan Docker Compose →](setup-moodle-docker-compose.md)