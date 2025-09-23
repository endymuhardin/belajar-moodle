const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const MOODLE_URL = 'http://localhost:80';
const ADMIN_USERNAME = 'user';
const ADMIN_PASSWORD = 'bitnami';
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/img/administrasi');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function takeScreenshots() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    console.log('Starting Chapter 4 - Administration Screenshots...');

    // Login as admin
    console.log('Logging in as admin...');
    await page.goto(MOODLE_URL + '/login/index.php', { waitUntil: 'networkidle' });
    await page.fill('#username', ADMIN_USERNAME);
    await page.fill('#password', ADMIN_PASSWORD);
    await page.click('#loginbtn');
    await page.waitForLoadState('networkidle');

    // 1. Site Administration Main Page
    console.log('Taking screenshot: Site administration main page...');
    await page.goto(MOODLE_URL + '/admin/search.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-site-administration-main.png'),
      fullPage: false
    });

    // 2. Basic Settings
    console.log('Taking screenshot: Basic settings...');
    await page.goto(MOODLE_URL + '/admin/settings.php?section=frontpagesettings', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-basic-settings.png'),
      fullPage: false
    });

    // 3. Language Settings
    console.log('Taking screenshot: Language settings...');
    await page.goto(MOODLE_URL + '/admin/settings.php?section=langsettings', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '03-language-settings.png'),
      fullPage: false
    });

    // 4. Authentication Methods
    console.log('Taking screenshot: Authentication methods...');
    await page.goto(MOODLE_URL + '/admin/settings.php?section=manageauths', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '04-authentication-methods.png'),
      fullPage: false
    });

    // 5. Security Settings
    console.log('Taking screenshot: Security settings...');
    await page.goto(MOODLE_URL + '/admin/settings.php?section=sitepolicies', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-security-settings.png'),
      fullPage: false
    });

    // 6. Theme Selector
    console.log('Taking screenshot: Theme selector...');
    await page.goto(MOODLE_URL + '/admin/settings.php?section=themesettings', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-theme-selector.png'),
      fullPage: false
    });

    // 7. Available Themes Gallery
    console.log('Taking screenshot: Available themes...');
    await page.goto(MOODLE_URL + '/theme/index.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '07-available-themes.png'),
      fullPage: false
    });

    // 8. Course Default Settings
    console.log('Taking screenshot: Course default settings...');
    await page.goto(MOODLE_URL + '/admin/settings.php?section=coursedefaultsettings', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '08-course-defaults.png'),
      fullPage: false
    });

    // 9. Backup Settings
    console.log('Taking screenshot: Backup settings...');
    await page.goto(MOODLE_URL + '/admin/settings.php?section=automated', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '09-backup-settings.png'),
      fullPage: false
    });

    // 10. Plugins Overview
    console.log('Taking screenshot: Plugins overview...');
    await page.goto(MOODLE_URL + '/admin/plugins.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '10-plugins-overview.png'),
      fullPage: false
    });

    // 11. System Information
    console.log('Taking screenshot: System information...');
    await page.goto(MOODLE_URL + '/admin/environment.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '11-system-information.png'),
      fullPage: false
    });

    // 12. Server PHP Info
    console.log('Taking screenshot: PHP info...');
    await page.goto(MOODLE_URL + '/admin/phpinfo.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '12-php-info.png'),
      fullPage: false
    });

    // 13. Maintenance Mode
    console.log('Taking screenshot: Maintenance mode...');
    await page.goto(MOODLE_URL + '/admin/settings.php?section=maintenancemode', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '13-maintenance-mode.png'),
      fullPage: false
    });

    // 14. Notifications Page
    console.log('Taking screenshot: Notifications...');
    await page.goto(MOODLE_URL + '/admin/index.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '14-notifications.png'),
      fullPage: false
    });

    // 15. Reports Overview
    console.log('Taking screenshot: Reports...');
    await page.goto(MOODLE_URL + '/admin/category.php?category=reports', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '15-reports.png'),
      fullPage: false
    });

    console.log('✅ Chapter 4 Administration screenshots completed successfully!');

  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot function
takeScreenshots().catch(console.error);