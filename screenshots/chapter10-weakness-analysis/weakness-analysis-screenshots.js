const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const MOODLE_URL = 'http://localhost:80';
const ADMIN_USERNAME = 'user';
const ADMIN_PASSWORD = 'bitnami';
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/img/weakness-analysis');

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
        console.log('Starting Chapter 10 - Weakness Analysis Screenshots...');

        // Login as admin
        console.log('Logging in as admin...');
        await page.goto(MOODLE_URL + '/login/index.php', { waitUntil: 'networkidle' });
        await page.fill('#username', ADMIN_USERNAME);
        await page.fill('#password', ADMIN_PASSWORD);
        await page.click('#loginbtn');
        await page.waitForLoadState('networkidle');

        // 1. Site administration reports
        console.log('Taking screenshot: Site administration reports...');
        await page.goto(MOODLE_URL + `/admin/search.php?query=report`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '01-site-reports.png'),
            fullPage: false
        });

        // 2. Course overview reports
        console.log('Taking screenshot: Course overview reports...');
        await page.goto(MOODLE_URL + `/report/courseoverview/index.php`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '02-course-overview.png'),
            fullPage: false
        });

        // 3. Performance overview
        console.log('Taking screenshot: Performance overview...');
        await page.goto(MOODLE_URL + `/admin/tool/task/scheduledtasks.php`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '03-performance-overview.png'),
            fullPage: false
        });

        // 4. Security overview
        console.log('Taking screenshot: Security overview...');
        await page.goto(MOODLE_URL + `/admin/tool/securitysettings/index.php`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '04-security-overview.png'),
            fullPage: false
        });

        // 5. Outcomes and reports
        console.log('Taking screenshot: Outcomes and reports...');
        await page.goto(MOODLE_URL + `/grade/edit/outcome/course.php?id=1`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '05-outcomes-reports.png'),
            fullPage: false
        });

        // 6. Competency frameworks
        console.log('Taking screenshot: Competency frameworks...');
        await page.goto(MOODLE_URL + `/admin/tool/lp/competencyframeworks.php`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '06-competency-frameworks.png'),
            fullPage: false
        });

        // 7. Learning plan templates
        console.log('Taking screenshot: Learning plan templates...');
        await page.goto(MOODLE_URL + `/admin/tool/lp/learningplantemplates.php`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '07-learning-templates.png'),
            fullPage: false
        });

        // 8. Badges management
        console.log('Taking screenshot: Badges management...');
        await page.goto(MOODLE_URL + `/badges/index.php?type=1`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '08-badges-management.png'),
            fullPage: false
        });

        // 9. Question bank analysis
        console.log('Taking screenshot: Question bank analysis...');
        await page.goto(MOODLE_URL + `/question/edit.php?courseid=1`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '09-question-bank.png'),
            fullPage: false
        });

        // 10. Workshop assessment
        console.log('Taking screenshot: Workshop assessment...');
        await page.goto(MOODLE_URL + `/mod/workshop/allexamples.php`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '10-workshop-assessment.png'),
            fullPage: false
        });

        console.log('✅ Chapter 10 Weakness Analysis screenshots completed successfully!');

    } catch (error) {
        console.error('Error taking screenshots:', error);
    } finally {
        await browser.close();
    }
}

// Run the screenshot function
takeScreenshots().catch(console.error);