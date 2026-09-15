const fs = require('fs');

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

if (!content.includes('LimitLab')) {
  content = content.replace(
    "import { ProbabilityLab }",
    "import { LimitLab } from './labs/LimitLab';\nimport { ProbabilityLab }"
  );
}

if (!content.includes("id: 'limit'")) {
  const newCatalogEntries = `
  { id: 'limit', name: 'Giới hạn hàm số', description: 'Trực quan hóa giới hạn trái/phải', icon: ArrowRightToLine, color: 'text-rose-600', bg: 'bg-rose-50', lessonIds: ['l11', 'l12'] },`;
  
  content = content.replace(
    /export const LAB_CATALOG: LabMeta\[\] = \[/,
    "export const LAB_CATALOG: LabMeta[] = [" + newCatalogEntries
  );
}

if (!content.includes("case 'limit':")) {
  content = content.replace(
    /case 'probability': return <ProbabilityLab onBack=\{\(\) => setActiveLab\(null\)\} \/>;/,
    "case 'limit': return <LimitLab onBack={() => setActiveLab(null)} />;\n      case 'probability': return <ProbabilityLab onBack={() => setActiveLab(null)} />;"
  );
}

if (!content.includes("import { ArrowRightToLine")) {
  content = content.replace(
    /import \{ (.*?) \} from 'lucide-react';/,
    "import { $1, ArrowRightToLine } from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/MathLab.tsx', content);
