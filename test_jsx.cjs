const parser = require('@babel/parser');
const code = `<MathText text="D = \\mathbb{R}" />`;
const ast = parser.parse(code, { plugins: ['jsx'] });
console.log(ast.program.body[0].expression.openingElement.attributes[0].value.value);
