const fs = require('fs');

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

if (!content.includes('SequenceLab')) {
  content = content.replace(
    "import { ProbabilityLab }",
    "import { SequenceLab } from './labs/SequenceLab';\nimport { ProbabilityLab }"
  );
}

if (!content.includes("id: 'sequence'")) {
  const newCatalogEntries = `
  { id: 'sequence', name: 'Dãy số (CSC/CSN)', description: 'Khảo sát sự tăng trưởng, công thức tổng quát', icon: AlignEndHorizontal, color: 'text-amber-600', bg: 'bg-amber-50', lessonIds: ['l11', 'l12'] },`;
  
  content = content.replace(
    /export const LAB_CATALOG: LabMeta\[\] = \[/,
    "export const LAB_CATALOG: LabMeta[] = [" + newCatalogEntries
  );
}

if (!content.includes("case 'sequence':")) {
  content = content.replace(
    /case 'probability': return <ProbabilityLab onBack=\{\(\) => setActiveLab\(null\)\} \/>;/,
    "case 'sequence': return <SequenceLab onBack={() => setActiveLab(null)} />;\n      case 'probability': return <ProbabilityLab onBack={() => setActiveLab(null)} />;"
  );
}

if (!content.includes("import { AlignEndHorizontal")) {
  content = content.replace(
    /import \{ (.*?) \} from 'lucide-react';/,
    "import { $1, AlignEndHorizontal } from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/MathLab.tsx', content);
