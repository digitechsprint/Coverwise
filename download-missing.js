const fs = require('fs');
const path = require('path');
const https = require('https');

const filesToDownload = [
  { url: 'https://coverwiseimf.com/wp-content/plugins/elementor/assets/lib/dialog/dialog.min.css', dest: 'public/wp-content/plugins/elementor/assets/lib/dialog/dialog.min.css' },
  { url: 'https://coverwiseimf.com/wp-content/plugins/elementor/assets/lib/dialog/dialog.min.js', dest: 'public/wp-content/plugins/elementor/assets/lib/dialog/dialog.min.js' },
  { url: 'https://coverwiseimf.com/wp-content/plugins/elementor/assets/lib/share-link/share-link.min.js', dest: 'public/wp-content/plugins/elementor/assets/lib/share-link/share-link.min.js' },
  { url: 'https://coverwiseimf.com/wp-content/plugins/elementor/assets/lib/e-lightbox/css/lightbox.min.css', dest: 'public/wp-content/plugins/elementor/assets/lib/e-lightbox/css/lightbox.min.css' },
  { url: 'https://coverwiseimf.com/wp-content/plugins/elementor/assets/lib/e-lightbox/js/lightbox.min.js', dest: 'public/wp-content/plugins/elementor/assets/lib/e-lightbox/js/lightbox.min.js' },
  { url: 'https://coverwiseimf.com/wp-content/plugins/elementor/assets/lib/swiper/swiper.min.js', dest: 'public/wp-content/plugins/elementor/assets/lib/swiper/swiper.min.js' }
];

filesToDownload.forEach(file => {
  const destPath = path.join(__dirname, file.dest);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  
  https.get(file.url, (res) => {
    if (res.statusCode === 200) {
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      console.log(`Downloaded ${file.url}`);
    } else {
      console.log(`Failed to download ${file.url} - Status ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${file.url}: ${err.message}`);
  });
});
