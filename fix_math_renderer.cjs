const fs = require('fs');

// 1. Create QuestionContentRenderer
const questionContentRendererCode = `import React from 'react';
import { MathRenderer } from './MathRenderer';
import { VisualRenderer } from './visuals/VisualRenderer';

export function QuestionContentRenderer({ content, visual, className = '' }: { content: string; visual?: any; className?: string }) {
  if (!content) return null;

  // Split content by $...$ and $$...$$
  const blocks = [];
  
  // Simple parser for $...$ and $$...$$
  let current = '';
  let i = 0;
  
  while (i < content.length) {
    if (content.substr(i, 2) === '$$') {
      if (current) {
        blocks.push({ type: 'text', value: current });
        current = '';
      }
      i += 2;
      let math = '';
      while (i < content.length && content.substr(i, 2) !== '$$') {
        math += content[i];
        i++;
      }
      blocks.push({ type: 'math', value: math, displayMode: true });
      i += 2;
    } else if (content[i] === '$') {
      if (current) {
        blocks.push({ type: 'text', value: current });
        current = '';
      }
      i++;
      let math = '';
      while (i < content.length && content[i] !== '$') {
        math += content[i];
        i++;
      }
      blocks.push({ type: 'math', value: math, displayMode: false });
      i++;
    } else {
      current += content[i];
      i++;
    }
  }
  
  if (current) {
    blocks.push({ type: 'text', value: current });
  }

  return (
    <div className={\`question-content-renderer \${className}\`}>
      <div className="leading-relaxed inline">
        {blocks.map((block, idx) => {
          if (block.type === 'math') {
            return <MathRenderer key={idx} value={block.value} displayMode={block.displayMode} />;
          }
          return <span key={idx} dangerouslySetInnerHTML={{ __html: block.value.replace(/\\n/g, '<br/>') }} />;
        })}
      </div>
      {visual && (
        <div className="mt-4">
          <VisualRenderer visual={visual} />
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('src/components/QuestionContentRenderer.tsx', questionContentRendererCode);

// 2. Modify mathNormalizer
const normalizerCode = `export function normalizeMathExpression(value: string | undefined | null): string {
  if (value === undefined || value === null) return "";
  let v = String(value).trim();
  
  // Replace missing backslashes or unicode math symbols
  v = v.replace(/∞/g, "\\\\infty");
  v = v.replace(/±/g, "\\\\pm");
  v = v.replace(/⇔/g, "\\\\Leftrightarrow");
  v = v.replace(/⇒/g, "\\\\Rightarrow");
  v = v.replace(/≥/g, "\\\\ge");
  v = v.replace(/≤/g, "\\\\le");
  v = v.replace(/≠/g, "\\\\neq");
  v = v.replace(/−/g, "-");
  
  // Normalize missing backslashes for common commands if they are isolated
  v = v.replace(/(^|[^\\\\])\\binfty\\b/g, "$1\\\\infty");
  v = v.replace(/(^|[^\\\\])\\binf\\b/g, "$1\\\\infty");
  v = v.replace(/(^|[^\\\\])\\blim\\b/g, "$1\\\\lim");
  v = v.replace(/(^|[^\\\\])\\bsin\\b/g, "$1\\\\sin");
  v = v.replace(/(^|[^\\\\])\\bcos\\b/g, "$1\\\\cos");
  v = v.replace(/(^|[^\\\\])\\btan\\b/g, "$1\\\\tan");
  
  return v;
}

export function normalizeMathToken(value: string | undefined | null): string {
  return normalizeMathExpression(value);
}
export function normalizeMathValue(value: string | undefined | null): string {
  return normalizeMathExpression(value);
}
`;
fs.writeFileSync('src/utils/mathNormalizer.ts', normalizerCode);

console.log("Created QuestionContentRenderer and updated mathNormalizer.");
