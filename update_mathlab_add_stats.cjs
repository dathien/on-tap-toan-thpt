const fs = require('fs');

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

if (!content.includes('StatisticsLab')) {
  content = content.replace(
    "import { ProbabilityLab }",
    "import { StatisticsLab } from './labs/StatisticsLab';\nimport { ProbabilityLab }"
  );
}

if (!content.includes("id: 'statistics'")) {
  const newCatalogEntries = `
  { id: 'statistics', name: 'Thống kê', description: 'Số trung bình, trung vị, phương sai, độ lệch chuẩn', icon: BarChart3, color: 'text-teal-600', bg: 'bg-teal-50', lessonIds: ['l17'] },`;
  
  content = content.replace(
    /export const LAB_CATALOG: LabMeta\[\] = \[/,
    "export const LAB_CATALOG: LabMeta[] = [" + newCatalogEntries
  );
}

if (!content.includes("case 'statistics':")) {
  content = content.replace(
    /case 'probability': return <ProbabilityLab onBack=\{\(\) => setActiveLab\(null\)\} \/>;/,
    "case 'statistics': return <StatisticsLab onBack={() => setActiveLab(null)} />;\n      case 'probability': return <ProbabilityLab onBack={() => setActiveLab(null)} />;"
  );
}

if (!content.includes("import { BarChart3")) {
  content = content.replace(
    /import \{ (.*?) \} from 'lucide-react';/,
    "import { $1, BarChart3 } from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/MathLab.tsx', content);
