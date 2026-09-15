const fs = require('fs');

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

if (!content.includes('ProbabilityLab')) {
  content = content.replace(
    "import { LogicLab }",
    "import { ProbabilityLab } from './labs/ProbabilityLab';\nimport { LogicLab }"
  );
}

if (!content.includes("id: 'probability'")) {
  const newCatalogEntries = `
  { id: 'probability', name: 'Xác suất thực nghiệm', description: 'Định luật số lớn, mô phỏng tung đồng xu/xúc xắc', icon: Dices, color: 'text-violet-600', bg: 'bg-violet-50', lessonIds: ['l6', 'l8'] },`;
  // Just inject it. We will fix lessonIds later if needed.
  
  content = content.replace(
    /export const LAB_CATALOG: LabMeta\[\] = \[/,
    "export const LAB_CATALOG: LabMeta[] = [" + newCatalogEntries
  );
}

if (!content.includes("case 'probability':")) {
  content = content.replace(
    /case 'logic': return <LogicLab onBack=\{\(\) => setActiveLab\(null\)\} \/>;/,
    "case 'probability': return <ProbabilityLab onBack={() => setActiveLab(null)} />;\n      case 'logic': return <LogicLab onBack={() => setActiveLab(null)} />;"
  );
}

if (!content.includes("import { Dices } from 'lucide-react';")) {
  content = content.replace(
    /import \{ (.*?) \} from 'lucide-react';/,
    "import { $1, Dices } from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/MathLab.tsx', content);
