const fs = require('fs');
let content = fs.readFileSync('src/components/visuals/VariationTable.tsx', 'utf-8');

const oldError = `if (!validateVariationTable(data)) {
    return <div className="text-slate-500 text-sm italic p-4 text-center border border-dashed border-slate-300 rounded-xl">Thiếu dữ liệu bảng biến thiên</div>;
  }`;

const newError = `const isStudentView = typeof window !== 'undefined' && (window.location.pathname.includes('/exam') || window.location.pathname.includes('/result'));
  if (!validateVariationTable(data)) {
    if (isStudentView) return <div className="text-red-500 text-sm p-4 text-center border border-red-200 bg-red-50 rounded-xl">Hình ảnh bị lỗi, vui lòng báo giáo viên</div>;
    return <div className="text-slate-500 text-sm italic p-4 text-center border border-dashed border-slate-300 rounded-xl">Thiếu dữ liệu bảng biến thiên</div>;
  }`;

content = content.replace(oldError, newError);
fs.writeFileSync('src/components/visuals/VariationTable.tsx', content);
console.log("Patched VariationTable.tsx for errors");
