const fs = require('fs');
const path = 'src/data/demoQuestions.ts';

let content = fs.readFileSync(path, 'utf8');
const newQuestions = `
// GRADE 10 - Hàm số bậc hai
...Array.from({ length: 5 }).map((_, i) => ({
  id: \`g10-hsbh-\${i}\`,
  subject_id: 'math',
  grade_id: 10,
  topic_id: 'c3',
  lesson_id: 'l10_7',
  question_type: 'MCQ_SINGLE',
  difficulty: (i % 4) + 1,
  content: \`Cho hàm số $y = \${i+1}x^2 - 4x + 1$. Tọa độ đỉnh của đồ thị hàm số là:\`,
  options: [
    { id: 'A', content: \`$(2/\${i+1}; \${1 - 4/(i+1)})\`, isCorrect: true },
    { id: 'B', content: \`$(-2/\${i+1}; 1)\`, isCorrect: false },
    { id: 'C', content: \`$(1; \${i-2})\`, isCorrect: false },
    { id: 'D', content: \`$(0; 1)\`, isCorrect: false },
  ]
})),
// GRADE 10 - Vectơ
...Array.from({ length: 5 }).map((_, i) => ({
  id: \`g10-vec-\${i}\`,
  subject_id: 'math',
  grade_id: 10,
  topic_id: 'c5',
  lesson_id: 'l10_15',
  question_type: 'MCQ_SINGLE',
  difficulty: (i % 4) + 1,
  content: \`Cho hai vectơ $\\\\vec{a}, \\\\vec{b}$ có $|\\\\vec{a}| = 2$, $|\\\\vec{b}| = \${i+3}$, góc giữa chúng là $60^\\\\circ$. Tính $\\\\vec{a} \\\\cdot \\\\vec{b}$.\`,
  options: [
    { id: 'A', content: \`\${i+3}\`, isCorrect: true },
    { id: 'B', content: \`\${(i+3)*2}\`, isCorrect: false },
    { id: 'C', content: \`\${(i+3)/2}\`, isCorrect: false },
    { id: 'D', content: \`0\`, isCorrect: false },
  ]
})),
// GRADE 11 - Giới hạn
...Array.from({ length: 5 }).map((_, i) => ({
  id: \`g11-lim-\${i}\`,
  subject_id: 'math',
  grade_id: 11,
  topic_id: 'c11_limit',
  lesson_id: 'l11_limit2',
  question_type: 'MCQ_SINGLE',
  difficulty: (i % 4) + 1,
  content: \`Tính giới hạn $\\\\lim_{x \\\\to \${i}} \\\\frac{x^2 - \${i*i}}{x - \${i}}$.\`,
  options: [
    { id: 'A', content: \`\${i*2}\`, isCorrect: true },
    { id: 'B', content: \`\${i}\`, isCorrect: false },
    { id: 'C', content: \`0\`, isCorrect: false },
    { id: 'D', content: \`+\\\\infty\`, isCorrect: false },
  ]
})),
// GRADE 11 - Đạo hàm
...Array.from({ length: 5 }).map((_, i) => ({
  id: \`g11-der-\${i}\`,
  subject_id: 'math',
  grade_id: 11,
  topic_id: 'c11_deriv',
  lesson_id: 'l11_deriv1',
  question_type: 'MCQ_SINGLE',
  difficulty: (i % 4) + 1,
  content: \`Đạo hàm của hàm số $y = \${i+1}x^3 - 2x$ là:\`,
  options: [
    { id: 'A', content: \`$y' = \${(i+1)*3}x^2 - 2$\`, isCorrect: true },
    { id: 'B', content: \`$y' = \${i+1}x^2 - 2$\`, isCorrect: false },
    { id: 'C', content: \`$y' = \${(i+1)*3}x^2$\`, isCorrect: false },
    { id: 'D', content: \`$y' = 3x^2 - 2$\`, isCorrect: false },
  ]
})),
// GRADE 11 - Hình học không gian
...Array.from({ length: 5 }).map((_, i) => ({
  id: \`g11-spc-\${i}\`,
  subject_id: 'math',
  grade_id: 11,
  topic_id: 'c11_space',
  lesson_id: 'l11_space1',
  question_type: 'MCQ_SINGLE',
  difficulty: (i % 4) + 1,
  content: \`Cho hình chóp S.ABCD có đáy là hình vuông, $SA \\\\perp (ABCD)$. Mệnh đề nào sai?\`,
  options: [
    { id: 'A', content: \`$BD \\\\perp (SAC)$\`, isCorrect: false },
    { id: 'B', content: \`$BC \\\\perp (SAB)$\`, isCorrect: false },
    { id: 'C', content: \`$CD \\\\perp (SAD)$\`, isCorrect: false },
    { id: 'D', content: \`$AC \\\\perp (SBD)$\`, isCorrect: true }, // Not necessarily true if ABCD is rectangle, but ABCD is square, so AC perp BD. But SA perp BD, so BD perp (SAC), so BD perp AC. Wait, D says AC perp (SBD). AC perp BD, but does AC perp SB or SD? No. So D is false.
  ]
})),
`;

if (!content.includes('g10-hsbh')) {
  // Find the end of the array. The array is closed at the very end of file.
  // We can insert before the last "];"
  const insertionPoint = content.lastIndexOf('];');
  content = content.slice(0, insertionPoint) + newQuestions + content.slice(insertionPoint);
  fs.writeFileSync(path, content);
}
