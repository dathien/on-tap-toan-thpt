const fs = require('fs');

const data = {
  "10": [
    {
      "id": "c1",
      "name": "Mệnh đề và tập hợp",
      "lessons": [
        { "id": "l10_1", "name": "Mệnh đề", "semester": 1 },
        { "id": "l10_2", "name": "Tập hợp", "semester": 1 },
        { "id": "l10_3", "name": "Các phép toán trên tập hợp", "semester": 1 }
      ],
      "semester": 1
    },
    {
      "id": "c2",
      "name": "Bất phương trình và hệ bất phương trình bậc nhất hai ẩn",
      "lessons": [
        { "id": "l10_4", "name": "Bất phương trình bậc nhất hai ẩn", "semester": 1 },
        { "id": "l10_5", "name": "Hệ bất phương trình bậc nhất hai ẩn", "semester": 1 }
      ],
      "semester": 1
    },
    {
      "id": "c3",
      "name": "Hàm số và đồ thị",
      "lessons": [
        { "id": "l10_6", "name": "Hàm số", "semester": 1 },
        { "id": "l10_7", "name": "Hàm số bậc hai", "semester": 1 },
        { "id": "l10_8", "name": "Đồ thị hàm số bậc hai", "semester": 1 }
      ],
      "semester": 1
    },
    {
      "id": "c4",
      "name": "Hệ thức lượng trong tam giác",
      "lessons": [
        { "id": "l10_9", "name": "Giá trị lượng giác của một góc từ 0° đến 180°", "semester": 1 },
        { "id": "l10_10", "name": "Định lí côsin và định lí sin", "semester": 1 },
        { "id": "l10_11", "name": "Giải tam giác và ứng dụng thực tế", "semester": 1 }
      ],
      "semester": 1
    },
    {
      "id": "c5",
      "name": "Vectơ",
      "lessons": [
        { "id": "l10_12", "name": "Khái niệm vectơ", "semester": 1 },
        { "id": "l10_13", "name": "Tổng và hiệu của hai vectơ", "semester": 1 },
        { "id": "l10_14", "name": "Tích của một vectơ với một số", "semester": 1 },
        { "id": "l10_15", "name": "Tích vô hướng của hai vectơ", "semester": 1 }
      ],
      "semester": 1
    },
    {
      "id": "c6",
      "name": "Thống kê",
      "lessons": [
        { "id": "l10_16", "name": "Số gần đúng. Sai số", "semester": 1 },
        { "id": "l10_17", "name": "Các số đặc trưng đo xu thế trung tâm", "semester": 1 },
        { "id": "l10_18", "name": "Các số đặc trưng đo mức độ phân tán", "semester": 1 }
      ],
      "semester": 1
    },
    {
      "id": "c7",
      "name": "Xác suất",
      "lessons": [
        { "id": "l10_19", "name": "Biến cố", "semester": 2 },
        { "id": "l10_20", "name": "Xác suất", "semester": 2 }
      ],
      "semester": 2
    }
  ]
};

let content = fs.readFileSync('src/data/curriculum.ts', 'utf8');
const old10Str = /"10": \[[^\]]*?\]/s; 

// wait, this regex might match incorrectly due to nested arrays. Let's do it manually.

const exportIndex = content.indexOf('export const curriculumData: Record<number, Topic[]> = {');
const end10 = content.indexOf('"11": [');
const before10 = content.substring(0, exportIndex + 'export const curriculumData: Record<number, Topic[]> = {'.length);
const after10 = content.substring(end10);

const newContent = before10 + '\n  "10": ' + JSON.stringify(data["10"], null, 4) + ',\n  ' + after10;
fs.writeFileSync('src/data/curriculum.ts', newContent);
