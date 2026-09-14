const fs = require('fs');
const lines = fs.readFileSync('src/data/demoQuestions.ts', 'utf-8').split('\n');

// Find the line index of "Fill the rest"
const anchorIndex = lines.findIndex(l => l.includes('Fill the rest with some standard ones'));

if (anchorIndex !== -1) {
  const head = lines.slice(0, anchorIndex + 1).join('\n');
  const newTail = `
  ...[
    { fn: 'x^3', ans: '3x^2', fake1: 'x^2', fake2: '3x', fake3: '3' },
    { fn: 'x^4', ans: '4x^3', fake1: 'x^3', fake2: '4x^2', fake3: '4' },
    { fn: '\\\\sin x', ans: '\\\\cos x', fake1: '-\\\\cos x', fake2: '\\\\sin x', fake3: '-\\\\sin x' },
    { fn: '\\\\cos x', ans: '-\\\\sin x', fake1: '\\\\sin x', fake2: '\\\\cos x', fake3: '-\\\\cos x' },
    { fn: 'e^x', ans: 'e^x', fake1: 'xe^{x-1}', fake2: 'e^{x+1}', fake3: 'x^e' },
    { fn: '\\\\ln x', ans: '\\\\frac{1}{x}', fake1: 'e^x', fake2: 'x', fake3: '\\\\frac{1}{x^2}' },
    { fn: '\\\\sqrt{x}', ans: '\\\\frac{1}{2\\\\sqrt{x}}', fake1: '\\\\frac{1}{\\\\sqrt{x}}', fake2: '\\\\sqrt{x}', fake3: '2\\\\sqrt{x}' },
    { fn: '\\\\frac{1}{x}', ans: '-\\\\frac{1}{x^2}', fake1: '\\\\frac{1}{x^2}', fake2: '\\\\ln x', fake3: '-\\\\frac{1}{x}' },
    { fn: '2^x', ans: '2^x \\\\ln 2', fake1: '2^x', fake2: 'x 2^{x-1}', fake3: '\\\\frac{2^x}{\\\\ln 2}' }
  ].map((item, i) => ({
      id: \`mcq-fill-\${i}\`,
      subject_id: 'math',
      grade_id: 12,
      topic_id: 't1',
      lesson_id: 'l1',
      question_type: 'MCQ_SINGLE',
      difficulty: 1,
      content: \`Tính đạo hàm của hàm số $y = \${item.fn}$.\`,
      options: [
        { id: 'o1', content: \`$\${item.ans}$\`, isCorrect: true },
        { id: 'o2', content: \`$\${item.fake1}$\`, isCorrect: false },
        { id: 'o3', content: \`$\${item.fake2}$\`, isCorrect: false },
        { id: 'o4', content: \`$\${item.fake3}$\`, isCorrect: false },
      ],
      tags: ['ham-so'],
  })),
  ...[
    { fn: '\\\\cos x', odd: false, period: '2\\\\pi', range: '[-1; 1]' },
    { fn: '\\\\tan x', odd: true, period: '\\\\pi', range: '\\\\mathbb{R}' },
    { fn: '\\\\cot x', odd: true, period: '\\\\pi', range: '\\\\mathbb{R}' }
  ].map((item, i) => ({
      id: \`tf-fill-\${i}\`,
      subject_id: 'math',
      grade_id: 12,
      topic_id: 't2',
      lesson_id: 'l2',
      question_type: 'TRUE_FALSE_GROUP',
      difficulty: 2,
      content: \`Cho hàm số $y = \${item.fn}$.\`,
      statements: [
        { id: 's1', content: \`Hàm số tuần hoàn với chu kỳ $\${item.period}$\`, isTrue: true },
        { id: 's2', content: \`Hàm số đồng biến trên $\\\\mathbb{R}$\`, isTrue: false },
        { id: 's3', content: \`Tập giá trị là $\${item.range}$\`, isTrue: true },
        { id: 's4', content: \`Hàm số lẻ\`, isTrue: item.odd },
      ],
      tags: ['luong-giac'],
  })),
  ...[
    { eq: '3x - 6 = 0', ans: '2' },
    { eq: '4x - 12 = 0', ans: '3' },
    { eq: '5x - 20 = 0', ans: '4' },
    { eq: '2x + 8 = 0', ans: '-4' },
    { eq: 'x - 5 = 0', ans: '5' }
  ].map((item, i) => ({
      id: \`sa-fill-\${i}\`,
      subject_id: 'math',
      grade_id: 12,
      topic_id: 't3',
      lesson_id: 'l3',
      question_type: 'SHORT_ANSWER',
      difficulty: 2,
      content: \`Giải phương trình $\${item.eq}$.\`,
      correctAnswer: item.ans,
      tags: ['phuong-trinh'],
  }))
];
`;
  fs.writeFileSync('src/data/demoQuestions.ts', head + newTail);
  console.log("Fixed demoQuestions.ts");
}
