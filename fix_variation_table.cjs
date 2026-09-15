const fs = require('fs');
let content = fs.readFileSync('src/components/visuals/VariationTable.tsx', 'utf-8');

// Replace all remaining MathText in VariationTable with MathRenderer
content = content.replace(/<MathText className="math-token" text=\{"\\\$" \+ ([a-zA-Z0-9_]+) \+ "\\\$"\} \/>/g, '<MathRenderer className="math-token" value={$1} />');
content = content.replace(/<MathText className="math-token" text=\{"\\\$" \+ textValue \+ "\\\$"\} \/>/g, '<MathRenderer className="math-token" value={textValue} />');

// More generic replacement:
content = content.replace(/<MathText/g, '<MathRenderer');
content = content.replace(/text=\{"\\\$" \+ ([^ ]+) \+ "\\\$"\}/g, 'value={$1}');

fs.writeFileSync('src/components/visuals/VariationTable.tsx', content);
