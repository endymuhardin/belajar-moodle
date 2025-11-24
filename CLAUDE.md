# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Moodle documentation project written in Indonesian. Contains MkDocs-based learning materials and Playwright scripts for automated screenshot generation. Not the Moodle LMS codebase itself.

## Commands

### Docker (Moodle Environment)
```bash
docker compose up -d          # Start Moodle + PostgreSQL
docker compose down           # Stop containers
docker compose logs -f        # View logs
docker compose exec moodle sh # Access container shell
docker compose exec postgres psql -U moodle -d moodle  # Access database
```

### MkDocs (Documentation)
```bash
mkdocs serve                  # Preview at http://127.0.0.1:8000
mkdocs build                  # Build static site to /site/
```

### Playwright (Screenshots)
```bash
cd screenshots
node run-all-screenshots.js   # Generate all screenshots

# Individual chapters (run from screenshots/ directory)
node chapter3-installation/installation-screenshots.js
node chapter4-administration/admin-screenshots.js
node chapter5-user-management/user-screenshots.js
node chapter6-course-management/course-screenshots.js
node chapter7-courseware/courseware-screenshots.js
node chapter8-scorm/scorm-screenshots.js
node chapter9-progress-tracking/progress-tracking-screenshots.js
node chapter10-weakness-analysis/weakness-analysis-screenshots.js
node chapter11-advanced-courseware/advanced-courseware-screenshots.js
```

### Setup
```bash
npm install                   # Node.js dependencies
npx playwright install chromium
pip install -r requirements.txt
```

### Ansible (VPS Deployment)
```bash
cd ansible

# Deploy Moodle to VPS (requires MOODLE_DB_PASSWORD and MOODLE_ADMIN_PASSWORD env vars)
export MOODLE_DB_PASSWORD=your_db_password
export MOODLE_ADMIN_PASSWORD=your_admin_password
ansible-playbook playbook.yml

# Setup SSL after initial deployment
ansible-playbook ssl.yml

# Run specific role only
ansible-playbook playbook.yml --tags nginx
```

## Architecture

### Docker Stack
- **erseco/alpine-moodle:v5.1.0** on ports 80/443
- **PostgreSQL 17 Alpine** for database
- Docker-managed volumes: `moodledata`, `moodlehtml`, `postgresdata`
- Moodle credentials: `admin` / `admin123`

### Documentation Pipeline
- Source: Markdown in `docs/`
- Screenshots: `docs/img/{category}/`
- Output: `site/` (gitignored)
- Deployment: GitHub Actions → GitHub Pages (triggers on docs/mkdocs.yml changes)

### Screenshot Scripts
Each chapter script in `screenshots/chapter{N}-{name}/` logs into Moodle and captures UI screenshots. Scripts use consistent config:
```javascript
const MOODLE_URL = 'http://localhost:80';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
```

### Ansible VPS Stack
- Target: `moodle.artivisi.id` (Ubuntu)
- Components: Nginx + PHP 8.3-FPM + PostgreSQL
- Roles: `base` → `postgresql` → `php` → `nginx` → `moodle`
- Moodle installed to `/var/www/moodle`, data in `/var/www/moodledata`

## Key Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Moodle + PostgreSQL containers |
| `mkdocs.yml` | Documentation config, nav structure |
| `screenshots/run-all-screenshots.js` | Runs all chapter scripts sequentially |
| `.github/workflows/deploy-mkdocs.yml` | Auto-deploy on push to master |
| `ansible/playbook.yml` | Main Ansible playbook for VPS deployment |
| `ansible/inventory.yml` | VPS host configuration |
| `ansible/ssl.yml` | Let's Encrypt SSL setup |

## Notes

- Screenshot scripts require Moodle running and accessible at localhost
- Wait 2-3 minutes after `docker compose up -d` for Moodle to initialize
- WSL2 users may need to use WSL IP instead of localhost for Windows browser access