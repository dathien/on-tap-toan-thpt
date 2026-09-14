const fs = require('fs');
let content = fs.readFileSync('src/pages/Review.tsx', 'utf-8');
content = content.replace("navigate(`/builder/${tpl.id}`)", "navigate(`/review-space/${tpl.id}`)");
content = content.replace("THIẾT LẬP", "VÀO ÔN TẬP");
content = content.replace("Chọn loại bài kiểm tra để thiết lập đề ôn tập.", "Chọn lộ trình ôn tập để củng cố kiến thức và luyện tập.");
fs.writeFileSync('src/pages/Review.tsx', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace("import { ExamBuilder } from './pages/ExamBuilder';", "import { ExamBuilder } from './pages/ExamBuilder';\nimport { ReviewSpace } from './pages/ReviewSpace';\nimport { TheoryLesson } from './pages/TheoryLesson';\nimport { PracticeConfig } from './pages/PracticeConfig';");
appContent = appContent.replace("<Route path=\"review\" element={<Review />} />", "<Route path=\"review\" element={<Review />} />\n          <Route path=\"review-space/:type\" element={<ReviewSpace />} />\n          <Route path=\"review-space/:type/theory\" element={<TheoryLesson />} />\n          <Route path=\"review-space/:type/practice\" element={<PracticeConfig />} />");
fs.writeFileSync('src/App.tsx', appContent);
