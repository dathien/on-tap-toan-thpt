const fs = require('fs');
let content = fs.readFileSync('src/components/visuals/VariationTable.tsx', 'utf-8');

content = content.replace(/text=\{"\\\$" \+ ([a-zA-Z0-9_]+) \+ "\\\$"\}/g, 'value={$1}');
fs.writeFileSync('src/components/visuals/VariationTable.tsx', content);
