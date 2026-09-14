const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

code = code.replace(
  "(!selectedGrade || !selectedTopic || !selectedLesson || !target) ? 'VUI LÒNG CHỌN ĐẦY ĐỦ' : 'BẮT ĐẦU CHẨN ĐOÁN'",
  "(!selectedGrade || !selectedTopic || !selectedLesson || !target) ? 'VUI LÒNG CHỌN ĐẦY ĐỦ' : 'BẮT ĐẦU HỌC'"
);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log('done fixing button');
