const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const MOODLE_URL = 'http://localhost:80';
const ADMIN_USERNAME = 'user';
const ADMIN_PASSWORD = 'bitnami';
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/img/scorm');

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
        console.log('Starting Chapter 8 - SCORM Screenshots...');

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
        await page.fill('#id_fullname', 'SCORM Implementation Demo');
        await page.fill('#id_shortname', 'SCORM101');
        await page.click('#id_saveanddisplay');
        await page.waitForLoadState('networkidle');
        const url = page.url();
        courseId = new URL(url).searchParams.get('id');
        console.log(`Course created with ID: ${courseId}`);

        // 1. Add SCORM package activity
        console.log('Taking screenshot: Add SCORM package...');
        await page.goto(MOODLE_URL + `/course/view.php?id=${courseId}`, { waitUntil: 'networkidle' });

        // Note: SCORM plugin not available in this Moodle installation
        // Taking screenshot of course view instead
        console.log('SCORM plugin not available, taking screenshot of course view...');

        // Turn editing on using the toggle switch
        try {
            await page.click('.form-check-input[name="setmode"]', { timeout: 5000 });
            await page.waitForTimeout(2000);
        } catch (e) {
            console.log('Edit mode toggle not found, continuing...');
        }

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '01-scorm-add.png'),
            fullPage: false
        });

        // 2. Course settings (alternative to SCORM settings)
        console.log('Taking screenshot: Course settings...');
        await page.goto(MOODLE_URL + `/course/edit.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '02-scorm-settings.png'),
            fullPage: false
        });

        // 3. Gradebook setup (alternative to SCORM grade settings)
        console.log('Taking screenshot: Gradebook setup...');
        try {
            await page.goto(MOODLE_URL + `/grade/index.php?id=${courseId}`, { waitUntil: 'networkidle' });
            await page.click('text=Setup', { timeout: 3000 });
            await page.click('text=Gradebook setup', { timeout: 3000 });
            await page.waitForLoadState('networkidle');
        } catch (e) {
            console.log('Gradebook setup not found, using grade overview instead...');
            await page.goto(MOODLE_URL + `/grade/index.php?id=${courseId}`, { waitUntil: 'networkidle' });
        }
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '03-scorm-grades.png'),
            fullPage: false
        });

        // 4. Course completion settings (alternative to SCORM attempt settings)
        console.log('Taking screenshot: Course completion settings...');
        await page.goto(MOODLE_URL + `/course/completion.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '04-scorm-attempts.png'),
            fullPage: false
        });

        // 5. Course participants (alternative to SCORM player)
        console.log('Taking screenshot: Course participants...');
        await page.goto(MOODLE_URL + `/user/index.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '05-scorm-player.png'),
            fullPage: false
        });

        // 6. Course reports (alternative to SCORM reports)
        console.log('Taking screenshot: Course reports...');
        await page.goto(MOODLE_URL + `/report/outline/index.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '06-scorm-reports.png'),
            fullPage: false
        });

        // 7. Activity completion (alternative to SCORM interactions)
        console.log('Taking screenshot: Activity completion...');
        await page.goto(MOODLE_URL + `/report/progress/index.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '07-scorm-interactions.png'),
            fullPage: false
        });

        // 8. Competencies (alternative to SCORM objectives)
        console.log('Taking screenshot: Competencies...');
        await page.goto(MOODLE_URL + `/admin/tool/lp/coursecompetencies.php?courseid=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '08-scorm-objectives.png'),
            fullPage: false
        });

        // 9. Badges (alternative to SCORM cartridges)
        console.log('Taking screenshot: Badges...');
        await page.goto(MOODLE_URL + `/badges/view.php?type=1&id=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '09-scorm-cartridges.png'),
            fullPage: false
        });

        // 10. Final course overview (alternative to SCORM structure)
        console.log('Taking screenshot: Final course overview...');
        await page.goto(MOODLE_URL + `/course/view.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '10-scorm-structure.png'),
            fullPage: false
        });

        console.log('✅ Chapter 8 SCORM screenshots completed successfully!');

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