const fs = require('fs');

let content = fs.readFileSync('src/components/visuals/VariationTable.tsx', 'utf-8');

// Add variation-table classes
content = content.replace(
  'className="w-full overflow-x-auto my-4 pb-2 flex justify-center"',
  'className="variation-table-wrapper w-full overflow-x-auto my-4 pb-2 flex justify-center"'
);

content = content.replace(
  'className="min-w-[400px] border-2 border-slate-800 bg-white inline-block text-slate-800"',
  'className="variation-table border-2 border-slate-800 bg-white inline-block text-slate-800"'
);

// Update MathText elements to use className="math-token"
content = content.replace(/<MathText text=\{"\$" \+ textValue \+ "\$"\}/g, '<MathText className="math-token" text={"$" + textValue + "$"}');
content = content.replace(/<MathText text=\{"\$" \+ cVal \+ "\$"\}/g, '<MathText className="math-token" text={"$" + cVal + "$"}');
content = content.replace(/<MathText text=\{"\$" \+ intervalVal \+ "\$"\}/g, '<MathText className="math-token" text={"$" + intervalVal + "$"}');
content = content.replace(/<MathText text=\{"\$" \+ leftText \+ "\$"\}/g, '<MathText className="math-token" text={"$" + leftText + "$"}');
content = content.replace(/<MathText text=\{"\$" \+ rightText \+ "\$"\}/g, '<MathText className="math-token" text={"$" + rightText + "$"}');
content = content.replace(/<MathText text=\{"\$" \+ yVal \+ "\$"\}/g, '<MathText className="math-token" text={"$" + yVal + "$"}');
content = content.replace(/<MathText text="\$x\$"/g, '<MathText className="math-token" text="$x$"');
content = content.replace(/<MathText text="\$y'\$"/g, '<MathText className="math-token" text="$y\'$"');
content = content.replace(/<MathText text="\$y\$"/g, '<MathText className="math-token" text="$y$"');

fs.writeFileSync('src/components/visuals/VariationTable.tsx', content);
