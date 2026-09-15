const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf8');
// Fix the duplicates where tags: [], appears right before tags: [...]
content = content.replace(/tags: \[\],\n  tags:/g, 'tags:');
content = content.replace(/tags: \[\],\s*tags:/g, 'tags:');
fs.writeFileSync('src/data/demoQuestions.ts', content);
