const fs = require('fs');

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

if (!content.includes('TrigUnitCircleLab')) {
  content = content.replace(
    "import { LogicLab }",
    "import { TrigUnitCircleLab } from './labs/TrigUnitCircleLab';\nimport { LogicLab }"
  );
}

if (!content.includes("id: 'trig-circle'")) {
  const newCatalogEntries = `
  { id: 'trig-circle', name: 'Đường tròn Lượng giác', description: 'Trực quan hóa Sin, Cos, Tan', icon: Circle, color: 'text-emerald-600', bg: 'bg-emerald-50', lessonIds: ['l6', 'l8'] },`;
  
  content = content.replace(
    /export const LAB_CATALOG: LabMeta\[\] = \[/,
    "export const LAB_CATALOG: LabMeta[] = [" + newCatalogEntries
  );
}

if (!content.includes("case 'trig-circle':")) {
  content = content.replace(
    /case 'logic': return <LogicLab onBack=\{\(\) => setActiveLab\(null\)\} \/>;/,
    "case 'trig-circle': return <TrigUnitCircleLab onBack={() => setActiveLab(null)} />;\n      case 'logic': return <LogicLab onBack={() => setActiveLab(null)} />;"
  );
}

if (!content.includes("import { Circle } from 'lucide-react';")) {
  content = content.replace(
    /import \{ (.*?) \} from 'lucide-react';/,
    "import { $1, Circle } from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/MathLab.tsx', content);
