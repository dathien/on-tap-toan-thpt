const fs = require('fs');
let code = fs.readFileSync('src/pages/Bank.tsx', 'utf8');

code = code.replace(
  "import { Question } from '../types';",
  "import { Question } from '../types';\nimport { v4 as uuidv4 } from 'uuid';"
);
code = code.replace("require('uuid').v4()", "uuidv4()");

fs.writeFileSync('src/pages/Bank.tsx', code);
