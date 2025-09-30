const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const MOODLE_URL = 'http://localhost:80';
const ADMIN_USERNAME = 'user';
const ADMIN_PASSWORD = 'bitnami';
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/img/course');

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
  let courseId;

  try {
    console.log('Starting Chapter 6 - Course Management Screenshots...');

    // Login as admin
    console.log('Logging in as admin...');
    await page.goto(MOODLE_URL + '/login/index.php', { waitUntil: 'networkidle' });
    await page.fill('#username', ADMIN_USERNAME);
    await page.fill('#password', ADMIN_PASSWORD);
    await page.click('#loginbtn');
    await page.waitForLoadState('networkidle');

    // Create a new course for screenshots
    console.log('Creating a new course...');
    await page.goto(MOODLE_URL + '/course/edit.php?category=1', { waitUntil: 'networkidle' });
    await page.fill('#id_fullname', 'Test Course for Screenshots');
    await page.fill('#id_shortname', 'TCS101');
    await page.click('#id_saveanddisplay');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    courseId = new URL(url).searchParams.get('id');
    console.log(`Course created with ID: ${courseId}`);

    // 1. Add a new course
    console.log('Taking screenshot: Add a new course...');
    await page.goto(MOODLE_URL + '/course/edit.php?category=1', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-add-new-course.png'),
      fullPage: false
    });

    // 2. Course settings
    console.log('Taking screenshot: Course settings...');
    await page.goto(MOODLE_URL + `/course/edit.php?id=${courseId}`, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-course-settings.png'),
      fullPage: false
    });

    // 4. Enrol users
    console.log('Taking screenshot: Enrol users...');
    await page.goto(MOODLE_URL + `/enrol/users.php?id=${courseId}`, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '04-enrol-users.png'),
      fullPage: false
    });

    // 5. Gradebook setup
    console.log('Taking screenshot: Gradebook setup...');
    await page.goto(MOODLE_URL + `/grade/edit/tree/index.php?id=${courseId}`, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-gradebook-setup.png'),
      fullPage: false
    });

    console.log('✅ Chapter 6 Course Management screenshots completed successfully!');

  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    // Delete the course
    if (courseId) {
      console.log(`Deleting course with ID: ${courseId}`);
      await page.goto(MOODLE_URL + `/course/delete.php?id=${courseId}`, { waitUntil: 'networkidle' });
      await page.click('button:has-text("Delete")');
      await page.waitForLoadState('networkidle');
      console.log('Course deleted.');
    }
    await browser.close();
  }
}

// Run the screenshot function
takeScreenshots().catch(console.error);
