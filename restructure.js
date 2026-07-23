const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app');
const frontendDir = path.join(srcApp, '(frontend)');
const adminDir = path.join(srcApp, 'admin');

if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });
if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });

const items = fs.readdirSync(srcApp);
const excludes = ['(frontend)', 'admin', 'globals.css', 'favicon.ico', 'wp-json'];

items.forEach(item => {
  if (excludes.includes(item)) return;
  const oldPath = path.join(srcApp, item);
  const newPath = path.join(frontendDir, item);
  fs.renameSync(oldPath, newPath);
  console.log(`Moved ${item} to (frontend)`);
});
