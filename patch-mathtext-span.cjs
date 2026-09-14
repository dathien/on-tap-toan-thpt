const fs = require('fs');

let content = fs.readFileSync('src/components/MathText.tsx', 'utf-8');

content = content.replace(
  '<div \n      ref={containerRef} \n      className={`max-w-none leading-relaxed ${className}`}\n      dangerouslySetInnerHTML={{ __html: cleanText }}\n    />',
  '<span \n      ref={containerRef} \n      className={`inline-block whitespace-nowrap leading-relaxed ${className}`}\n      dangerouslySetInnerHTML={{ __html: cleanText }}\n    />'
);

fs.writeFileSync('src/components/MathText.tsx', content);
