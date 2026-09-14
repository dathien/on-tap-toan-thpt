const fs = require('fs');
let content = fs.readFileSync('src/pages/ExamPreview.tsx', 'utf-8');

// Use regex to completely remove the old declaration
content = content.replace(/const studentLink = `\${window\.location\.origin}\/student\/exam\/\${versionId}`;/g, '');

fs.writeFileSync('src/pages/ExamPreview.tsx', content);
console.log("Fixed studentLink");
