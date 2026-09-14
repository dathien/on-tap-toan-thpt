const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

code = code.replace(
  'Tỷ lệ đúng chưa đạt yêu cầu (>=70%). Bạn cần ôn tập lại.',
  'Tỷ lệ đúng chưa đạt yêu cầu (&gt;=70%). Bạn cần ôn tập lại.'
);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
