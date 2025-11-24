const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration - VPS deployment
const LRS_URL = 'https://lrs.artivisi.id';
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/img/cmi5');

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
        console.log('Starting Trax LRS Screenshots...');

        // Trax LRS login page (redirected from root)
        console.log('1. Opening Trax LRS login page...');
        await page.goto(LRS_URL + '/trax/starter/auth/login', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000); // Wait for Vue/Inertia to render
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '11-trax-lrs-login.png'),
            fullPage: false
        });
        console.log('   Screenshot: Login page');

        // Since we're not logged in, statements/access/settings will redirect to login
        // Take screenshot of the login form as the main LRS interface
        console.log('2. Taking screenshot: Trax LRS homepage...');
        await page.goto(LRS_URL, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '12-trax-lrs-homepage.png'),
            fullPage: false
        });
        console.log('   Screenshot: Homepage (redirects to login)');

        // Take screenshot of xAPI endpoint
        console.log('3. Taking screenshot: xAPI endpoint...');
        await page.goto(LRS_URL + '/trax/api/gateway/xapi/statements', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '13-trax-lrs-xapi-endpoint.png'),
            fullPage: false
        });
        console.log('   Screenshot: xAPI statements endpoint');

        console.log('✅ Trax LRS screenshots completed successfully!');

    } catch (error) {
        console.error('Error taking screenshots:', error);
        // Take a debug screenshot
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'debug-lrs-error.png'),
            fullPage: true
        });
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the screenshot function
takeScreenshots().catch(console.error);
