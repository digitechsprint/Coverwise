const fs = require('fs');
const buf = fs.readFileSync(String.raw`C:\Users\user14\Downloads\gaurav snap BNI.pdf`);
const soi = Buffer.from([0xFF, 0xD8, 0xFF]);
const eoi = Buffer.from([0xFF, 0xD9]);

let idx = -1;
const positions = [];
while ((idx = buf.indexOf(soi, idx + 1)) !== -1) positions.push(idx);

console.log('Found', positions.length, 'JPEG segments');

for (let i = 0; i < positions.length; i++) {
  const start = positions[i];
  const end = buf.indexOf(eoi, start);
  if (end === -1) { console.log('no EOI for segment', i); continue; }
  const data = buf.slice(start, end + 2);
  fs.writeFileSync(`scratch_strip_${i}.jpg`, data);
  console.log('strip', i, ':', data.length, 'bytes, range', start, '-', end + 2);
}
