import { Question } from '../types';

export const demoQuestions: Question[] = [
  {
    id: `mcq-visual-1`,
    subject_id: 'math',
    grade_id: 12 as const,
    topic_id: 't1',
    lesson_id: 'l1',
    question_type: 'MCQ_SINGLE' as const,
    difficulty: 2 as const,
    content: `Cho hàm số bậc ba $y = f(x)$ có bảng biến thiên như sau. Mệnh đề nào dưới đây đúng?`,
    visual: {
      type: 'VARIATION_TABLE',
      data: {
        xPoints: [
          { type: 'infinity', value: '-\\infty' },
          { type: 'critical', value: '-1' },
          { type: 'critical', value: '1' },
          { type: 'infinity', value: '+\\infty' }
        ],
        derivative: {
          intervals: ['+', '-', '+'],
          criticalValues: ['0', '0']
        },
        function: {
          intervalDirections: ['up', 'down', 'up'],
          pointValues: [
            { x: '-1', y: '4', type: 'local_max' },
            { x: '1', y: '0', type: 'local_min' }
          ],
          leftLimit: '-\\infty',
          rightLimit: '+\\infty'
        }
      }
    },
    options: [
      { id: `o1`, content: `Hàm số đồng biến trên khoảng $(0; 2)$`, isCorrect: false },
      { id: `o2`, content: `Hàm số nghịch biến trên khoảng $(0; 2)$`, isCorrect: true },
      { id: `o3`, content: `Hàm số đạt cực đại tại $x = 2$`, isCorrect: false },
      { id: `o4`, content: `Hàm số đạt cực tiểu tại $x = 0$`, isCorrect: false },
    ],
    tags: ['ham-so', 'bb-b3'],
  },
  {
    id: `mcq-visual-2`,
    subject_id: 'math',
    grade_id: 12 as const,
    topic_id: 't1',
    lesson_id: 'l1',
    question_type: 'MCQ_SINGLE' as const,
    difficulty: 2 as const,
    content: `Cho hàm số $y = \\frac{ax+b}{cx+d}$ có bảng biến thiên như hình vẽ. Chọn khẳng định đúng.`,
    visual: {
      type: 'VARIATION_TABLE',
      data: {
        xPoints: [
          { type: 'infinity', value: '-\\infty' },
          { type: 'discontinuity', value: '1' },
          { type: 'infinity', value: '+\\infty' }
        ],
        derivative: {
          intervals: ['+', '+'],
          criticalValues: []
        },
        function: {
          intervalDirections: ['up', 'up'],
          pointValues: [
            { x: '1', y: '+\\infty', type: 'left_limit' },
            { x: '1', y: '-\\infty', type: 'right_limit' }
          ],
          leftLimit: '2',
          rightLimit: '2'
        }
      }
    },
    options: [
      { id: `o1`, content: `Đồ thị hàm số có tiệm cận đứng $x = 1$, tiệm cận ngang $y = 2$`, isCorrect: true },
      { id: `o2`, content: `Đồ thị hàm số có tiệm cận đứng $x = 2$, tiệm cận ngang $y = 1$`, isCorrect: false },
      { id: `o3`, content: `Hàm số luôn đồng biến trên $\\mathbb{R}$`, isCorrect: false },
      { id: `o4`, content: `Hàm số không có đạo hàm tại $x = 2$`, isCorrect: false },
    ],
    tags: ['ham-so', 'bb-phan-thuc'],
  },
  {
    id: `mcq-visual-3`,
    subject_id: 'math',
    grade_id: 12 as const,
    topic_id: 't1',
    lesson_id: 'l1',
    question_type: 'MCQ_SINGLE' as const,
    difficulty: 3 as const,
    content: `Đường cong trong hình vẽ là đồ thị của hàm số nào dưới đây?`,
    visual: {
      type: 'FUNCTION_GRAPH',
      data: {
        viewBox: "-4 -4 8 8",
        paths: [
          { d: "M -3 -3 Q -1.5 5, 0 0 T 3 3", fill: "none", stroke: "#2563eb", strokeWidth: 0.1 }
        ],
        points: [
          { x: -1.15, y: 1.08, dashedToAxis: true, labelX: "-1", labelY: "1" },
          { x: 1.15, y: -1.08, dashedToAxis: true, labelX: "1", labelY: "-1" }
        ]
      }
    },
    options: [
      { id: `o1`, content: `$y = x^3 - 3x$`, isCorrect: true },
      { id: `o2`, content: `$y = -x^3 + 3x$`, isCorrect: false },
      { id: `o3`, content: `$y = x^4 - 2x^2$`, isCorrect: false },
      { id: `o4`, content: `$y = -x^4 + 2x^2$`, isCorrect: false },
    ],
    tags: ['do-thi'],
  },
  {
    id: `mcq-visual-4`,
    subject_id: 'math',
    grade_id: 12 as const,
    topic_id: 't3',
    lesson_id: 'l3',
    question_type: 'MCQ_SINGLE' as const,
    difficulty: 2 as const,
    content: `Trong không gian $Oxyz$, cho mặt cầu $(S)$ có tâm $I(1; -2; 3)$ và bán kính $R = 5$. Phương trình của mặt cầu $(S)$ là:`,
    visual: {
      type: 'OXYZ',
      data: {
        viewBox: "-5 -5 10 10",
        paths: [
          { d: "M 0 0 L -3 3", stroke: "#64748b", strokeWidth: 0.05 },
          { d: "M 0 0 L 4 0", stroke: "#64748b", strokeWidth: 0.05 },
          { d: "M 0 0 L 0 -4", stroke: "#64748b", strokeWidth: 0.05 }
        ],
        labels: [
          { x: -3.2, y: 3.2, text: "x", fontSize: 0.5 },
          { x: 4.2, y: 0, text: "y", fontSize: 0.5 },
          { x: 0, y: -4.2, text: "z", fontSize: 0.5 },
          { x: -0.3, y: 0.4, text: "O", fontSize: 0.5 },
          { x: 2, y: -2, text: "I(1; -2; 3)", fontSize: 0.4, fill: "#dc2626" }
        ],
        circles: [
          { x: 2, y: -2, r: 1.5, stroke: "#dc2626", strokeWidth: 0.05, fill: "rgba(220, 38, 38, 0.1)" }
        ],
        points: [
          { x: 2, y: -2, r: 0.1, fill: "#dc2626" }
        ]
      }
    },
    options: [
      { id: `o1`, content: `$(x - 1)^2 + (y + 2)^2 + (z - 3)^2 = 25$`, isCorrect: true },
      { id: `o2`, content: `$(x + 1)^2 + (y - 2)^2 + (z + 3)^2 = 25$`, isCorrect: false },
      { id: `o3`, content: `$(x - 1)^2 + (y + 2)^2 + (z - 3)^2 = 5$`, isCorrect: false },
      { id: `o4`, content: `$(x + 1)^2 + (y - 2)^2 + (z + 3)^2 = 5$`, isCorrect: false },
    ],
    tags: ['oxyz'],
  },
  {
    id: `tf-visual-5`,
    subject_id: 'math',
    grade_id: 12 as const,
    topic_id: 't2',
    lesson_id: 'l2',
    question_type: 'TRUE_FALSE_GROUP' as const,
    difficulty: 3 as const,
    content: `Cho hình chóp tứ giác đều $S.ABCD$ có tất cả các cạnh bằng $a$.`,
    visual: {
      type: 'GEOMETRY_3D',
      data: {
        viewBox: "0 0 100 100",
        segments: [
          { x1: 20, y1: 70, x2: 80, y2: 70, strokeWidth: 1 }, // AB
          { x1: 80, y1: 70, x2: 90, y2: 50, strokeWidth: 1 }, // BC
          { x1: 90, y1: 50, x2: 30, y2: 50, strokeWidth: 1, dashed: true }, // CD
          { x1: 30, y1: 50, x2: 20, y2: 70, strokeWidth: 1, dashed: true }, // DA
          { x1: 50, y1: 10, x2: 20, y2: 70, strokeWidth: 1 }, // SA
          { x1: 50, y1: 10, x2: 80, y2: 70, strokeWidth: 1 }, // SB
          { x1: 50, y1: 10, x2: 90, y2: 50, strokeWidth: 1 }, // SC
          { x1: 50, y1: 10, x2: 30, y2: 50, strokeWidth: 1, dashed: true }, // SD
          { x1: 50, y1: 10, x2: 55, y2: 60, strokeWidth: 1, dashed: true }, // SO
          { x1: 20, y1: 70, x2: 90, y2: 50, strokeWidth: 0.5, dashed: true }, // AC
          { x1: 80, y1: 70, x2: 30, y2: 50, strokeWidth: 0.5, dashed: true }, // BD
        ],
        texts: [
          { x: 50, y: 5, content: "S" },
          { x: 15, y: 75, content: "A" },
          { x: 85, y: 75, content: "B" },
          { x: 95, y: 50, content: "C" },
          { x: 25, y: 50, content: "D" },
          { x: 55, y: 65, content: "O" }
        ]
      }
    },
    statements: [
      { id: `s1`, content: `$SO \\perp (ABCD)$`, isTrue: true },
      { id: `s2`, content: `$AC \\perp BD$`, isTrue: true },
      { id: `s3`, content: `Góc giữa mặt bên và mặt đáy bằng $60^\\circ$`, isTrue: false },
      { id: `s4`, content: `Thể tích khối chóp là $\\frac{a^3\\sqrt{2}}{6}$`, isTrue: true },
    ],
    tags: ['hinh-khong-gian'],
  },
  {
    id: `sa-visual-6`,
    subject_id: 'math',
    grade_id: 12 as const,
    topic_id: 't3',
    lesson_id: 'l3',
    question_type: 'SHORT_ANSWER' as const,
    difficulty: 1 as const,
    content: `Quan sát hình ảnh sau và cho biết đây là nhà toán học nào? (Gợi ý: Viết họ tên đầy đủ không dấu)`,
    visual: {
      type: 'IMAGE',
      source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Carl_Friedrich_Gauss.jpg/400px-Carl_Friedrich_Gauss.jpg',
      alt: 'Chân dung nhà toán học',
      width: '300px'
    },
    correctAnswer: 'Carl Friedrich Gauss',
    tags: ['lich-su-toan-hoc'],
  },
  
  // Fill the rest with some standard ones to meet exam count limits (e.g. 12 MCQs, 4 TF, 6 SA)
  ...[
    { fn: 'x^3', ans: '3x^2', fake1: 'x^2', fake2: '3x', fake3: '3' },
    { fn: 'x^4', ans: '4x^3', fake1: 'x^3', fake2: '4x^2', fake3: '4' },
    { fn: '\\sin x', ans: '\\cos x', fake1: '-\\cos x', fake2: '\\sin x', fake3: '-\\sin x' },
    { fn: '\\cos x', ans: '-\\sin x', fake1: '\\sin x', fake2: '\\cos x', fake3: '-\\cos x' },
    { fn: 'e^x', ans: 'e^x', fake1: 'xe^{x-1}', fake2: 'e^{x+1}', fake3: 'x^e' },
    { fn: '\\ln x', ans: '\\frac{1}{x}', fake1: 'e^x', fake2: 'x', fake3: '\\frac{1}{x^2}' },
    { fn: '\\sqrt{x}', ans: '\\frac{1}{2\\sqrt{x}}', fake1: '\\frac{1}{\\sqrt{x}}', fake2: '\\sqrt{x}', fake3: '2\\sqrt{x}' },
    { fn: '\\frac{1}{x}', ans: '-\\frac{1}{x^2}', fake1: '\\frac{1}{x^2}', fake2: '\\ln x', fake3: '-\\frac{1}{x}' },
    { fn: '2^x', ans: '2^x \\ln 2', fake1: '2^x', fake2: 'x 2^{x-1}', fake3: '\\frac{2^x}{\\ln 2}' }
  ].map((item, i) => ({
      id: `mcq-fill-${i}`,
      subject_id: 'math',
      grade_id: 12 as const,
      topic_id: 't1',
      lesson_id: 'l1',
      question_type: 'MCQ_SINGLE' as const,
      difficulty: 1 as const,
      content: `Tính đạo hàm của hàm số $y = ${item.fn}$.`,
      options: [
        { id: 'o1', content: `$${item.ans}$`, isCorrect: true },
        { id: 'o2', content: `$${item.fake1}$`, isCorrect: false },
        { id: 'o3', content: `$${item.fake2}$`, isCorrect: false },
        { id: 'o4', content: `$${item.fake3}$`, isCorrect: false },
      ],
      tags: ['ham-so'],
  })),
  ...[
    { fn: '\\cos x', odd: false, period: '2\\pi', range: '[-1; 1]' },
    { fn: '\\tan x', odd: true, period: '\\pi', range: '\\mathbb{R}' },
    { fn: '\\cot x', odd: true, period: '\\pi', range: '\\mathbb{R}' }
  ].map((item, i) => ({
      id: `tf-fill-${i}`,
      subject_id: 'math',
      grade_id: 12 as const,
      topic_id: 't2',
      lesson_id: 'l2',
      question_type: 'TRUE_FALSE_GROUP' as const,
      difficulty: 2 as const,
      content: `Cho hàm số $y = ${item.fn}$.`,
      statements: [
        { id: 's1', content: `Hàm số tuần hoàn với chu kỳ $${item.period}$`, isTrue: true },
        { id: 's2', content: `Hàm số đồng biến trên $\\mathbb{R}$`, isTrue: false },
        { id: 's3', content: `Tập giá trị là $${item.range}$`, isTrue: true },
        { id: 's4', content: `Hàm số lẻ`, isTrue: item.odd },
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
      id: `sa-fill-${i}`,
      subject_id: 'math',
      grade_id: 12 as const,
      topic_id: 't3',
      lesson_id: 'l3',
      question_type: 'SHORT_ANSWER' as const,
      difficulty: 2 as const,
      content: `Giải phương trình $${item.eq}$.`,
      correctAnswer: item.ans,
      tags: ['phuong-trinh'],
  }))
];
