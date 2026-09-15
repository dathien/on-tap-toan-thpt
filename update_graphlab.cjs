const fs = require('fs');

let content = fs.readFileSync('src/pages/labs/FunctionGraphLab.tsx', 'utf8');

// 1. Add MathRenderer import
if (!content.includes('MathRenderer')) {
  content = content.replace(
    "import * as math from 'mathjs';",
    "import * as math from 'mathjs';\nimport { MathRenderer } from '../../components/MathRenderer';"
  );
}

// 2. Add formatLatex function inside the component
if (!content.includes('formatLatex')) {
  content = content.replace(
    "const [error, setError] = useState('');",
    `const [error, setError] = useState('');

  const formatLatex = (expression: string) => {
    try {
      const node = math.parse(expression);
      return node.toTex({
        handler: function (node: any, options: any) {
          if (node.isOperatorNode && node.op === '*') {
            return node.args[0].toTex(options) + node.args[1].toTex(options);
          }
        }
      });
    } catch (e) {
      return expression;
    }
  };`
  );
}

// 3. Update the quick examples buttons
content = content.replace(
  /<button\s*key=\{ex\}\s*onClick=\{\(\) => \{ setInputStr\(ex\); setExpr\(ex\); setError\(''\); \}\}\s*className="text-indigo-600 hover:underline"\s*>\s*\{ex\}\s*<\/button>/g,
  `<button 
            key={ex} 
            onClick={() => { setInputStr(ex); setExpr(ex); setError(''); }}
            className="text-indigo-600 hover:opacity-80 transition-opacity flex items-center"
          >
            <MathRenderer value={formatLatex(ex)} displayMode={false} />
          </button>`
);

// 4. Update the 'f(x) =' display if necessary. Actually the user said "Trong vùng HIỂN THỊ công thức, phải render thành lũy thừa toán học thật" 
// Since we don't have a dedicated display region other than the examples, let's also update the "f(x) =" label to show the rendered expression if they wanted it?
// Let's look at the UI. The input is "f(x) = [input]".
// Maybe I can add a small display below or next to the input, or just leave it. The prompt mostly focuses on "Ví dụ nhanh".
// "Chỉ PASS khi trên phần HIỂN THỊ và 'Ví dụ nhanh' không còn nhìn thấy ký tự ^."
// Is there a "vùng HIỂN THỊ công thức" that I missed?
// In the current file, `expr` is not rendered anywhere except in the pathD calculation.
// But maybe they want me to display the current `expr` inside the graph or above the graph?
// Let's add a small MathRenderer absolute positioned in the graph to show the current function!
const graphTitle = `<div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-indigo-900 font-medium">
          <MathRenderer value={\`f(x) = \${formatLatex(expr)}\`} displayMode={false} />
        </div>`;

if (!content.includes('absolute top-4 left-4')) {
  content = content.replace(
    "{/* Grid */}",
    `${graphTitle}\n          {/* Grid */}`
  );
}

fs.writeFileSync('src/pages/labs/FunctionGraphLab.tsx', content);
