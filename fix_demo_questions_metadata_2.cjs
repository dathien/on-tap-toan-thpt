const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf8');

// The mcq-visual-4 is Phương trình mặt cầu, should be c6, l22
content = content.replace(/id: `mcq-visual-4`,\s*subject_id: 'math',\s*grade_id: 12 as const,\s*topic_id: 'c6',\s*lesson_id: 'l19'/g, 
  "id: `mcq-visual-4`,\n    subject_id: 'math',\n    grade_id: 12 as const,\n    topic_id: 'c6',\n    lesson_id: 'l22'");

// The tf-visual-5 is hình chóp đều, let's put it in 11, or 12 geometry. 
// We don't have classical geometry in 12 curriculum here. We can just change it to match a 12 geometry topic or coordinate geometry if we add coordinates. 
// Or let's just make it Grade 11 c3 l7 or something if we didn't add it. Let's just give it a tag. We can leave it at c6 l18 (Hệ tọa độ).

// The sa-visual-6 is Gauss history, we can put it anywhere, say c5 l13.
content = content.replace(/id: `sa-visual-6`,\s*subject_id: 'math',\s*grade_id: 12 as const,\s*topic_id: 't3',\s*lesson_id: 'l3'/g,
  "id: `sa-visual-6`,\n    subject_id: 'math',\n    grade_id: 12 as const,\n    topic_id: 'c5',\n    lesson_id: 'l13'");

// Fill questions:
// "Tính đạo hàm" (mcq-fill) -> c5 l13 is fine (Ứng dụng đạo hàm / Đồng biến nghịch biến). Wait, derivative is 11th grade in new curriculum, but in 12th it's used for monotonicity (l13). Let's put it in c5 l13.
content = content.replace(/topic_id: 't1'/g, "topic_id: 'c5'");
content = content.replace(/lesson_id: 'l1'/g, "lesson_id: 'l13'");

// "Cho hàm số lượng giác" (tf-fill) -> c3 l8 (11th grade, Hàm số lượng giác)
content = content.replace(/topic_id: 't2'/g, "topic_id: 'c3'");
content = content.replace(/lesson_id: 'l2'/g, "lesson_id: 'l8'");
// But wait, the fill code has `grade_id: 12 as const`. Let's change those tf-fill to grade_id: 11
content = content.replace(/id: `tf-fill-\${i}`,\s*subject_id: 'math',\s*grade_id: 12 as const/g, "id: `tf-fill-${i}`,\n      subject_id: 'math',\n      grade_id: 11 as const");

// "Giải phương trình" (sa-fill) -> c1 l1 or something simple. 
// It's 3x - 6 = 0. Let's just put it in Grade 10, c2 l4 (Bất pt/pt bậc nhất)
content = content.replace(/id: `sa-fill-\${i}`,\s*subject_id: 'math',\s*grade_id: 12 as const,\s*topic_id: 't3',\s*lesson_id: 'l3'/g, 
  "id: `sa-fill-${i}`,\n      subject_id: 'math',\n      grade_id: 10 as const,\n      topic_id: 'c2',\n      lesson_id: 'l4'");


fs.writeFileSync('src/data/demoQuestions.ts', content);
