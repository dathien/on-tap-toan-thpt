const fs = require('fs');

const catalog = `export const LAB_CATALOG: LabMeta[] = [
  { id: 'logic', name: 'Bảng giá trị chân lý', description: 'Mệnh đề logic (AND, OR, NOT)', icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-50', lessonIds: ['l10_1'] },
  { id: 'sets', name: 'Tập hợp', description: 'Biểu đồ Venn', icon: PieChart, color: 'text-rose-600', bg: 'bg-rose-50', lessonIds: ['l10_2'] },
  { id: 'set-operations', name: 'Các phép toán trên tập hợp', description: 'Giao, Hợp, Hiệu tập hợp', icon: Layers, color: 'text-orange-600', bg: 'bg-orange-50', lessonIds: ['l10_3'] },
  { id: 'inequality-2d', name: 'Bất phương trình 2D', description: 'Miền nghiệm trên mặt phẳng tọa độ', icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50', lessonIds: ['l10_4'] },
  { id: 'inequality-system-2d', name: 'Hệ bất phương trình 2D', description: 'Miền nghiệm hệ bất phương trình', icon: Grid3X3, color: 'text-cyan-600', bg: 'bg-cyan-50', lessonIds: ['l10_5'] },
  { id: 'function-graph', name: 'Đồ thị hàm số', description: 'Vẽ và khảo sát đồ thị hàm số', icon: LineChart, color: 'text-indigo-600', bg: 'bg-indigo-50', lessonIds: ['l10_6', 'l17'] },
  { id: 'parabola', name: 'Hàm số bậc hai (Parabol)', description: 'Khảo sát y = ax² + bx + c', icon: Maximize2, color: 'text-sky-600', bg: 'bg-sky-50', lessonIds: ['l10_7', 'l10_8'] },
  { id: 'trig-circle', name: 'Đường tròn Lượng giác', description: 'Trực quan hóa Sin, Cos, Tan', icon: Circle, color: 'text-emerald-600', bg: 'bg-emerald-50', lessonIds: ['l10_9', 'l6'] },
  { id: 'triangle-solver', name: 'Giải Tam Giác', description: 'Định lí Cosin, Định lí Sin, Diện tích', icon: Triangle, color: 'text-sky-600', bg: 'bg-sky-50', lessonIds: ['l10_10', 'l10_11'] },
  { id: 'vector-oxy', name: 'Vector mặt phẳng (Oxy)', description: 'Tổng, hiệu, tích vô hướng, góc', icon: Move, color: 'text-indigo-600', bg: 'bg-indigo-50', lessonIds: ['l10_12', 'l10_13', 'l10_14', 'l10_15'] },
  { id: 'statistics', name: 'Thống kê', description: 'Số trung bình, trung vị, phương sai, độ lệch chuẩn', icon: BarChart3, color: 'text-teal-600', bg: 'bg-teal-50', lessonIds: ['l10_16', 'l10_17', 'l10_18'] },
  { id: 'probability', name: 'Xác suất thực nghiệm', description: 'Định luật số lớn, mô phỏng tung đồng xu/xúc xắc', icon: Dices, color: 'text-violet-600', bg: 'bg-violet-50', lessonIds: ['l10_19', 'l10_20', 'l6', 'l8'] },
  { id: 'limit', name: 'Giới hạn hàm số', description: 'Trực quan hóa giới hạn trái/phải', icon: ArrowRightToLine, color: 'text-rose-600', bg: 'bg-rose-50', lessonIds: ['l11', 'l12'] },
  { id: 'trig-graph', name: 'Đồ thị Hàm số Lượng giác', description: 'Biến đổi sin, cos, tan, cot', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', lessonIds: ['l8'] },
  { id: 'sequence', name: 'Dãy số (CSC/CSN)', description: 'Khảo sát sự tăng trưởng, công thức tổng quát', icon: AlignEndHorizontal, color: 'text-amber-600', bg: 'bg-amber-50', lessonIds: ['l11', 'l12'] },
  { id: 'function-analysis', name: 'Khảo sát hàm số', description: 'Sự biến thiên, cực trị, tiệm cận', icon: Target, color: 'text-cyan-600', bg: 'bg-cyan-50', lessonIds: ['l13', 'l14', 'l16', 'l17'] },
  { id: 'derivative', name: 'Đạo hàm', description: 'Ý nghĩa hình học của đạo hàm, tiếp tuyến', icon: Maximize, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'integral', name: 'Tích phân', description: 'Tính tích phân và diện tích hình phẳng', icon: Shapes, color: 'text-amber-600', bg: 'bg-amber-50', lessonIds: ['l24', 'l25'] },
  { id: 'vector', name: 'Vector', description: 'Các phép toán vector trong Oxy và Oxyz', icon: Triangle, color: 'text-purple-600', bg: 'bg-purple-50', lessonIds: ['l19'] },
  { id: 'oxyz', name: 'Oxyz', description: 'Hệ tọa độ trong không gian', icon: Axis3D, color: 'text-pink-600', bg: 'bg-pink-50', lessonIds: ['l18'] },
];`;

let content = fs.readFileSync('src/pages/MathLab.tsx', 'utf8');

const startIdx = content.indexOf('export const LAB_CATALOG: LabMeta[] = [');
const endIdx = content.indexOf('];', startIdx) + 2;

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + catalog + content.substring(endIdx);
  fs.writeFileSync('src/pages/MathLab.tsx', content);
} else {
  console.error("Could not find LAB_CATALOG");
}
