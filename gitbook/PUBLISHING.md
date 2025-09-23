# Cara Publish GitBook

## Opsi 1: GitHub Pages (Gratis)

### Setup GitHub Pages

1. **Push repository ke GitHub:**
```bash
git add .
git commit -m "Add GitBook documentation"
git push origin master
```

2. **Install GitBook CLI:**
```bash
npm install -g gitbook-cli
cd gitbook
gitbook install
```

3. **Build GitBook:**
```bash
gitbook build
```

4. **Deploy ke GitHub Pages:**
```bash
# Install gh-pages
npm install -g gh-pages

# Deploy _book folder ke gh-pages branch
gh-pages -d _book

# Atau manual:
git subtree push --prefix gitbook/_book origin gh-pages
```

5. **Enable GitHub Pages:**
- Go to repository Settings
- Scroll to "Pages" section
- Source: Deploy from branch
- Branch: gh-pages
- Folder: / (root)
- Save

6. **Access your book:**
```
https://[username].github.io/[repository-name]/
```

## Opsi 2: GitBook.com (Cloud)

### Publish ke GitBook.com

1. **Create account di gitbook.com**
2. **Create new space**
3. **Sync dengan GitHub:**
   - Settings → Integrations → GitHub
   - Connect repository
   - Select branch: master
   - Root directory: /gitbook

## Opsi 3: Local Preview

### Build dan Preview Locally

1. **Install GitBook CLI:**
```bash
npm install -g gitbook-cli
```

2. **Install dependencies:**
```bash
cd gitbook
gitbook install
```

3. **Serve locally:**
```bash
gitbook serve
```

4. **Access di browser:**
```
http://localhost:4000
```

### Build static files:
```bash
gitbook build
# Output di folder _book/
```

## Opsi 4: Deploy ke Server

### Deploy ke VPS/Server

1. **Build GitBook:**
```bash
cd gitbook
gitbook build
```

2. **Copy ke server:**
```bash
scp -r _book/* user@server:/var/www/gitbook/
```

3. **Setup Nginx:**
```nginx
server {
    listen 80;
    server_name docs.yourdomain.com;
    root /var/www/gitbook;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Opsi 5: Docker Container

### Dockerize GitBook

1. **Create Dockerfile:**
```dockerfile
FROM node:14-alpine
WORKDIR /gitbook
COPY gitbook/ .
RUN npm install -g gitbook-cli
RUN gitbook install
RUN gitbook build
FROM nginx:alpine
COPY --from=0 /gitbook/_book /usr/share/nginx/html
```

2. **Build dan run:**
```bash
docker build -t moodle-gitbook .
docker run -p 8080:80 moodle-gitbook
```

## Opsi 6: Netlify (Gratis)

### Deploy ke Netlify

1. **Build locally:**
```bash
cd gitbook
gitbook build
```

2. **Drag & drop _book folder ke netlify.com**

Atau gunakan Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --dir=gitbook/_book --prod
```

## Opsi 7: Vercel (Gratis)

### Deploy ke Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd gitbook
gitbook build
cd _book
vercel --prod
```

## Script Automation

### Create deploy script (deploy.sh):
```bash
#!/bin/bash
cd gitbook
echo "Installing dependencies..."
gitbook install

echo "Building GitBook..."
gitbook build

echo "Deploying to GitHub Pages..."
gh-pages -d _book

echo "✅ Deployed successfully!"
echo "Visit: https://[username].github.io/[repo]/"
```

### Make executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## PDF Export

### Generate PDF:
```bash
cd gitbook
gitbook pdf . ./moodle-guide.pdf
```

### Generate eBook:
```bash
gitbook epub . ./moodle-guide.epub
gitbook mobi . ./moodle-guide.mobi
```

## Tips

1. **Custom Domain GitHub Pages:**
   - Create CNAME file in _book/
   - Add your domain

2. **Auto Deploy with GitHub Actions:**
```yaml
name: Deploy GitBook
on:
  push:
    branches: [master]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: |
          npm install -g gitbook-cli
          cd gitbook
          gitbook install
          gitbook build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./gitbook/_book
```

3. **Add Google Analytics:**
   Edit book.json:
```json
{
  "plugins": ["ga"],
  "pluginsConfig": {
    "ga": {
      "token": "UA-XXXX-Y"
    }
  }
}
```