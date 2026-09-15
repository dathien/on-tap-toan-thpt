const fs = require('fs');

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

if (!content.includes('TriangleSolverLab')) {
  content = content.replace(
    "import { ProbabilityLab }",
    "import { TriangleSolverLab } from './labs/TriangleSolverLab';\nimport { ProbabilityLab }"
  );
}

if (!content.includes("id: 'triangle-solver'")) {
  const newCatalogEntries = `
  { id: 'triangle-solver', name: 'Giải Tam Giác', description: 'Định lí Cosin, Định lí Sin, Diện tích', icon: Triangle, color: 'text-sky-600', bg: 'bg-sky-50', lessonIds: ['l8'] },`;
  
  content = content.replace(
    /export const LAB_CATALOG: LabMeta\[\] = \[/,
    "export const LAB_CATALOG: LabMeta[] = [" + newCatalogEntries
  );
}

if (!content.includes("case 'triangle-solver':")) {
  content = content.replace(
    /case 'probability': return <ProbabilityLab onBack=\{\(\) => setActiveLab\(null\)\} \/>;/,
    "case 'triangle-solver': return <TriangleSolverLab onBack={() => setActiveLab(null)} />;\n      case 'probability': return <ProbabilityLab onBack={() => setActiveLab(null)} />;"
  );
}

if (!content.includes("import { Triangle")) {
  content = content.replace(
    /import \{ (.*?) \} from 'lucide-react';/,
    "import { $1, Triangle } from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/MathLab.tsx', content);
