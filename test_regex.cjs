const s = "Câu 1. Hàm số nào sau đây đồng biến trên R?\nA. y = x\nB. y = x^2\nĐáp án: B";
const questionRegex = /^Câu\s+(\d+)[\.\:]\s*(.*)/i;
const lines = s.split('\n');
console.log(lines[0].match(questionRegex));
