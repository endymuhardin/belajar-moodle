# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Moodle learning and documentation project**, not the core Moodle LMS codebase. It's a comprehensive learning environment for understanding Moodle LMS installation, configuration, administration, and usage using Docker Compose. The project is written in Indonesian and serves as an educational platform for Moodle administrators and users.

## Development Environment

### Prerequisites
- **Docker Desktop**: Latest version for Windows/Mac/Linux
- **Node.js**: For Playwright screenshot automation
- **Python**: For MkDocs documentation generation
- **RAM**: Minimum 2GB (recommended 4GB+)
- **Disk Space**: Minimum 2GB for images and data
- **Ports**: 80 and 443 must be available

### Initial Setup
```bash
# Install Node.js dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Install Python dependencies
pip install -r requirements.txt

# Create volumes directory with proper permissions
mkdir -p volumes/mariadb volumes/moodle volumes/moodledata
chmod -R 777 volumes/
```

## Common Development Commands

### Docker Operations
```bash
# Start Moodle environment
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f

# Access Moodle container
docker compose exec moodle bash

# Check container status
docker compose ps
```

### Documentation Development
```bash
# Local preview (serves on http://127.0.0.1:8000)
mkdocs serve

# Build production site
mkdocs build

# Clean build
rm -rf site/ && mkdocs build
```

### Screenshot Automation
```bash
# Run all screenshots
cd screenshots && node run-all-screenshots.js

# Run specific chapter
node chapter3-installation/installation-screenshots.js
node chapter4-administration/admin-screenshots.js
node chapter5-user-management/user-screenshots.js
node chapter6-course-management/course-screenshots.js
```

## Architecture

### Docker Infrastructure
- **Moodle Application**: Bitnami Moodle 5.0 image
- **Database**: MariaDB with UTF-8 support
- **Volumes**: Persistent storage in `./volumes/`
  - `mariadb/`: Database files
  - `moodle/`: Application files
  - `moodledata/`: User uploads and data

### Documentation System
- **Source**: Markdown files in `/docs/`
- **Generator**: MkDocs with Material theme
- **Output**: Static site in `/site/`
- **Deployment**: GitHub Pages via GitHub Actions

### Screenshot Automation
- **Framework**: Playwright with Chromium
- **Structure**: Chapter-based organization
- **Output**: Categorized images in `docs/img/`

## Key Configuration Files

### docker-compose.yml
- Uses Bitnami Moodle 5.0 image
- Port mapping: 80→8080, 443→8443
- Environment variables for database configuration
- Default credentials: `user`/`bitnami`

### mkdocs.yml
- Material theme with Indonesian language support
- Comprehensive navigation structure
- Dark/light theme support
- GitHub Pages deployment configuration

### package.json
- Playwright dependency for screenshot automation
- Minimal configuration for documentation tools

## Development Workflow

### 1. Environment Management
```bash
# Start development environment
docker compose up -d

# Verify Moodle is running
curl -I http://localhost

# Access Moodle at http://localhost
# Default login: user / bitnami
```

### 2. Documentation Updates
- Edit markdown files in `/docs/`
- Preview changes with `mkdocs serve`
- Build and test before committing

### 3. Screenshot Generation
- Ensure Moodle is running before generating screenshots
- Screenshots are organized by chapter in `docs/img/`
- Run specific chapter scripts when making targeted updates

## Important Considerations

### File Permissions
- Bitnami containers require specific permissions (1001:1001)
- Use `chmod -R 777 volumes/` for development
- For production, use proper user ownership

### WSL2 Support (Windows)
- Special considerations for Windows + WSL2 setup
- May need to use WSL IP address instead of localhost
- Ensure Docker Desktop is configured for WSL2 backend

### Backup Strategy
- Database: `docker compose exec mariadb mysqldump`
- Files: Archive the `./volumes/` directory
- Configuration: Backup `docker-compose.yml` and environment files

## Deployment

### Automatic Deployment
- Triggered by push to master/main branch
- GitHub Actions builds MkDocs site
- Deploys to GitHub Pages
- Only triggered by changes to docs, mkdocs.yml, or workflow files

### Manual Deployment
```bash
# Build and test locally
mkdocs build

# Verify output in /site/ directory
# Push changes to trigger automatic deployment
```

## Troubleshooting

### Common Issues
1. **Permission denied**: Set proper permissions on volumes directory
2. **Port conflicts**: Change port mapping in docker-compose.yml
3. **Connection refused**: Wait 2-3 minutes after container start
4. **Screenshot failures**: Verify Moodle is accessible and credentials are correct

### Debug Commands
```bash
# Check container logs
docker compose logs moodle
docker compose logs mariadb

# Restart services
docker compose restart

# Rebuild containers
docker compose down && docker compose up -d --force-recreate
```

## Project Structure

```
moodle/
├── docs/                    # Markdown documentation
├── screenshots/            # Playwright automation scripts
├── site/                   # Generated MkDocs site
├── volumes/               # Docker persistent data
├── .github/workflows/     # GitHub Actions
├── docker-compose.yml     # Docker configuration
├── mkdocs.yml            # Documentation configuration
├── package.json          # Node.js dependencies
└── requirements.txt      # Python dependencies
```

This project combines practical Docker deployment with comprehensive documentation and automated visual documentation generation, designed specifically for educational purposes.