import React, { useMemo } from 'react';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/contrib/auto-render';
import { normalizeMathToken } from '../utils/mathNormalizer';
import { sanitizeStudentContent } from '../utils/studentSanitizer';

export function MathText({ text, className = '' }: { text: string; className?: string }) {
  const cleanText = sanitizeStudentContent(normalizeMathToken(text));
  const containerRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      renderMathInElement(containerRef.current, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError: false,
      });
    }
  }, [cleanText]);

  return (
    <span 
      ref={containerRef} 
      className={`inline-block whitespace-nowrap leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanText }}
    />
  );
}
