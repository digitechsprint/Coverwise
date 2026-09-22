const fs = require('fs');
const content = fs.readFileSync('c:/Users/akkik/Coverwise/src/app/(frontend)/layout.js', 'utf8');

const target = '<script type=\\"text/javascript\\" src=\\"/wp-includes/js/jquery/jquery-migrate.min5589.js?ver=3.4.1\\" id=\\"jquery-migrate-js\\"></script>';
const replacement = target + '\\n<script type=\\"text/javascript\\" src=\\"/wp-includes/js/imagesloaded.minbb93.js?ver=5.0.0\\" id=\\"imagesloaded-js\\"></script>';

const newContent = content.replace(target, replacement);

fs.writeFileSync('c:/Users/akkik/Coverwise/src/app/(frontend)/layout.js', newContent);
console.log("Replaced:", content !== newContent);
