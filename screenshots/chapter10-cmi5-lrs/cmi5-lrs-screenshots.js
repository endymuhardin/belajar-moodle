const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration - VPS deployment
const MOODLE_URL = 'https://moodle.artivisi.id';
const LRS_URL = 'https://lrs.artivisi.id';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.MOODLE_ADMIN_PASSWORD;
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/img/cmi5');

if (!ADMIN_PASSWORD) {
    console.error('ERROR: Set MOODLE_ADMIN_PASSWORD environment variable');
    process.exit(1);
}

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function takeScreenshots() {
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--ignore-certificate-errors']
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        ignoreHTTPSErrors: true
    });

    const page = await context.newPage();

    try {
        console.log('Starting CMI5/LRS Screenshots...');

        // ============================================
        // PART 1: Moodle CMI5 Plugin Configuration
        // ============================================

        // Login to Moodle as admin
        console.log('1. Logging in to Moodle as admin...');
        await page.goto(MOODLE_URL + '/login/index.php', { waitUntil: 'networkidle' });
        await page.fill('#username', ADMIN_USERNAME);
        await page.fill('#password', ADMIN_PASSWORD);
        await page.click('#loginbtn');
        await page.waitForLoadState('networkidle');
        console.log('   Logged in successfully');

        // Screenshot: Site Administration
        console.log('2. Taking screenshot: Site Administration...');
        await page.goto(MOODLE_URL + '/admin/search.php', { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '01-site-admin.png'),
            fullPage: false
        });

        // Screenshot: Plugins overview
        console.log('3. Taking screenshot: Plugins overview...');
        await page.goto(MOODLE_URL + '/admin/plugins.php', { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '02-plugins-overview.png'),
            fullPage: false
        });

        // Screenshot: CMI5 Plugin in activity modules list
        console.log('4. Taking screenshot: CMI5 in activity modules...');
        await page.goto(MOODLE_URL + '/admin/modules.php', { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '03-activity-modules.png'),
            fullPage: false
        });

        // Screenshot: CMI5 Plugin settings
        console.log('5. Taking screenshot: CMI5 plugin settings...');
        await page.goto(MOODLE_URL + '/admin/settings.php?section=modsettingcmi5launch', { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '04-cmi5-settings.png'),
            fullPage: false
        });

        // Screenshot: Logstore plugins
        console.log('6. Taking screenshot: Logstore plugins...');
        await page.goto(MOODLE_URL + '/admin/category.php?category=logging', { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '05-logstore-plugins.png'),
            fullPage: false
        });

        // Screenshot: xAPI Logstore settings
        console.log('7. Taking screenshot: xAPI Logstore settings...');
        await page.goto(MOODLE_URL + '/admin/settings.php?section=logsettingxapi', { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '06-xapi-logstore-settings.png'),
            fullPage: false
        });

        // Screenshot: Log stores manager
        console.log('8. Taking screenshot: Log stores manager...');
        await page.goto(MOODLE_URL + '/admin/settings.php?section=managelogging', { waitUntil: 'networkidle' });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '07-logstores-manager.png'),
            fullPage: false
        });

        // ============================================
        // PART 2: Adding CMI5 Activity to Course
        // ============================================

        // Navigate to a course or create one
        console.log('9. Creating demo course for CMI5...');
        await page.goto(MOODLE_URL + '/course/edit.php?category=1', { waitUntil: 'networkidle' });
        await page.fill('#id_fullname', 'CMI5 Demo Course');
        await page.fill('#id_shortname', 'CMI5DEMO');
        await page.click('#id_saveanddisplay');
        await page.waitForLoadState('networkidle');
        const url = page.url();
        const courseId = new URL(url).searchParams.get('id');
        console.log(`   Course created with ID: ${courseId}`);

        // Turn editing on
        console.log('10. Turning editing on...');
        try {
            await page.click('.form-check-input[name="setmode"]', { timeout: 5000 });
            await page.waitForTimeout(2000);
        } catch (e) {
            console.log('    Edit mode toggle not found, trying alternative...');
            await page.goto(MOODLE_URL + `/course/view.php?id=${courseId}&sesskey=&edit=on`, { waitUntil: 'networkidle' });
        }

        // Screenshot: Course with edit mode
        console.log('11. Taking screenshot: Course edit mode...');
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '08-course-edit-mode.png'),
            fullPage: false
        });

        // Add activity dialog
        console.log('12. Taking screenshot: Add activity dialog...');
        try {
            // Click on "Add an activity or resource" button
            await page.click('button.activity-add', { timeout: 5000 });
            await page.waitForTimeout(1000);
            await page.screenshot({
                path: path.join(SCREENSHOTS_DIR, '09-add-activity-dialog.png'),
                fullPage: false
            });

            // Look for CMI5 in the activity chooser
            console.log('13. Looking for CMI5 in activity chooser...');
            await page.screenshot({
                path: path.join(SCREENSHOTS_DIR, '10-cmi5-activity-chooser.png'),
                fullPage: false
            });
        } catch (e) {
            console.log('    Activity dialog not found, skipping...');
        }

        // ============================================
        // PART 3: Trax LRS Interface
        // ============================================

        console.log('14. Opening Trax LRS...');
        await page.goto(LRS_URL, { waitUntil: 'networkidle', timeout: 30000 });
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '11-trax-lrs-homepage.png'),
            fullPage: false
        });

        // Try to access LRS login/register page
        console.log('15. Taking screenshot: Trax LRS login...');
        try {
            await page.goto(LRS_URL + '/login', { waitUntil: 'networkidle', timeout: 10000 });
            await page.screenshot({
                path: path.join(SCREENSHOTS_DIR, '12-trax-lrs-login.png'),
                fullPage: false
            });
        } catch (e) {
            console.log('    LRS login page not accessible');
        }

        // Try register page
        console.log('16. Taking screenshot: Trax LRS register...');
        try {
            await page.goto(LRS_URL + '/register', { waitUntil: 'networkidle', timeout: 10000 });
            await page.screenshot({
                path: path.join(SCREENSHOTS_DIR, '13-trax-lrs-register.png'),
                fullPage: false
            });
        } catch (e) {
            console.log('    LRS register page not accessible');
        }

        console.log('✅ CMI5/LRS screenshots completed successfully!');

        // Cleanup: Delete demo course
        if (courseId) {
            console.log(`Deleting demo course with ID: ${courseId}...`);
            await page.goto(MOODLE_URL + `/course/delete.php?id=${courseId}`, { waitUntil: 'networkidle' });
            try {
                await page.click('button:has-text("Delete")');
                await page.waitForLoadState('networkidle');
                console.log('   Course deleted.');
            } catch (e) {
                console.log('   Could not delete course automatically');
            }
        }

    } catch (error) {
        console.error('Error taking screenshots:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the screenshot function
takeScreenshots().catch(console.error);
