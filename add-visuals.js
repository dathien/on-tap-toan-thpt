const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  
  if (content.includes('VisualRenderer')) return; // already added

  // Add import
  const importStatement = `import { VisualRenderer } from '../components/visuals/VisualRenderer';\n`;
  content = content.replace(/(import.*MathText.*)/, `$1\n${importStatement}`);
  
  // Replace <MathText text={q.content} /> or similar with MathText + VisualRenderer
  content = content.replace(/(<MathText text=\{([^\}]+content)\}\s*\/>)/g, `$1\n                  {$2.replace('.content', '') && eval($2.replace('.content', ''))?.visual && <VisualRenderer visual={eval($2.replace('.content', ''))?.visual} />}`);

  fs.writeFileSync(file, content);
}

// Manual replacements are safer because eval doesn't work in this context (React JSX scope)
