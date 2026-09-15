const fs = require('fs');

const path = 'src/pages/TreasureHunt.tsx';
let content = fs.readFileSync(path, 'utf8');

const topLevels = `const dynamicLevels = [
  { id: 1, name: 'Khởi hành', icon: Compass, desc: 'Khởi động nhẹ để lấy nhịp!' },
  { id: 2, name: 'Giải mã', icon: Search, desc: 'Đọc dữ kiện – tìm chìa khóa.' },
  { id: 3, name: 'Tăng tốc', icon: Zap, desc: 'Tăng tốc! Vận dụng kiến thức để tiến lên.' },
  { id: 4, name: 'Chinh phục', icon: Trophy, desc: 'Chỉ còn một chặng trước Trùm cuối!' },
  { id: 5, name: 'Trùm cuối', icon: Crown, desc: 'Chỉ còn một chặng nữa để mở Kho báu tri thức.' },
];`;

content = content.replace(topLevels, '');
fs.writeFileSync(path, content);
