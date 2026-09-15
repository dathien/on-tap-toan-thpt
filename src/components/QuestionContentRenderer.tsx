import React from 'react';
import { MathRenderer } from './MathRenderer';
import { VisualRenderer } from './visuals/VisualRenderer';

export function QuestionContentRenderer({ content, visual, className = '' }: { content: string; visual?: any; className?: string }) {
  if (!content) return null;

  // Split content by $...$ and $$...$$
  const blocks: { type: "text" | "math", value: string, displayMode?: boolean }[] = [];
  
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
    <div className={`question-content-renderer ${className}`}>
      <div className="leading-relaxed inline">
        {blocks.map((block, idx) => {
          if (block.type === 'math') {
            return <MathRenderer key={idx.toString()} value={block.value} displayMode={block.displayMode} />;
          }
          return <span key={idx.toString()} dangerouslySetInnerHTML={{ __html: block.value.replace(/\n/g, '<br/>') }} />;
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
