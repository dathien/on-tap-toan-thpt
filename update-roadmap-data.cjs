const fs = require('fs');

const code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const newCurriculum = `// Shared Curriculum Data
const demoCurriculum: Record<number, { id: string, name: string, lessons: { id: string, name: string }[] }[]> = {
  10: [
    {
      id: "t10_1", name: "Mệnh đề và tập hợp",
      lessons: [
        { id: "l10_1_1", name: "Mệnh đề" },
        { id: "l10_1_2", name: "Tập hợp" },
        { id: "l10_1_3", name: "Các phép toán trên tập hợp" }
      ]
    },
    {
      id: "t10_2", name: "Bất phương trình và hệ bất phương trình",
      lessons: [
        { id: "l10_2_1", name: "Bất phương trình bậc nhất hai ẩn" },
        { id: "l10_2_2", name: "Hệ bất phương trình bậc nhất hai ẩn" }
      ]
    },
    {
      id: "t10_3", name: "Hàm số và đồ thị",
      lessons: [
        { id: "l10_3_1", name: "Hàm số" },
        { id: "l10_3_2", name: "Hàm số bậc hai" },
        { id: "l10_3_3", name: "Đồ thị hàm số bậc hai" }
      ]
    },
    {
      id: "t10_4", name: "Hệ thức lượng trong tam giác",
      lessons: [
        { id: "l10_4_1", name: "Giá trị lượng giác của một góc" },
        { id: "l10_4_2", name: "Định lí cosin" },
        { id: "l10_4_3", name: "Định lí sin" },
        { id: "l10_4_4", name: "Giải tam giác" }
      ]
    },
    {
      id: "t10_5", name: "Vectơ",
      lessons: [
        { id: "l10_5_1", name: "Khái niệm vectơ" },
        { id: "l10_5_2", name: "Tổng và hiệu hai vectơ" },
        { id: "l10_5_3", name: "Tích của vectơ với một số" },
        { id: "l10_5_4", name: "Tích vô hướng của hai vectơ" }
      ]
    },
    {
      id: "t10_6", name: "Thống kê",
      lessons: [
        { id: "l10_6_1", name: "Số gần đúng và sai số" },
        { id: "l10_6_2", name: "Các số đặc trưng đo xu thế trung tâm" },
        { id: "l10_6_3", name: "Các số đặc trưng đo mức độ phân tán" }
      ]
    },
    {
      id: "t10_7", name: "Xác suất",
      lessons: [
        { id: "l10_7_1", name: "Biến cố" },
        { id: "l10_7_2", name: "Xác suất của biến cố" }
      ]
    }
  ],
  11: [
    {
      id: "t11_1", name: "Hàm số lượng giác và phương trình lượng giác",
      lessons: [
        { id: "l11_1_1", name: "Góc lượng giác" },
        { id: "l11_1_2", name: "Giá trị lượng giác" },
        { id: "l11_1_3", name: "Hàm số lượng giác" },
        { id: "l11_1_4", name: "Phương trình lượng giác cơ bản" }
      ]
    },
    {
      id: "t11_2", name: "Dãy số",
      lessons: [
        { id: "l11_2_1", name: "Dãy số" },
        { id: "l11_2_2", name: "Cấp số cộng" },
        { id: "l11_2_3", name: "Cấp số nhân" }
      ]
    },
    {
      id: "t11_3", name: "Giới hạn",
      lessons: [
        { id: "l11_3_1", name: "Giới hạn của dãy số" },
        { id: "l11_3_2", name: "Giới hạn của hàm số" }
      ]
    },
    {
      id: "t11_4", name: "Hàm số liên tục",
      lessons: [
        { id: "l11_4_1", name: "Khái niệm hàm số liên tục" },
        { id: "l11_4_2", name: "Hàm số liên tục trên khoảng, đoạn" }
      ]
    },
    {
      id: "t11_5", name: "Đạo hàm",
      lessons: [
        { id: "l11_5_1", name: "Định nghĩa đạo hàm" },
        { id: "l11_5_2", name: "Các quy tắc tính đạo hàm" },
        { id: "l11_5_3", name: "Đạo hàm của hàm số lượng giác" }
      ]
    },
    {
      id: "t11_6", name: "Quan hệ song song trong không gian",
      lessons: [
        { id: "l11_6_1", name: "Đường thẳng và mặt phẳng" },
        { id: "l11_6_2", name: "Hai đường thẳng song song" },
        { id: "l11_6_3", name: "Đường thẳng song song với mặt phẳng" },
        { id: "l11_6_4", name: "Hai mặt phẳng song song" }
      ]
    },
    {
      id: "t11_7", name: "Quan hệ vuông góc trong không gian",
      lessons: [
        { id: "l11_7_1", name: "Hai đường thẳng vuông góc" },
        { id: "l11_7_2", name: "Đường thẳng vuông góc mặt phẳng" },
        { id: "l11_7_3", name: "Hai mặt phẳng vuông góc" }
      ]
    },
    {
      id: "t11_8", name: "Xác suất",
      lessons: [
        { id: "l11_8_1", name: "Biến cố hợp và giao" },
        { id: "l11_8_2", name: "Hai biến cố độc lập" },
        { id: "l11_8_3", name: "Công thức xác suất" }
      ]
    }
  ],
  12: [
    {
      id: "t12_1", name: "Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số",
      lessons: [
        { id: "l12_1_1", name: "Tính đơn điệu của hàm số" },
        { id: "l12_1_2", name: "Cực trị của hàm số" },
        { id: "l12_1_3", name: "Giá trị lớn nhất và nhỏ nhất" },
        { id: "l12_1_4", name: "Đường tiệm cận" },
        { id: "l12_1_5", name: "Khảo sát và vẽ đồ thị hàm số" }
      ]
    },
    {
      id: "t12_2", name: "Vectơ và hệ tọa độ trong không gian",
      lessons: [
        { id: "l12_2_1", name: "Vectơ trong không gian" },
        { id: "l12_2_2", name: "Biểu thức tọa độ của vectơ" },
        { id: "l12_2_3", name: "Hệ tọa độ Oxyz" }
      ]
    },
    {
      id: "t12_3", name: "Các số đặc trưng đo mức độ phân tán",
      lessons: [
        { id: "l12_3_1", name: "Khoảng biến thiên" },
        { id: "l12_3_2", name: "Khoảng tứ phân vị" },
        { id: "l12_3_3", name: "Phương sai" },
        { id: "l12_3_4", name: "Độ lệch chuẩn" }
      ]
    },
    {
      id: "t12_4", name: "Nguyên hàm và tích phân",
      lessons: [
        { id: "l12_4_1", name: "Nguyên hàm" },
        { id: "l12_4_2", name: "Tích phân" },
        { id: "l12_4_3", name: "Ứng dụng của tích phân" }
      ]
    },
    {
      id: "t12_5", name: "Phương pháp tọa độ trong không gian",
      lessons: [
        { id: "l12_5_1", name: "Phương trình mặt phẳng" },
        { id: "l12_5_2", name: "Phương trình đường thẳng" },
        { id: "l12_5_3", name: "Phương trình mặt cầu" }
      ]
    },
    {
      id: "t12_6", name: "Xác suất có điều kiện",
      lessons: [
        { id: "l12_6_1", name: "Xác suất có điều kiện" },
        { id: "l12_6_2", name: "Công thức nhân xác suất" },
        { id: "l12_6_3", name: "Công thức xác suất toàn phần" },
        { id: "l12_6_4", name: "Công thức Bayes" }
      ]
    }
  ]
};`;

const newCode = code.replace(/\/\/\s*Shared Curriculum Data[\s\S]*?\};/, newCurriculum);

fs.writeFileSync('src/pages/Roadmap.tsx', newCode);
console.log('done');
