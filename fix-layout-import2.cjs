const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

code = code.replace("LayoutDashboard,", "LayoutDashboard, Gem,");
fs.writeFileSync('src/components/Layout.tsx', code);
console.log('done');
