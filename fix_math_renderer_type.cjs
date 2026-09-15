const fs = require('fs');
let code = fs.readFileSync('src/components/MathRenderer.tsx', 'utf-8');
code = code.replace(/export function MathRenderer\(\{ value, displayMode = false, className = '' \}: \{ value: string; displayMode\?: boolean; className\?: string \}\) \{/g, 
"export function MathRenderer({ value, displayMode = false, className = '' }: { value: string; displayMode?: boolean; className?: string; key?: React.Key }) {");
fs.writeFileSync('src/components/MathRenderer.tsx', code);
