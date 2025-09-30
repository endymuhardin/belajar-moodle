const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const MOODLE_URL = 'http://localhost:80';
const ADMIN_USERNAME = 'user';
const ADMIN_PASSWORD = 'bitnami';
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/img/progress-tracking');

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
        console.log('Starting Chapter 9 - Learning Progress Tracking Screenshots...');

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
        await page.fill('#id_fullname', 'Learning Progress Tracking Demo');
        await page.fill('#id_shortname', 'LPT101');
        await page.click('#id_saveanddisplay');
        await page.waitForLoadState('networkidle');
        const url = page.url();
        courseId = new URL(url).searchParams.get('id');
        console.log(`Course created with ID: ${courseId}`);

        // 1. Course completion settings
        console.log('Taking screenshot: Course completion settings...');
        await page.goto(MOODLE_URL + `/course/edit.php?id=${courseId}`, { waitUntil: 'networkidle' });

        // Try to enable completion settings
        try {
            await page.click('#id_completionenable', { timeout: 3000 });
            await page.click('#id_completionstartonenrol', { timeout: 3000 });
            await page.click('#id_completionprogress', { timeout: 3000 });
        } catch (e) {
            console.log('Completion settings not available, continuing...');
        }

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '01-course-completion-settings.png'),
            fullPage: false
        });

        // 2. Activity completion setup
        console.log('Taking screenshot: Activity completion setup...');
        await page.goto(MOODLE_URL + `/course/view.php?id=${courseId}`, { waitUntil: 'networkidle' });
        // Turn editing on using the toggle switch
        try {
            await page.click('.form-check-input[name="setmode"]', { timeout: 5000 });
            await page.waitForTimeout(2000);
        } catch (e) {
            console.log('Edit mode toggle not found, continuing...');
        }

        // Try to add a page with completion criteria
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

            // Try to add a page (if activity chooser opens)
            try {
                await page.click('text=Page', { timeout: 3000 });
                await page.click('#id_name');
                await page.fill('#id_name', 'Module 1: Introduction');
                await page.click('#id_page_editoreditable');
                await page.fill('#id_page_editoreditable', '<h2>Module 1 Content</h2><p>Welcome to the first module.</p>');

                // Set completion criteria
                await page.click('#id_completion');
                await page.selectOption('#id_completion', '1');
                await page.click('#id_saveandreturn');
                await page.waitForLoadState('networkidle');
            } catch (e) {
                console.log('Could not add page activity, continuing...');
            }
        } catch (e) {
            console.log('Add activity button not found, continuing...');
        }
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '02-activity-completion.png'),
            fullPage: false
        });

        // 3. Gradebook setup
        console.log('Taking screenshot: Gradebook setup...');
        await page.goto(MOODLE_URL + `/grade/index.php?id=${courseId}`, { waitUntil: 'networkidle' });

        try {
            await page.click('text=Setup', { timeout: 3000 });
            await page.click('text=Gradebook setup', { timeout: 3000 });
            await page.waitForLoadState('networkidle');
        } catch (e) {
            console.log('Gradebook setup not found, continuing...');
        }

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '03-gradebook-setup.png'),
            fullPage: false
        });

        // 4. Grade categories
        console.log('Taking screenshot: Grade categories...');
        try {
            await page.click('text=Add category', { timeout: 3000 });
            await page.fill('#id_fullname', 'Assessments');
            await page.click('#id_savechanges');
            await page.waitForLoadState('networkidle');
        } catch (e) {
            console.log('Grade categories not available, continuing...');
        }

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '04-grade-categories.png'),
            fullPage: false
        });

        // 5. Course completion status
        console.log('Taking screenshot: Course completion status...');
        await page.goto(MOODLE_URL + `/course/completion.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '05-completion-status.png'),
            fullPage: false
        });

        // 6. Progress report
        console.log('Taking screenshot: Progress report...');
        await page.goto(MOODLE_URL + `/report/progress/index.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '06-progress-report.png'),
            fullPage: false
        });

        // 7. Activity report
        console.log('Taking screenshot: Activity report...');
        await page.goto(MOODLE_URL + `/report/outline/index.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '07-activity-report.png'),
            fullPage: false
        });

        // 8. Competencies framework
        console.log('Taking screenshot: Competencies framework...');
        await page.goto(MOODLE_URL + `/admin/tool/lp/coursecompetencies.php?courseid=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '08-competencies.png'),
            fullPage: false
        });

        // 9. Learning plan templates
        console.log('Taking screenshot: Learning plan templates...');
        await page.goto(MOODLE_URL + `/admin/tool/lp/learningplans.php`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '09-learning-plans.png'),
            fullPage: false
        });

        // 10. Analytics dashboard
        console.log('Taking screenshot: Analytics dashboard...');
        await page.goto(MOODLE_URL + `/report/analytics/index.php`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '10-analytics-dashboard.png'),
            fullPage: false
        });

        console.log('✅ Chapter 9 Learning Progress Tracking screenshots completed successfully!');

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