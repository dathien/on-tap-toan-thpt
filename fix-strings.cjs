const fs = require('fs');

// 1. VariationTable.tsx
let vt = fs.readFileSync('src/components/visuals/VariationTable.tsx', 'utf-8');
vt = vt.replace(
  'if (isStudentView) return <div className="text-red-500 text-sm p-4 text-center border border-red-200 bg-red-50 rounded-xl">Hình ảnh bị lỗi, vui lòng báo giáo viên</div>;',
  'if (isStudentView) return null;'
);
vt = vt.replace(
  'return <div className="text-slate-500 text-sm italic p-4 text-center border border-dashed border-slate-300 rounded-xl">Thiếu dữ liệu bảng biến thiên</div>;',
  'return null;'
);
fs.writeFileSync('src/components/visuals/VariationTable.tsx', vt);

// 2. VisualRenderer.tsx
let vr = fs.readFileSync('src/components/visuals/VisualRenderer.tsx', 'utf-8');
vr = vr.replace(
  'return <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-200">Hình ảnh bị lỗi, vui lòng báo giáo viên</div>;',
  'return null;'
);
vr = vr.replace(
  'return <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-200">Không tải được hình minh họa</div>;',
  'return null;'
);
vr = vr.replace(
  `onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="red">Không tải được hình minh họa</text></svg>';
            }}`,
  `onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}`
);
fs.writeFileSync('src/components/visuals/VisualRenderer.tsx', vr);

// 3. QuestionEditor.tsx
let qe = fs.readFileSync('src/pages/QuestionEditor.tsx', 'utf-8');
qe = qe.replace('Lỗi dữ liệu hình ảnh', 'Dữ liệu không hợp lệ');
fs.writeFileSync('src/pages/QuestionEditor.tsx', qe);
