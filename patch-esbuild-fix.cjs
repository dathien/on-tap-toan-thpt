const fs = require('fs');
let content = fs.readFileSync('src/components/visuals/VariationTable.tsx', 'utf-8');

content = content.replace(/id=\{\`arrow-up-\$\{i\}\`\}/g, 'id={"arrow-up-" + i}');
content = content.replace(/markerEnd=\{\`url\(#arrow-up-\$\{i\}\)\`\}/g, 'markerEnd={"url(#arrow-up-" + i + ")"}');
content = content.replace(/id=\{\`arrow-down-\$\{i\}\`\}/g, 'id={"arrow-down-" + i}');
content = content.replace(/markerEnd=\{\`url\(#arrow-down-\$\{i\}\)\`\}/g, 'markerEnd={"url(#arrow-down-" + i + ")"}');

fs.writeFileSync('src/components/visuals/VariationTable.tsx', content);
console.log("Patched esbuild issue");
