const fs = require('fs');
let content = fs.readFileSync('src/components/visuals/Geometry.tsx', 'utf-8');
content = "import { FunctionGraph } from './FunctionGraph';\n" + content;
fs.writeFileSync('src/components/visuals/Geometry.tsx', content);
