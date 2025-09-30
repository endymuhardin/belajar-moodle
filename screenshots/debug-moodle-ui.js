const { chromium } = require('playwright');

// Configuration
const MOODLE_URL = 'http://localhost:80';
const ADMIN_USERNAME = 'user';
const ADMIN_PASSWORD = 'bitnami';

async function checkAvailableActivities() {
    const browser = await chromium.launch({
        headless: false,
        args: ['--no-sandbox']
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();

    try {
        console.log('Checking available activities in Moodle...');

        // Login as admin
        await page.goto(MOODLE_URL + '/login/index.php', { waitUntil: 'networkidle' });
        await page.fill('#username', ADMIN_USERNAME);
        await page.fill('#password', ADMIN_PASSWORD);
        await page.click('#loginbtn');
        await page.waitForLoadState('networkidle');

        // Create a test course
        await page.goto(MOODLE_URL + '/course/edit.php?category=1', { waitUntil: 'networkidle' });
        await page.fill('#id_fullname', 'Test Course for Activities');
        await page.fill('#id_shortname', 'TEST101');
        await page.click('#id_saveanddisplay');
        await page.waitForLoadState('networkidle');

        const url = page.url();
        const courseId = new URL(url).searchParams.get('id');
        console.log(`Test course created with ID: ${courseId}`);

        // Navigate to course and try to turn editing on
        await page.goto(MOODLE_URL + `/course/view.php?id=${courseId}`, { waitUntil: 'networkidle' });

        // Take a screenshot of the course page to understand the UI
        await page.screenshot({
            path: '/home/endy/workspace/moodle/course-page-debug.png',
            fullPage: true
        });

        // Check for edit mode in newer Moodle versions
        const editModeButtons = await page.$$eval('button[title*="edit"], button[aria-label*="edit"], .btn-icon', buttons =>
            buttons.map(btn => ({
                text: btn.textContent?.trim(),
                title: btn.getAttribute('title'),
                ariaLabel: btn.getAttribute('aria-label'),
                class: btn.getAttribute('class')
            }))
        );
        console.log('Potential edit buttons:', editModeButtons);

        // Look for add activity buttons in newer UI
        const addActivityButtons = await page.$$eval('button[title*="add"], button[aria-label*="add"], .dropdown-toggle', buttons =>
            buttons.map(btn => ({
                text: btn.textContent?.trim(),
                title: btn.getAttribute('title'),
                ariaLabel: btn.getAttribute('aria-label'),
                class: btn.getAttribute('class')
            }))
        );
        console.log('Potential add activity buttons:', addActivityButtons);

        // Check page HTML structure for navigation elements
        const pageContent = await page.content();
        const hasEditMode = pageContent.includes('edit') || pageContent.includes('Edit');
        const hasAddActivity = pageContent.includes('activity') || pageContent.includes('Activity');

        console.log('Page contains "edit":', hasEditMode);
        console.log('Page contains "activity":', hasAddActivity);

        // Save HTML for analysis
        require('fs').writeFileSync('/home/endy/workspace/moodle/course-page-debug.html', pageContent);
        console.log('Page HTML saved to course-page-debug.html');

        // Delete the test course
        await page.goto(MOODLE_URL + `/course/delete.php?id=${courseId}`, { waitUntil: 'networkidle' });
        await page.click('button:has-text("Delete")');
        await page.waitForLoadState('networkidle');
        console.log('Test course deleted.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

checkAvailableActivities().catch(console.error);