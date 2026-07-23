const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src/app/layout.js');
let layout = fs.readFileSync(layoutPath, 'utf-8');
// Add suppressHydrationWarning to head
layout = layout.replace('<head dangerouslySetInnerHTML', '<head suppressHydrationWarning dangerouslySetInnerHTML');
// Remove contact-form-7 scripts which cause Unhandled Promise Rejection (Not Found)
layout = layout.replace(/<script[^>]*contact-form-7[^>]*><\/script>/gi, '');
layout = layout.replace(/<script[^>]*wp-emoji-release[^>]*><\/script>/gi, '');
fs.writeFileSync(layoutPath, layout);

const pagePath = path.join(__dirname, 'src/app/page.js');
let page = fs.readFileSync(pagePath, 'utf-8');
// Remove contact-form-7 scripts from page as well
page = page.replace(/<script[^>]*contact-form-7[^>]*><\/script>/gi, '');
page = page.replace(/<script[^>]*wp-emoji-release[^>]*><\/script>/gi, '');
fs.writeFileSync(pagePath, page);

console.log('Fixed Next.js overlay errors');
