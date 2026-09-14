const fs = require('fs');
let code = fs.readFileSync('src/components/MathText.tsx', 'utf8');

// Replace whitespace-nowrap with whitespace-pre-wrap or something, 
// actually the user wants white-space: normal; overflow-wrap: anywhere; 
code = code.replace(
  /\`inline-block whitespace-nowrap leading-relaxed \$\{className\}\`/,
  "\`math-content leading-relaxed ${className}\`"
);

fs.writeFileSync('src/components/MathText.tsx', code);
console.log('done');
