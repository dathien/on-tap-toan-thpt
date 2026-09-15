import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { normalizeMathExpression } from '../utils/mathNormalizer';

export function MathRenderer({ value, displayMode = false, className = '' }: { value: string; displayMode?: boolean; className?: string; key?: React.Key }) {
  const normalized = useMemo(() => normalizeMathExpression(value), [value]);
  
  const html = useMemo(() => {
    try {
      return katex.renderToString(normalized, {
        displayMode,
        throwOnError: false,
        errorColor: "inherit",
      });
    } catch (e) {
      console.error("KaTeX error:", e);
      return `<span class="text-red-500">[Lỗi công thức]</span>`;
    }
  }, [normalized, displayMode]);

  return (
    <span 
      className={`inline-block max-w-full overflow-x-auto overflow-y-visible align-middle ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
