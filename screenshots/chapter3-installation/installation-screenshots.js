const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const MOODLE_URL = 'http://localhost:80';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin123!';
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/img/instalasi');

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
    console.log('Starting Chapter 3 - Installation Screenshots...');

    // 1. Moodle Homepage
    console.log('Taking screenshot: Moodle homepage...');
    await page.goto(MOODLE_URL, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-moodle-homepage.png'),
      fullPage: false
    });

    // 2. Login Page
    console.log('Taking screenshot: Login page...');
    await page.click('text=Log in');
    await page.waitForSelector('#username');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-login-page.png'),
      fullPage: false
    });

    // 3. Login Process
    console.log('Logging in as admin...');
    await page.fill('#username', ADMIN_USERNAME);
    await page.fill('#password', ADMIN_PASSWORD);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '03-login-filled.png'),
      fullPage: false
    });

    // 4. Click login
    await page.click('#loginbtn');
    await page.waitForLoadState('networkidle');

    // 5. Dashboard after login
    console.log('Taking screenshot: Dashboard...');
    await page.waitForTimeout(2000); // Wait for dashboard to fully load
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '04-dashboard.png'),
      fullPage: false
    });

    // 6. Site Administration Menu
    console.log('Taking screenshot: Site administration...');
    // Try to find and click Site Administration
    try {
      // First try the drawer toggle
      const drawerToggle = await page.$('[data-preference="drawer-open-nav"]');
      if (drawerToggle) {
        await drawerToggle.click();
        await page.waitForTimeout(500);
      }

      // Look for Site administration link
      const siteAdminLink = await page.$('text=Site administration');
      if (siteAdminLink) {
        await siteAdminLink.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('Could not find Site administration in drawer, trying direct URL...');
      await page.goto(MOODLE_URL + '/admin/search.php', { waitUntil: 'networkidle' });
    }

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-site-administration.png'),
      fullPage: false
    });

    // 7. System Information
    console.log('Taking screenshot: System information...');
    await page.goto(MOODLE_URL + '/admin/environment.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-system-environment.png'),
      fullPage: false
    });

    // 8. Users List
    console.log('Taking screenshot: Users list...');
    await page.goto(MOODLE_URL + '/admin/user.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '07-users-list.png'),
      fullPage: false
    });

    // 9. Courses Page
    console.log('Taking screenshot: Courses management...');
    await page.goto(MOODLE_URL + '/course/management.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '08-course-management.png'),
      fullPage: false
    });

    // 10. Docker Compose Terminal (simulated)
    console.log('Taking screenshot: Terminal view...');
    await page.setContent(`
      <html>
        <head>
          <style>
            body {
              margin: 0;
              background: #1e1e1e;
              color: #d4d4d4;
              font-family: 'Consolas', 'Monaco', monospace;
              padding: 20px;
            }
            .terminal {
              background: #1e1e1e;
              padding: 15px;
              border-radius: 5px;
            }
            .prompt { color: #569cd6; }
            .command { color: #ce9178; }
            .output { color: #d4d4d4; margin-left: 0; }
            .success { color: #4ec9b0; }
            pre { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="terminal">
            <pre><span class="prompt">$</span> <span class="command">docker compose up -d</span></pre>
            <pre class="output">Creating network "moodle_default" with the default driver</pre>
            <pre class="output">Creating volume "moodle_mariadb_data" with default driver</pre>
            <pre class="output">Creating volume "moodle_moodle_data" with default driver</pre>
            <pre class="output">Creating volume "moodle_moodledata_data" with default driver</pre>
            <pre class="success">Creating moodle_mariadb_1 ... done</pre>
            <pre class="success">Creating moodle_moodle_1  ... done</pre>
            <pre></pre>
            <pre><span class="prompt">$</span> <span class="command">docker compose ps</span></pre>
            <pre class="output">NAME                IMAGE                    STATUS          PORTS</pre>
            <pre class="output">moodle_mariadb_1    mariadb:10.11           Up 2 minutes    3306/tcp</pre>
            <pre class="output">moodle_moodle_1     bitnami/moodle:4.4      Up 2 minutes    0.0.0.0:8080->8080/tcp</pre>
          </div>
        </body>
      </html>
    `);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '09-docker-terminal.png'),
      fullPage: false
    });

    console.log('✅ Chapter 3 screenshots completed successfully!');

  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot function
takeScreenshots().catch(console.error);