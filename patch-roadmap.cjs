const fs = require('fs');
let content = fs.readFileSync('src/pages/Roadmap.tsx', 'utf-8');

if (!content.includes('sanitizeQuestionText')) {
  content = content.replace("import { MathText } from '../components/MathText';", "import { MathText } from '../components/MathText';\nimport { sanitizeQuestionText } from '../utils/textSanitizer';");
  content = content.replace(/<MathText text=\{q\.content\} \/>/g, "<MathText text={sanitizeQuestionText(q.content)} />");
  fs.writeFileSync('src/pages/Roadmap.tsx', content);
  console.log("Patched Roadmap.tsx");
}
