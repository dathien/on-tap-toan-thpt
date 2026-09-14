const fs = require('fs');
let content = fs.readFileSync('src/components/visuals/VisualRenderer.tsx', 'utf-8');

if (!content.includes('validateVariationTable')) {
  content = content.replace("import { VariationTable } from './VariationTable';", "import { VariationTable, validateVariationTable } from './VariationTable';");
}

const oldCase = `case 'VARIATION_TABLE':
        return <VariationTable data={visual.data} />;`;

const newCase = `case 'VARIATION_TABLE':
        const isStudentView = typeof window !== 'undefined' && (window.location.pathname.includes('/exam') || window.location.pathname.includes('/result'));
        if (!validateVariationTable(visual.data)) {
           if (visual.source) {
             return <img src={visual.source} alt="fallback" className="max-w-full h-auto mx-auto rounded-lg object-contain" style={{ maxHeight: isFullscreen ? '90vh' : '400px' }} />;
           }
           if (isStudentView) {
             return <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-200">Hình ảnh bị lỗi, vui lòng báo giáo viên</div>;
           }
        }
        return <VariationTable data={visual.data} />;`;

content = content.replace(oldCase, newCase);

fs.writeFileSync('src/components/visuals/VisualRenderer.tsx', content);
console.log("Patched VisualRenderer.tsx");
