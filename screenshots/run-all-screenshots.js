const { exec } = require('child_process');
const path = require('path');

// List of screenshot scripts to run
const scripts = [
  './chapter3-installation/installation-screenshots.js',
  './chapter4-administration/admin-screenshots.js',
  './chapter5-user-management/user-screenshots.js',
  './chapter6-course-management/course-screenshots.js'
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
}

// Execute
runAllScripts().catch(console.error);