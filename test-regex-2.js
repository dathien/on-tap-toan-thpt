const parseIntervals = (text) => {
    const matchDongBien = text.match(/(?:đồng biến|tăng).*?(?:trên|trong).*?khoảng\s*(?:\$|)\(\s*([^;]+?)\s*;\s*([^)]+?)\s*\)(?:\$|)/i);
    const matchNghichBien = text.match(/(?:nghịch biến|giảm).*?(?:trên|trong).*?khoảng\s*(?:\$|)\(\s*([^;]+?)\s*;\s*([^)]+?)\s*\)(?:\$|)/i);
    
    console.log({ matchDongBien, matchNghichBien });
}
parseIntervals("Hàm số đồng biến trên khoảng $(0; 2)$");
parseIntervals("Hàm số nghịch biến trên khoảng $(0; 1)$");
