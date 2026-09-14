const fs = require('fs');
let content = fs.readFileSync('src/components/MathText.tsx', 'utf-8');

if (!content.includes('normalizeMathToken')) {
  content = content.replace(
    "import renderMathInElement from 'katex/contrib/auto-render';",
    "import renderMathInElement from 'katex/contrib/auto-render';\nimport { normalizeMathToken } from '../utils/mathNormalizer';\nimport { sanitizeStudentContent } from '../utils/studentSanitizer';"
  );
  
  content = content.replace(
    "export function MathText({ text, className = '' }: { text: string; className?: string }) {",
    "export function MathText({ text, className = '' }: { text: string; className?: string }) {\n  const cleanText = sanitizeStudentContent(normalizeMathToken(text));"
  );
  
  content = content.replace(
    /dangerouslySetInnerHTML={{ __html: text }}/,
    "dangerouslySetInnerHTML={{ __html: cleanText }}"
  );

  content = content.replace(
    /\[text\]/,
    "[cleanText]"
  );

  fs.writeFileSync('src/components/MathText.tsx', content);
}
