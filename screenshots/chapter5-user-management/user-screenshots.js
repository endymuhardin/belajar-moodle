const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const MOODLE_URL = 'http://localhost:80';
const ADMIN_USERNAME = 'user';
const ADMIN_PASSWORD = 'bitnami';
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/img/pengguna');

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
    console.log('Starting Chapter 5 - User Management Screenshots...');

    // Login as admin
    console.log('Logging in as admin...');
    await page.goto(MOODLE_URL + '/login/index.php', { waitUntil: 'networkidle' });
    await page.fill('#username', ADMIN_USERNAME);
    await page.fill('#password', ADMIN_PASSWORD);
    await page.click('#loginbtn');
    await page.waitForLoadState('networkidle');

    // 1. Browse Users List
    console.log('Taking screenshot: Browse users list...');
    await page.goto(MOODLE_URL + '/admin/user.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-browse-users.png'),
      fullPage: false
    });

    // 2. Add New User Form
    console.log('Taking screenshot: Add new user form...');
    await page.goto(MOODLE_URL + '/user/editadvanced.php?id=-1', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-add-new-user.png'),
      fullPage: false
    });

    // 3. Bulk User Upload
    console.log('Taking screenshot: Bulk user upload...');
    await page.goto(MOODLE_URL + '/admin/tool/uploaduser/index.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '03-bulk-upload.png'),
      fullPage: false
    });

    // 4. Define Roles
    console.log('Taking screenshot: Define roles...');
    await page.goto(MOODLE_URL + '/admin/roles/manage.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '04-define-roles.png'),
      fullPage: false
    });

    // 5. Assign System Roles
    console.log('Taking screenshot: Assign system roles...');
    await page.goto(MOODLE_URL + '/admin/roles/assign.php?contextid=1', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-assign-system-roles.png'),
      fullPage: false
    });

    // 6. User Permissions
    console.log('Taking screenshot: User permissions...');
    await page.goto(MOODLE_URL + '/admin/category.php?category=users', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-user-permissions.png'),
      fullPage: false
    });

    // 7. Check System Permissions
    console.log('Taking screenshot: Check permissions...');
    await page.goto(MOODLE_URL + '/admin/category.php?category=roles', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '07-check-permissions.png'),
      fullPage: false
    });

    // 8. User Policies
    console.log('Taking screenshot: User policies...');
    await page.goto(MOODLE_URL + '/admin/settings.php?section=userpolicies', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '08-user-policies.png'),
      fullPage: false
    });

    // 9. Cohorts Management
    console.log('Taking screenshot: Cohorts...');
    await page.goto(MOODLE_URL + '/cohort/index.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '09-cohorts.png'),
      fullPage: false
    });

    // 10. User Profile Fields
    console.log('Taking screenshot: Profile fields...');
    await page.goto(MOODLE_URL + '/user/profile/index.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '10-profile-fields.png'),
      fullPage: false
    });

    // 11. Bulk User Actions
    console.log('Taking screenshot: Bulk user actions...');
    await page.goto(MOODLE_URL + '/admin/user/user_bulk.php', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '11-bulk-actions.png'),
      fullPage: false
    });

    // 12. User Authentication Settings
    console.log('Taking screenshot: Authentication settings...');
    await page.goto(MOODLE_URL + '/admin/settings.php?section=manageauths', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '12-authentication.png'),
      fullPage: false
    });

    // 13. Role Capabilities Matrix (simulated)
    console.log('Creating role comparison table...');
    await page.setContent(`
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              background: #f8f9fa;
            }
            h2 {
              color: #333;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th {
              background: #0f6cbf;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
            }
            td {
              padding: 10px 12px;
              border-bottom: 1px solid #e0e0e0;
            }
            tr:hover {
              background: #f5f5f5;
            }
            .yes {
              color: #28a745;
              font-weight: bold;
            }
            .no {
              color: #dc3545;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h2>Moodle Role Capabilities Matrix</h2>
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                <th>Administrator</th>
                <th>Manager</th>
                <th>Teacher</th>
                <th>Student</th>
                <th>Guest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>System Configuration</td>
                <td class="yes">✓</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
              </tr>
              <tr>
                <td>Create Courses</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
              </tr>
              <tr>
                <td>Manage Users</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
              </tr>
              <tr>
                <td>Edit Course Content</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
              </tr>
              <tr>
                <td>Grade Students</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
              </tr>
              <tr>
                <td>Submit Assignments</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="no">✗</td>
              </tr>
              <tr>
                <td>View Course Content</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
              </tr>
              <tr>
                <td>Install Plugins</td>
                <td class="yes">✓</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '13-role-matrix.png'),
      fullPage: false
    });

    // 14. CSV Upload Template (simulated)
    console.log('Creating CSV upload template...');
    await page.setContent(`
      <html>
        <head>
          <style>
            body {
              font-family: 'Consolas', 'Monaco', monospace;
              padding: 20px;
              background: #2b2b2b;
              color: #d4d4d4;
            }
            h3 {
              color: #569cd6;
              margin-bottom: 15px;
            }
            .csv-container {
              background: #1e1e1e;
              padding: 20px;
              border-radius: 5px;
              border: 1px solid #3c3c3c;
            }
            .csv-header {
              color: #4ec9b0;
              font-weight: bold;
            }
            .csv-row {
              color: #ce9178;
              margin: 5px 0;
            }
            .comment {
              color: #6a9955;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <h3>CSV Template for Bulk User Upload</h3>
          <div class="csv-container">
            <div class="comment"># CSV file format for bulk user upload</div>
            <div class="comment"># Required fields: username, firstname, lastname, email</div>
            <div class="comment"># Optional: password, auth, idnumber, city, country, etc.</div>
            <br>
            <div class="csv-header">username,password,firstname,lastname,email,city,country,auth</div>
            <div class="csv-row">john.doe,Pass@word123,John,Doe,john@example.com,Jakarta,ID,manual</div>
            <div class="csv-row">jane.smith,Secure#456,Jane,Smith,jane@example.com,Bandung,ID,manual</div>
            <div class="csv-row">bob.wilson,Admin!789,Bob,Wilson,bob@example.com,Surabaya,ID,manual</div>
            <div class="csv-row">alice.brown,Test$321,Alice,Brown,alice@example.com,Medan,ID,manual</div>
            <div class="csv-row">charlie.davis,Demo@654,Charlie,Davis,charlie@example.com,Semarang,ID,manual</div>
          </div>
        </body>
      </html>
    `);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '14-csv-template.png'),
      fullPage: false
    });

    // 15. User Edit Form (simulate filled form)
    console.log('Taking screenshot: User edit form...');
    await page.goto(MOODLE_URL + '/user/editadvanced.php?id=-1', { waitUntil: 'networkidle' });

    // Try to fill some fields if they exist
    try {
      await page.fill('#id_username', 'johndoe');
      await page.fill('#id_firstname', 'John');
      await page.fill('#id_lastname', 'Doe');
      await page.fill('#id_email', 'john.doe@example.com');
    } catch (e) {
      console.log('Could not fill user form fields');
    }

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '15-user-edit-form.png'),
      fullPage: false
    });

    console.log('✅ Chapter 5 User Management screenshots completed successfully!');

  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot function
takeScreenshots().catch(console.error);