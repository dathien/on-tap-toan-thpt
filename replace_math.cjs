const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

for (const file of files) {
  if (file.includes('MathRenderer.tsx') || file.includes('QuestionContentRenderer.tsx') || file.includes('MathText.tsx')) {
    continue;
  }
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Replace imports
  if (content.includes("import { MathText }")) {
    content = content.replace(/import\s+\{\s*MathText\s*\}\s+from\s+['"]([^'"]+)['"];/g, (match, p1) => {
      return `import { MathRenderer } from '${p1.replace('MathText', 'MathRenderer')}';\nimport { QuestionContentRenderer } from '${p1.replace('MathText', 'QuestionContentRenderer')}';`;
    });
    changed = true;
  }

  // Determine if file is a lab or variation table which passes pure math
  const isLab = file.includes('/labs/') || file.includes('VariationTable.tsx');
  
  if (isLab) {
    // In VariationTable: <MathText className="math-token" text="$x$" />
    // we should replace it with <MathRenderer className="math-token" value="x" />
    content = content.replace(/<MathText\s+className="([^"]+)"\s+text="\$([^"]+)\$"\s*\/>/g, '<MathRenderer className="$1" value="$2" />');
    
    // In FunctionAnalysisLab: <MathText text="D = \mathbb{R}" className="inline" />
    content = content.replace(/<MathText\s+text="([^"]+)"\s+className="([^"]+)"\s*\/>/g, '<MathRenderer value="$1" className="$2" />');
    
    // In VectorLab: <MathText text={`...`} />
    content = content.replace(/<MathText\s+text=\{`([^`]+)`\}\s*\/>/g, '<MathRenderer value={`$1`} />');
    content = content.replace(/<MathText\s+text=\{"([^"]+)"\}\s*\/>/g, '<MathRenderer value={"$1"} />');
    
    // General fallback for labs:
    content = content.replace(/<MathText\s+text=/g, '<MathRenderer value=');
    changed = true;
  } else {
    // In normal files, change MathText to QuestionContentRenderer and text to content
    // <MathText text={...} /> -> <QuestionContentRenderer content={...} />
    content = content.replace(/<MathText\s+text=/g, '<QuestionContentRenderer content=');
    // <MathText text="..." />
    content = content.replace(/<MathText\s+text="([^"]+)"\s*\/>/g, '<QuestionContentRenderer content="$1" />');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
  }
}
console.log("Replaced MathText usages.");
