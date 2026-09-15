const fs = require('fs');

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

// Replace "Chưa có Lab" with nothing (just don't render it)
content = content.replace(
  /: \(\s*<span className="text-sm text-slate-400 italic">Chưa có Lab<\/span>\s*\)/g,
  ': null'
);

// Remove NEEDS_CURRICULUM_MAPPING alert
content = content.replace(
  /\{lesson\.semester === 'NEEDS_CURRICULUM_MAPPING' && \([\s\S]*?\}\)/g,
  ''
);

// Add imports for new labs
const imports = `import { LogicLab } from './labs/LogicLab';
import { SetLab } from './labs/SetLab';
import { Inequality2DLab } from './labs/Inequality2DLab';
import { InequalitySystem2DLab } from './labs/InequalitySystem2DLab';
import { Brain, PieChart, Layers, Grid3X3, LayoutDashboard } from 'lucide-react';
`;

content = content.replace(
  "import { OxyzLab } from './labs/OxyzLab';",
  "import { OxyzLab } from './labs/OxyzLab';\n" + imports
);

// Add to LAB_CATALOG
const newCatalogEntries = `
  { id: 'logic', name: 'Mệnh đề', description: 'Bảng giá trị chân lý, các phép toán logic', icon: Brain, color: 'text-rose-600', bg: 'bg-rose-50', lessonIds: ['l1'] },
  { id: 'sets', name: 'Tập hợp', description: 'Biểu đồ Venn, phần tử của tập hợp', icon: PieChart, color: 'text-orange-600', bg: 'bg-orange-50', lessonIds: ['l2'] },
  { id: 'set-operations', name: 'Phép toán Tập hợp', description: 'Giao, hợp, hiệu, phần bù', icon: Layers, color: 'text-yellow-600', bg: 'bg-yellow-50', lessonIds: ['l3'] },
  { id: 'inequality-2d', name: 'Bất phương trình 2 ẩn', description: 'Miền nghiệm trên mặt phẳng tọa độ', icon: Grid3X3, color: 'text-green-600', bg: 'bg-green-50', lessonIds: ['l4'] },
  { id: 'inequality-system-2d', name: 'Hệ BPT 2 ẩn', description: 'Giao của các miền nghiệm', icon: LayoutDashboard, color: 'text-teal-600', bg: 'bg-teal-50', lessonIds: ['l5'] },
`;

content = content.replace(
  "export const LAB_CATALOG: LabMeta\\[\\] = \\[",
  "export const LAB_CATALOG: LabMeta[] = [" + newCatalogEntries
);

// Update renderActiveLab switch statement
const newSwitchCases = `
      case 'logic': return <LogicLab onBack={() => setActiveLab(null)} />;
      case 'sets': return <SetLab onBack={() => setActiveLab(null)} mode="SET" />;
      case 'set-operations': return <SetLab onBack={() => setActiveLab(null)} mode="OPERATIONS" />;
      case 'inequality-2d': return <Inequality2DLab onBack={() => setActiveLab(null)} />;
      case 'inequality-system-2d': return <InequalitySystem2DLab onBack={() => setActiveLab(null)} />;
`;

content = content.replace(
  /case 'oxyz': return <OxyzLab onBack=\{\(\) => setActiveLab\(null\)\} \/>;/g,
  "case 'oxyz': return <OxyzLab onBack={() => setActiveLab(null)} />;" + newSwitchCases
);

// Replace "Brain, PieChart, Layers, Grid3X3, LayoutDashboard" in lucide-react import if they aren't there yet (already handled above, but need to make sure we don't duplicate).
// Actually, it's safer to just inject it. But let's fix the lucide-react import.
content = content.replace(
  /import \{ LineChart, Axis3D, Shapes, Target, Triangle, Maximize, Search, ArrowLeft, FlaskConical, LayoutGrid, AlertCircle \} from 'lucide-react';/,
  "import { LineChart, Axis3D, Shapes, Target, Triangle, Maximize, Search, ArrowLeft, FlaskConical, LayoutGrid, AlertCircle, Brain, PieChart, Layers, Grid3X3, LayoutDashboard } from 'lucide-react';"
);

// Clean up duplicate lucide-react import added previously
content = content.replace(
  "import { Brain, PieChart, Layers, Grid3X3, LayoutDashboard } from 'lucide-react';",
  ""
);

fs.writeFileSync('src/pages/MathLab.tsx', content);
