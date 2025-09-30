const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const MOODLE_URL = 'http://localhost:80';
const ADMIN_USERNAME = 'user';
const ADMIN_PASSWORD = 'bitnami';
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/img/courseware');

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
        console.log('Starting Chapter 7 - Courseware Authoring Screenshots...');

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
        await page.fill('#id_fullname', 'Courseware Authoring Demo');
        await page.fill('#id_shortname', 'CA101');
        await page.click('#id_saveanddisplay');
        await page.waitForLoadState('networkidle');
        const url = page.url();
        courseId = new URL(url).searchParams.get('id');
        console.log(`Course created with ID: ${courseId}`);

        // 1. Course settings with completion tracking
        console.log('Taking screenshot: Course settings with completion tracking...');
        await page.goto(MOODLE_URL + `/course/edit.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Scroll to completion settings
        await page.evaluate(() => {
            const element = document.querySelector('#id_completionenable');
            if (element) element.scrollIntoView();
        });

        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '01-course-settings-completion.png'),
            fullPage: false
        });

        // 2. Course view with editing on
        console.log('Taking screenshot: Course view with editing...');
        await page.goto(MOODLE_URL + `/course/view.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        // Turn editing on using the toggle switch
        try {
            await page.click('.form-check-input[name="setmode"]', { timeout: 5000 });
            await page.waitForTimeout(2000); // Wait for edit mode to activate
        } catch (e) {
            console.log('Edit mode toggle not found, continuing...');
        }

        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '02-course-view-edit.png'),
            fullPage: false
        });

        // 3. Activity chooser dialog
        console.log('Taking screenshot: Activity chooser...');
        await page.goto(MOODLE_URL + `/course/view.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        // Try to click add activity - look for available activity buttons
        try {
            // Try different selectors for add activity buttons
            const activityButtonSelectors = [
                'button[title*="Add"]',
                '.btn[title*="activity"]',
                '.btn[title*="resource"]',
                'button:has-text("Add")',
                '.dropdown-toggle'
            ];

            for (const selector of activityButtonSelectors) {
                const button = await page.$(selector);
                if (button) {
                    await button.click();
                    await page.waitForTimeout(1000);
                    break;
                }
            }
        } catch (e) {
            console.log('Add activity button not found, continuing...');
        }

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '03-activity-chooser.png'),
            fullPage: false
        });

        // 4. Gradebook setup
        console.log('Taking screenshot: Gradebook setup...');
        await page.goto(MOODLE_URL + `/grade/index.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        try {
            await page.click('text=Setup', { timeout: 5000 });
            await page.click('text=Gradebook setup', { timeout: 5000 });
            await page.waitForLoadState('networkidle');
        } catch (e) {
            console.log('Gradebook setup not found, continuing...');
        }

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '04-gradebook-setup.png'),
            fullPage: false
        });

        // 5. Course completion settings
        console.log('Taking screenshot: Course completion settings...');
        await page.goto(MOODLE_URL + `/course/completion.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '05-course-completion.png'),
            fullPage: false
        });

        // 6. Competencies management
        console.log('Taking screenshot: Competencies management...');
        await page.goto(MOODLE_URL + `/admin/tool/lp/coursecompetencies.php?courseid=${courseId}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '06-competencies.png'),
            fullPage: false
        });

        // 7. Badges management
        console.log('Taking screenshot: Badges management...');
        await page.goto(MOODLE_URL + `/badges/view.php?type=1&id=${courseId}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '07-badges.png'),
            fullPage: false
        });

        // 8. Course reports
        console.log('Taking screenshot: Course reports...');
        await page.goto(MOODLE_URL + `/report/outline/index.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '08-course-reports.png'),
            fullPage: false
        });

        // 9. Learning analytics
        console.log('Taking screenshot: Learning analytics...');
        await page.goto(MOODLE_URL + `/report/analytics/index.php`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '09-analytics.png'),
            fullPage: false
        });

        // 10. Final course overview
        console.log('Taking screenshot: Final course overview...');
        await page.goto(MOODLE_URL + `/course/view.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '10-course-overview.png'),
            fullPage: false
        });

        console.log('✅ Chapter 7 Courseware Authoring screenshots completed successfully!');

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