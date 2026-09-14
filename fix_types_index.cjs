const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

code = code.replace(
  "antiCheatEvents?: { type: 'MULTIPLE_TAB'; questionId?: string; timestamp: number; tabId: string }[];",
  "antiCheatEvents?: { type: 'MULTIPLE_TAB'; questionId?: string; questionIndex?: number; timestamp: number; tabId: string }[];"
);

fs.writeFileSync('src/types/index.ts', code);
