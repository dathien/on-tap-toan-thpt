const fs = require('fs');
let content = fs.readFileSync('src/components/visuals/VariationTable.tsx', 'utf-8');

// replace <MathText text={`$${safeText(xPoints[pointIndex]?.value)}$`} />
// with {safeText(xPoints[pointIndex]?.value) ? <MathText text={`$${safeText(xPoints[pointIndex]?.value)}$`} /> : null}
content = content.replace(/<MathText text=\{\`\$\$\{safeText\(xPoints\[pointIndex\]\?\.value\)\}\$\`\} \/>/g, 
  "{safeText(xPoints[pointIndex]?.value) ? <MathText text={`$${safeText(xPoints[pointIndex]?.value)}$`} /> : null}");

content = content.replace(/<MathText text=\{\`\$\$\{cVal\}\$\`\} \/>/g, 
  "{cVal ? <MathText text={`$${cVal}$`} /> : null}");

content = content.replace(/<MathText text=\{\`\$\$\{intervalVal\}\$\`\} \/>/g, 
  "{intervalVal ? <MathText text={`$${intervalVal}$`} /> : null}");

content = content.replace(/<MathText text=\{\`\$\$\{safeText\(leftLimObj\.y\)\}\$\`\} \/>/g, 
  "{safeText(leftLimObj.y) ? <MathText text={`$${safeText(leftLimObj.y)}$`} /> : null}");

content = content.replace(/<MathText text=\{\`\$\$\{safeText\(rightLimObj\.y\)\}\$\`\} \/>/g, 
  "{safeText(rightLimObj.y) ? <MathText text={`$${safeText(rightLimObj.y)}$`} /> : null}");

content = content.replace(/<MathText text=\{\`\$\$\{yVal\}\$\`\} \/>/g, 
  "{yVal ? <MathText text={`$${yVal}$`} /> : null}");

fs.writeFileSync('src/components/visuals/VariationTable.tsx', content);
console.log("Patched VariationTable for empty values");
