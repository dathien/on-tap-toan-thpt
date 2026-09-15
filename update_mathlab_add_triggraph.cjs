const fs = require('fs');

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

if (!content.includes('TrigGraphLab')) {
  content = content.replace(
    "import { ProbabilityLab }",
    "import { TrigGraphLab } from './labs/TrigGraphLab';\nimport { ProbabilityLab }"
  );
}

if (!content.includes("id: 'trig-graph'")) {
  const newCatalogEntries = `
  { id: 'trig-graph', name: 'Đồ thị Hàm số Lượng giác', description: 'Biến đổi sin, cos, tan, cot', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', lessonIds: ['l8'] },`;
  
  content = content.replace(
    /export const LAB_CATALOG: LabMeta\[\] = \[/,
    "export const LAB_CATALOG: LabMeta[] = [" + newCatalogEntries
  );
}

if (!content.includes("case 'trig-graph':")) {
  content = content.replace(
    /case 'probability': return <ProbabilityLab onBack=\{\(\) => setActiveLab\(null\)\} \/>;/,
    "case 'trig-graph': return <TrigGraphLab onBack={() => setActiveLab(null)} />;\n      case 'probability': return <ProbabilityLab onBack={() => setActiveLab(null)} />;"
  );
}

if (!content.includes("import { Activity")) {
  content = content.replace(
    /import \{ (.*?) \} from 'lucide-react';/,
    "import { $1, Activity } from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/MathLab.tsx', content);
