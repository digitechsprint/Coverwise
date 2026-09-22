const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['our-portfolio'].html;
const webpMatches = [...new Set(html.match(/[^"'\s<>]+\.webp/gi))];
console.log("WebP images found in our-portfolio HTML:", webpMatches);

webpMatches.forEach(match => {
    // Extract filename from URL
    const filenameParts = match.split('/');
    const filename = filenameParts[filenameParts.length - 1];
    
    // Find all files in uploads matching this filename
    try {
        const out = require('child_process').execSync(`dir /s /b c:\\Users\\akkik\\Coverwise\\public\\wp-content\\uploads\\*${filename}`).toString();
        const files = out.split('\n').filter(Boolean);
        files.forEach(f => {
            const path = f.trim();
            if(fs.existsSync(path)) {
                const stat = fs.statSync(path);
                console.log(`${path} - Size: ${stat.size} bytes`);
                if (stat.size < 100) {
                    console.log(`CORRUPTED IMAGE FOUND: ${path}`);
                }
            }
        });
    } catch(e) {}
});
