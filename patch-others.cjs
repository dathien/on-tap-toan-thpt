const fs = require('fs');

// WordImport.tsx
let wordContent = fs.readFileSync('src/pages/WordImport.tsx', 'utf-8');
if (!wordContent.includes('sanitizeQuestionText')) {
  wordContent = wordContent.replace("import { MathText } from '../components/MathText';", "import { MathText } from '../components/MathText';\nimport { sanitizeQuestionText } from '../utils/textSanitizer';");
  wordContent = wordContent.replace(/<MathText text=\{q\.content\} \/>/g, "<MathText text={sanitizeQuestionText(q.content)} />");
  fs.writeFileSync('src/pages/WordImport.tsx', wordContent);
  console.log("Patched WordImport.tsx");
}

// QuestionEditor.tsx
let editorContent = fs.readFileSync('src/pages/QuestionEditor.tsx', 'utf-8');
if (!editorContent.includes('sanitizeQuestionText')) {
  editorContent = editorContent.replace("import { MathText } from '../components/MathText';", "import { MathText } from '../components/MathText';\nimport { sanitizeQuestionText } from '../utils/textSanitizer';");
  editorContent = editorContent.replace("<MathText text={content || 'Chưa có nội dung'} />", "<MathText text={sanitizeQuestionText(content) || 'Chưa có nội dung'} />");
  fs.writeFileSync('src/pages/QuestionEditor.tsx', editorContent);
  console.log("Patched QuestionEditor.tsx");
}
