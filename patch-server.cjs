const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const oldRegex = /"data":\s*\{\}\s*\/\/\s*Nếu\s*là\s*VARIATION_TABLE\s*\(JSON\s*mô\s*tả\s*x,\s*y',\s*y\)/g;
const newPromptStr = `"data": {} // Nếu là VARIATION_TABLE (JSON mô tả xPoints, derivative, function)`;

content = content.replace(oldRegex, newPromptStr);

const detailOldRegex = /Nếu có bảng biến thiên dạng text trong XML, hãy chuyển nó thành "type": "VARIATION_TABLE" và điền dữ liệu vào "data" theo dạng cấu trúc mảng./g;
const detailNewPromptStr = `Nếu có bảng biến thiên, dùng "type": "VARIATION_TABLE" và điền dữ liệu vào "data" theo cấu trúc:\n{ "xPoints": [{ "type": "infinity" | "critical" | "discontinuity", "value": "-\\infty" }], "derivative": { "intervals": ["+", "-"], "criticalValues": ["0"] }, "function": { "intervalDirections": ["up", "down"], "pointValues": [{ "x": "0", "y": "1", "type": "local_max" | "local_min" | "inflection" | "left_limit" | "right_limit" }], "leftLimit": "-\\infty", "rightLimit": "-\\infty" } }`;

content = content.replace(detailOldRegex, detailNewPromptStr);
fs.writeFileSync('server.ts', content);
console.log("Patched server.ts successfully");
