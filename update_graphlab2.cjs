const fs = require('fs');

let content = fs.readFileSync('src/pages/labs/FunctionGraphLab.tsx', 'utf8');

const graphTitle = `<div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-indigo-900 font-medium z-10 pointer-events-none">
          <MathRenderer value={\`f(x) = \${formatLatex(expr)}\`} displayMode={false} />
        </div>`;

// Remove the invalid div from SVG
content = content.replace(/<div className="absolute top-4 left-4[\s\S]*?<\/div>\n          \{\/\* Grid \*\/\}/, "{/* Grid */}");

// Put it inside the relative wrapper, before or after the svg
content = content.replace(
  /<svg \s*ref=\{svgRef\}/,
  `${graphTitle}\n        <svg \n          ref={svgRef}`
);

fs.writeFileSync('src/pages/labs/FunctionGraphLab.tsx', content);
