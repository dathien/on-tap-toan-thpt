const parseIntervals = (text) => {
    const matchDongBien = text.match(/(?:đồng biến|tăng).*?(?:trên|trong).*?khoảng\s*\$\(([^;]+);\s*([^)]+)\)\$/i);
    const matchNghichBien = text.match(/(?:nghịch biến|giảm).*?(?:trên|trong).*?khoảng\s*\$\(([^;]+);\s*([^)]+)\)\$/i);
    const matchCucDai = text.match(/(?:cực đại|giá trị lớn nhất).*?(?:tại|khi)\s*\$x\s*=\s*([^$]+)\$/i);
    const matchCucTieu = text.match(/(?:cực tiểu|giá trị nhỏ nhất).*?(?:tại|khi)\s*\$x\s*=\s*([^$]+)\$/i);
    
    console.log({ matchDongBien, matchNghichBien, matchCucDai, matchCucTieu });
}
parseIntervals("Hàm số đồng biến trên khoảng $(0; 2)$");
parseIntervals("Hàm số nghịch biến trên khoảng $(0; 1)$");
parseIntervals("Hàm số đạt cực đại tại $x = 2$");
parseIntervals("Hàm số đạt cực tiểu tại $x = 0$");
