const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src/app/layout.js');
let layout = fs.readFileSync(layoutPath, 'utf-8');
layout = layout.replace('<html lang="en">', '<html lang="en" suppressHydrationWarning>');
layout = layout.replace('<body className', '<body suppressHydrationWarning className');
layout = layout.replace(/<script type="?\\"speculationrules"?[^>]*>[\s\S]*?<\/script>/gi, '');
layout = layout.replace(/<script[^>]*burst\.min[^>]*><\/script>/gi, '');
fs.writeFileSync(layoutPath, layout);

const pagePath = path.join(__dirname, 'src/app/page.js');
let page = fs.readFileSync(pagePath, 'utf-8');
page = page.replace('<div dangerouslySetInnerHTML', '<div suppressHydrationWarning dangerouslySetInnerHTML');
page = page.replace(/<script type="?\\"speculationrules"?[^>]*>[\s\S]*?<\/script>/gi, '');
page = page.replace(/<script[^>]*burst\.min[^>]*><\/script>/gi, '');
fs.writeFileSync(pagePath, page);
console.log('Fixed hydration and removed broken scripts');
