const fs = require('fs');

const content = fs.readFileSync('src/pages/TreasureHunt.tsx', 'utf-8');
console.log(content.indexOf('CONFIG'));
