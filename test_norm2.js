function normalizeMathExpression(value) {
  if (value === undefined || value === null) return "";
  let v = String(value).trim();
  v = v.replace(/∞/g, "\\\\infty");
  v = v.replace(/±/g, "\\\\pm");
  v = v.replace(/⇔/g, "\\\\Leftrightarrow");
  
  v = v.replace(/(^|[^\\\\])\\binfty\\b/g, "$1\\\\infty");
  return v;
}
console.log(normalizeMathExpression("D = \\mathbb{R}"));
console.log(normalizeMathExpression("\\infty"));
console.log(normalizeMathExpression("∞"));
console.log(normalizeMathExpression("(-\\infty; -1)"));
