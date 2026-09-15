const fs = require('fs');

const path = 'src/pages/TreasureHunt.tsx';
let content = fs.readFileSync(path, 'utf8');

// Inside TreasureHunt:
// Add dynamic boss name
const findReplace = `  const getTitle = () => {`;
const dynamicLevels = `
  const dynamicLevels = useMemo(() => {
    let bossName = 'Trùm cuối';
    if (cfgGrade === 10) {
       if (cfgTopic === 'c5') bossName = 'Người Gác Cổng Vectơ';
       else if (cfgTopic === 'c3') bossName = 'Kẻ Thống Trị Parabol';
    } else if (cfgGrade === 11) {
       if (cfgTopic === 'c11_limit') bossName = 'Kẻ Canh Giữ Vô Cực';
       else if (cfgTopic === 'c11_deriv') bossName = 'Bậc Thầy Biến Thiên';
    } else if (cfgGrade === 12) {
       if (cfgTopic === 'c5') bossName = 'Chúa Tể Hàm Số';
       else if (cfgTopic === 'c6') bossName = 'Hắc Kị Sĩ Oxyz';
    }
    
    return [
      { id: 1, name: 'Khởi hành', icon: Compass, desc: 'Khởi động nhẹ để lấy nhịp!' },
      { id: 2, name: 'Giải mã', icon: Search, desc: 'Đọc dữ kiện – tìm chìa khóa.' },
      { id: 3, name: 'Tăng tốc', icon: Zap, desc: 'Tăng tốc! Vận dụng kiến thức để tiến lên.' },
      { id: 4, name: 'Chinh phục', icon: Trophy, desc: 'Chỉ còn một chặng trước Trùm cuối!' },
      { id: 5, name: bossName, icon: Crown, desc: 'Chỉ còn một chặng nữa để mở Kho báu tri thức.' }
    ];
  }, [cfgGrade, cfgTopic]);
  
  const getTitle = () => {`;

content = content.replace(findReplace, dynamicLevels);
content = content.replace(/LEVELS/g, 'dynamicLevels');

fs.writeFileSync(path, content);
