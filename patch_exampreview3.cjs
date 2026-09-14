const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamPreview.tsx', 'utf8');

code = code.replace(
    "const count = examConfig.type === 'THUONG_XUYEN' ? 10 : 12;",
    "const count = examConfig.partCounts?.I || (examConfig.type === 'THUONG_XUYEN' ? 10 : 12);"
);

code = code.replace(
    "const count = 4;",
    "const count = examConfig.partCounts?.II || 4;"
);

code = code.replace(
    "const count = 6;",
    "const count = examConfig.partCounts?.III || 6;"
);

fs.writeFileSync('src/pages/ExamPreview.tsx', code);
console.log("Patched ExamPreview counts");
