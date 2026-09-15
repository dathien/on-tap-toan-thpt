const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf8');
content = content.replace('  }))\n// GRADE 10 - Hàm số bậc hai', '  })),\n// GRADE 10 - Hàm số bậc hai');
fs.writeFileSync('src/data/demoQuestions.ts', content);
