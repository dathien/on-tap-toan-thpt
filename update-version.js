const fs = require('fs');
let content = fs.readFileSync('src/store/useAppStore.ts', 'utf8');
content = content.replace('version: 1,', 'version: 2,');
content = content.replace('if (version === 0) {', 'if (version === 0 || version === 1) {');
fs.writeFileSync('src/store/useAppStore.ts', content);
