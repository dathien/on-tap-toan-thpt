const fs = require('fs');
let content = fs.readFileSync('src/pages/StudentResult.tsx', 'utf-8');

content = content.replace("const s = stats.levelStats[level as 1|2|3|4];\n                  if (s.total === 0) return null;", "const s = stats.levelStats[level as 1|2|3|4];\n                  if (!s || s.total === 0) return null;");
content = content.replace("const s = stats.typeStats[type as keyof typeof stats.typeStats];\n                  if (s.total === 0) return null;", "const s = stats.typeStats[type as keyof typeof stats.typeStats];\n                  if (!s || s.total === 0) return null;");

fs.writeFileSync('src/pages/StudentResult.tsx', content);
