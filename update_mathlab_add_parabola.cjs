const fs = require('fs');

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

if (!content.includes('DynamicParabolaLab')) {
  content = content.replace(
    "import { ProbabilityLab }",
    "import { DynamicParabolaLab } from './labs/DynamicParabolaLab';\nimport { ProbabilityLab }"
  );
}

if (!content.includes("id: 'parabola'")) {
  const newCatalogEntries = `
  { id: 'parabola', name: 'Hàm số bậc hai (Parabol)', description: 'Khảo sát y = ax² + bx + c', icon: Maximize2, color: 'text-sky-600', bg: 'bg-sky-50', lessonIds: ['l8'] },`;
  
  content = content.replace(
    /export const LAB_CATALOG: LabMeta\[\] = \[/,
    "export const LAB_CATALOG: LabMeta[] = [" + newCatalogEntries
  );
}

if (!content.includes("case 'parabola':")) {
  content = content.replace(
    /case 'probability': return <ProbabilityLab onBack=\{\(\) => setActiveLab\(null\)\} \/>;/,
    "case 'parabola': return <DynamicParabolaLab onBack={() => setActiveLab(null)} />;\n      case 'probability': return <ProbabilityLab onBack={() => setActiveLab(null)} />;"
  );
}

if (!content.includes("import { Maximize2")) {
  content = content.replace(
    /import \{ (.*?) \} from 'lucide-react';/,
    "import { $1, Maximize2 } from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/MathLab.tsx', content);
