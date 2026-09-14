const fs = require('fs');

let content = fs.readFileSync('src/index.css', 'utf-8');
content = content.replace(
  /\.variation-table td,\s*\n\.variation-table th \{/g,
  '.variation-table .grid > div, .variation-table .flex > div {'
);
fs.writeFileSync('src/index.css', content);
