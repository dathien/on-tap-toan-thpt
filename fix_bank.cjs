const fs = require('fs');
let code = fs.readFileSync('src/pages/Bank.tsx', 'utf8');

code = code.replace(
  "return (\n    <div",
  "return (\n    <>\n    <div"
);

fs.writeFileSync('src/pages/Bank.tsx', code);
