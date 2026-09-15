const fs = require('fs');

const path = 'src/data/curriculum.ts';
let content = fs.readFileSync(path, 'utf8');

// Insert new topics into grade 11 array
const g11_additions = `    {
      "id": "c11_limit",
      "name": "Giới hạn",
      "semester": 1,
      "lessons": [
        { "id": "l11_limit1", "name": "Giới hạn của dãy số", "semester": 1 },
        { "id": "l11_limit2", "name": "Giới hạn hàm số", "semester": 1 }
      ]
    },
    {
      "id": "c11_deriv",
      "name": "Đạo hàm",
      "semester": 2,
      "lessons": [
        { "id": "l11_deriv1", "name": "Đạo hàm", "semester": 2 }
      ]
    },
    {
      "id": "c11_space",
      "name": "Hình học không gian",
      "semester": 2,
      "lessons": [
        { "id": "l11_space1", "name": "Quan hệ vuông góc", "semester": 2 }
      ]
    },`;

if (!content.includes('c11_limit')) {
  content = content.replace('"11": [', '"11": [\n' + g11_additions);
  fs.writeFileSync(path, content);
}
