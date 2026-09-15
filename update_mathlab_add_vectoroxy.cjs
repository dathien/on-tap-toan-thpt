const fs = require('fs');

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

if (!content.includes('VectorOxyLab')) {
  content = content.replace(
    "import { ProbabilityLab }",
    "import { VectorOxyLab } from './labs/VectorOxyLab';\nimport { ProbabilityLab }"
  );
}

if (!content.includes("id: 'vector-oxy'")) {
  const newCatalogEntries = `
  { id: 'vector-oxy', name: 'Vector mặt phẳng (Oxy)', description: 'Tổng, hiệu, tích vô hướng, góc', icon: Move, color: 'text-indigo-600', bg: 'bg-indigo-50', lessonIds: ['l19'] },`;
  
  content = content.replace(
    /export const LAB_CATALOG: LabMeta\[\] = \[/,
    "export const LAB_CATALOG: LabMeta[] = [" + newCatalogEntries
  );
}

if (!content.includes("case 'vector-oxy':")) {
  content = content.replace(
    /case 'probability': return <ProbabilityLab onBack=\{\(\) => setActiveLab\(null\)\} \/>;/,
    "case 'vector-oxy': return <VectorOxyLab onBack={() => setActiveLab(null)} />;\n      case 'probability': return <ProbabilityLab onBack={() => setActiveLab(null)} />;"
  );
}

if (!content.includes("import { Move")) {
  content = content.replace(
    /import \{ (.*?) \} from 'lucide-react';/,
    "import { $1, Move } from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/MathLab.tsx', content);
