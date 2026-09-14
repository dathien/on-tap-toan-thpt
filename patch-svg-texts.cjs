const fs = require('fs');

// Geometry.tsx
let geo = fs.readFileSync('src/components/visuals/Geometry.tsx', 'utf-8');
if (!geo.includes('normalizeMathToken')) {
  geo = geo.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { normalizeMathToken } from '../../utils/mathNormalizer';\nimport { sanitizeStudentContent } from '../../utils/studentSanitizer';"
  );
  
  geo = geo.replace(
    /\{t\.content\}/g,
    "{sanitizeStudentContent(normalizeMathToken(t.content))}"
  );
  fs.writeFileSync('src/components/visuals/Geometry.tsx', geo);
}

// FunctionGraph.tsx
let fg = fs.readFileSync('src/components/visuals/FunctionGraph.tsx', 'utf-8');
if (!fg.includes('normalizeMathToken')) {
  fg = fg.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { normalizeMathToken } from '../../utils/mathNormalizer';\nimport { sanitizeStudentContent } from '../../utils/studentSanitizer';"
  );
  
  fg = fg.replace(
    /\{pt\.labelX\}/g,
    "{sanitizeStudentContent(normalizeMathToken(pt.labelX))}"
  );
  fg = fg.replace(
    /\{pt\.labelY\}/g,
    "{sanitizeStudentContent(normalizeMathToken(pt.labelY))}"
  );
  fg = fg.replace(
    /\{lbl\.text\}/g,
    "{sanitizeStudentContent(normalizeMathToken(lbl.text))}"
  );
  
  fs.writeFileSync('src/components/visuals/FunctionGraph.tsx', fg);
}
