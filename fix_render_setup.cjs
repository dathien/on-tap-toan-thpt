const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

code = code.replace(/if \(!session \|\| session\.status === 'SETUP'\) \{/g, 
  "if (view === 'HOME') {\n    return renderHome();\n  }\n\n  if (view === 'SETUP') {");

fs.writeFileSync('src/pages/Roadmap.tsx', code);
