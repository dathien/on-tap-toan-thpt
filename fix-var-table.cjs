const fs = require('fs');
let content = fs.readFileSync('src/components/visuals/VariationTable.tsx', 'utf-8');

// Update to handle derivative.pointValues
let updated = content.replace(
  /const cVal = pt\?\.type === 'critical' \? safeText\(derivative\.criticalValues\?\.\[criticalCounter\+\+\]\) : "";/g,
  `const dpVal = derivative.pointValues?.find((p: any) => p.x === pt.value);
                 const cVal = dpVal ? safeText(dpVal.value) : (pt?.type === 'critical' ? safeText(derivative.criticalValues?.[criticalCounter++]) : "");`
);

fs.writeFileSync('src/components/visuals/VariationTable.tsx', updated);
