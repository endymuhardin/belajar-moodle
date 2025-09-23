# Deploy GitBook via GitHub Actions

## Setup Instructions

### 1. Enable GitHub Pages in Repository

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under **Build and deployment**:
   - Source: **GitHub Actions**
   - Save changes

### 2. Commit and Push Changes

```bash
# Add all GitBook files
git add .

# Commit changes
git commit -m "Add GitBook documentation with GitHub Actions deployment"

# Push to GitHub
git push origin master
```

### 3. GitHub Actions Will Automatically:

1. **Trigger on:**
   - Any push to master/main branch
   - Changes to files in `gitbook/` directory
   - Manual workflow dispatch

2. **Build Process:**
   - Install Node.js 16
   - Install GitBook CLI
   - Install GitBook plugins
   - Build static HTML files
   - Deploy to GitHub Pages

### 4. Access Your Published GitBook

After the workflow completes (5-10 minutes):

```
https://[your-github-username].github.io/[repository-name]/
```

Example:
```
https://username.github.io/moodle/
```

## Monitor Deployment

### Check Workflow Status

1. Go to **Actions** tab in your repository
2. Click on **Deploy GitBook to GitHub Pages** workflow
3. View build logs and status

### Common Issues and Solutions

#### Build Fails

**Error: GitBook installation fails**
- Solution: Check Node.js version compatibility
- The workflow uses Node 16 for best compatibility

**Error: Permission denied**
- Solution: Check repository settings
- Ensure GitHub Actions has write permissions

#### Pages Not Showing

**404 Error**
- Wait 10-15 minutes for GitHub Pages to propagate
- Check if workflow completed successfully
- Verify Pages is enabled in repository settings

#### Custom Domain

To use custom domain:

1. Create `CNAME` file in `gitbook/` directory:
```
docs.yourdomain.com
```

2. Configure DNS:
- Add CNAME record pointing to `[username].github.io`
- Or A records to GitHub Pages IPs

## Manual Trigger

You can manually trigger the deployment:

1. Go to **Actions** tab
2. Select **Deploy GitBook to GitHub Pages**
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Local Testing Before Deploy

Test your GitBook locally first:

```bash
cd gitbook

# Install dependencies
npm install -g gitbook-cli
gitbook install

# Serve locally
gitbook serve

# Open browser
# http://localhost:4000
```

## Update GitBook Content

To update content:

1. Edit markdown files in `gitbook/chapters/`
2. Update `SUMMARY.md` for navigation
3. Commit and push changes
4. GitHub Actions will auto-deploy

```bash
git add gitbook/
git commit -m "Update GitBook content"
git push
```

## Workflow Configuration

The GitHub Action workflow (`.github/workflows/deploy-gitbook.yml`) is configured to:

- Use latest stable versions
- Cache dependencies for faster builds
- Deploy using official GitHub Pages action
- Support both `master` and `main` branches

## Advanced Configuration

### Add Custom Plugins

Edit `gitbook/book.json`:
```json
{
  "plugins": ["plugin-name"],
  "pluginsConfig": {
    "plugin-name": {
      "config": "value"
    }
  }
}
```

### Generate PDF/eBook Versions

Add to workflow:
```yaml
- name: Generate PDF
  working-directory: ./gitbook
  run: |
    sudo apt-get install calibre
    gitbook pdf . ./moodle-guide.pdf
    
- name: Upload PDF
  uses: actions/upload-artifact@v3
  with:
    name: moodle-guide-pdf
    path: gitbook/moodle-guide.pdf
```

## Support

If you encounter issues:
1. Check Actions tab for error logs
2. Verify all files are committed
3. Ensure repository is public or has Pages enabled for private repos
4. Create an issue in the repository

---

**Success! Your GitBook will be automatically deployed to GitHub Pages whenever you push changes.**