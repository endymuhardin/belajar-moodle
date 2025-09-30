const { exec } = require('child_process');
const path = require('path');

// List of screenshot scripts to run
const scripts = [
  './chapter3-installation/installation-screenshots.js',
  './chapter4-administration/admin-screenshots.js',
  './chapter5-user-management/user-screenshots.js',
  './chapter6-course-management/course-screenshots.js',
  './chapter7-courseware/courseware-screenshots.js',
  './chapter8-scorm/scorm-screenshots.js',
  './chapter9-progress-tracking/progress-tracking-screenshots.js',
  './chapter10-weakness-analysis/weakness-analysis-screenshots.js',
  './chapter11-advanced-courseware/advanced-courseware-screenshots.js'
];

console.log('🚀 Starting screenshot generation for all chapters...\n');

// Function to run a script
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`📸 Running: ${scriptPath}`);
    exec(`node ${scriptPath}`, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error in ${scriptPath}:`, error);
        reject(error);
      } else {
        console.log(stdout);
        if (stderr) console.error(stderr);
        console.log(`✅ Completed: ${scriptPath}\n`);
        resolve();
      }
    });
  });
}

// Run all scripts sequentially
async function runAllScripts() {
  for (const script of scripts) {
    try {
      await runScript(script);
    } catch (error) {
      console.error(`Failed to run ${script}. Continuing with next script...`);
    }
  }

  console.log('🎉 All screenshot scripts completed!');
  console.log('\n📁 Screenshots have been saved to:');
  console.log('   - docs/img/instalasi/');
  console.log('   - docs/img/administrasi/');
  console.log('   - docs/img/pengguna/');
  console.log('   - docs/img/course/');
  console.log('   - docs/img/courseware/');
  console.log('   - docs/img/scorm/');
  console.log('   - docs/img/progress-tracking/');
  console.log('   - docs/img/weakness-analysis/');
  console.log('   - docs/img/advanced-courseware/');
}

// Execute
runAllScripts().catch(console.error);