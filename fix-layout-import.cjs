const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

code = code.replace("import { \n  LayoutDashboard,\n  Gem,", "import { \n  LayoutDashboard,\n  Gem,");
if (!code.includes("Gem,")) {
   code = code.replace("import {", "import { Gem,");
}

fs.writeFileSync('src/components/Layout.tsx', code);
console.log('done');
