const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// replace duplicate imports
const match = "import { TeacherResults } from './pages/TeacherResults';\nimport { TeacherResults } from './pages/TeacherResults';";
content = content.replace(match, "import { TeacherResults } from './pages/TeacherResults';");
fs.writeFileSync('src/App.tsx', content);

// fix TeacherResults.tsx
let resultsContent = fs.readFileSync('src/pages/TeacherResults.tsx', 'utf8');
resultsContent = resultsContent.replace(/title:/g, 'name:');
resultsContent = resultsContent.replace(/\.title/g, '.name');
fs.writeFileSync('src/pages/TeacherResults.tsx', resultsContent);

