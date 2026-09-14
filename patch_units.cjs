const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const oldGenUnits = `const generateUnitsForTopic = (topic: string): LearningUnit[] => {
  return [
    {
      id: 'u1',
      title: 'Khái niệm và Định nghĩa cơ bản',
      theory: [
        \`Lý thuyết trọng tâm về \${topic}.\`,
        'Nắm vững các công thức và định nghĩa cốt lõi.',
      ],
      status: 'LOCKED'
    },
    {
      id: 'u2',
      title: 'Các dạng bài tập thường gặp',
      theory: [
        'Phân loại bài tập từ dễ đến khó.',
        'Ví dụ minh họa chi tiết từng bước giải.'
      ],
      status: 'LOCKED'
    },
    {
      id: 'u3',
      title: 'Kỹ năng giải nhanh',
      theory: [
        'Sử dụng máy tính Casio/Vinacal hiệu quả.',
        'Các mẹo nhận diện đáp án sai nhanh chóng.'
      ],
      status: 'LOCKED'
    }
  ];
};`;

const newGenUnits = `
const generateUnitsForTopic = (topic: string, abilityLevel: string): LearningUnit[] => {
  if (abilityLevel === 'WEAK') {
    return [
      { id: 'u1', title: 'Ôn kiến thức nền', theory: [\`Lý thuyết cơ bản về \${topic}.\`, 'Công thức / quy tắc cần nhớ.'], status: 'LOCKED' },
      { id: 'u2', title: 'Ví dụ mẫu có hướng dẫn', theory: ['Ví dụ chi tiết từng bước.', 'Giải thích kỹ cách áp dụng công thức.'], status: 'LOCKED' },
      { id: 'u3', title: 'Luyện tập cơ bản', theory: ['Làm quen với các dạng bài đơn giản.'], status: 'LOCKED' },
      { id: 'u4', title: 'Luyện lại phần sai', theory: ['Phân tích lỗi sai thường gặp.'], status: 'LOCKED' }
    ];
  } else if (abilityLevel === 'AVERAGE') {
    return [
      { id: 'u1', title: 'Kiến thức trọng tâm', theory: [\`Tổng hợp lý thuyết \${topic}.\`], status: 'LOCKED' },
      { id: 'u2', title: 'Ví dụ các dạng bài', theory: ['Ví dụ minh họa chi tiết.'], status: 'LOCKED' },
      { id: 'u3', title: 'Luyện tập theo dạng', theory: ['Bài tập phân loại rõ ràng.'], status: 'LOCKED' }
    ];
  } else if (abilityLevel === 'GOOD') {
    return [
      { id: 'u1', title: 'Tóm tắt kiến thức', theory: [\`Lý thuyết thu gọn \${topic}.\`], status: 'LOCKED' },
      { id: 'u2', title: 'Bài luyện theo dạng', theory: ['Bài tập vận dụng.'], status: 'LOCKED' },
      { id: 'u3', title: 'Bài vận dụng', theory: ['Kết hợp nhiều khái niệm.'], status: 'LOCKED' },
      { id: 'u4', title: 'Bài tổng hợp', theory: ['Giải quyết bài toán phức tạp.'], status: 'LOCKED' }
    ];
  } else {
    return [
      { id: 'u1', title: 'Kiến thức cực ngắn', theory: [\`Nhắc lại nhanh \${topic}.\`], status: 'LOCKED' },
      { id: 'u2', title: 'Bài vận dụng', theory: ['Bài tập khó, tư duy cao.'], status: 'LOCKED' },
      { id: 'u3', title: 'Bài phân hóa', theory: ['Các dạng toán thi đại học phân hóa.'], status: 'LOCKED' },
      { id: 'u4', title: 'Thử thách', theory: ['Rèn luyện tốc độ và kỹ năng.'], status: 'LOCKED' }
    ];
  }
};
`;

code = code.replace(oldGenUnits, newGenUnits);

// Now patch where it is called
code = code.replace(
    "units: generateUnitsForTopic(lessonObj ? lessonObj.name : selectedTopic),",
    "units: generateUnitsForTopic(lessonObj ? lessonObj.name : selectedTopic, selectedAbility),"
);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched 2");
