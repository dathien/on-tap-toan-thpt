export function normalizeMathExpression(value: string | undefined | null): string {
  if (value === undefined || value === null) return "";
  let v = String(value).trim();
  
  // Replace missing backslashes or unicode math symbols
  v = v.replace(/∞/g, "\\infty");
  v = v.replace(/±/g, "\\pm");
  v = v.replace(/⇔/g, "\\Leftrightarrow{}");
  v = v.replace(/⇒/g, "\\Rightarrow{}");
  v = v.replace(/≥/g, "\\ge{}");
  v = v.replace(/≤/g, "\\le{}");
  v = v.replace(/≠/g, "\\neq{}");
  v = v.replace(/−/g, "-");
  
  // Normalize missing backslashes for common commands if they are isolated
  v = v.replace(/(^|[^\\])\binfty\b/g, "$1\\infty");
  v = v.replace(/(^|[^\\])\binf\b/g, "$1\\infty");
  v = v.replace(/(^|[^\\])\blim\b/g, "$1\\lim");
  v = v.replace(/(^|[^\\])\bsin\b/g, "$1\\sin");
  v = v.replace(/(^|[^\\])\bcos\b/g, "$1\\cos");
  v = v.replace(/(^|[^\\])\btan\b/g, "$1\\tan");
  
  
  // Ensure commands that were already in the source string have a boundary before word characters
  const COMMANDS_REQUIRING_BOUNDARY = [
    "Leftrightarrow",
    "Rightarrow",
    "Leftarrow",
    "rightarrow",
    "leftarrow",
    "infty",
    "cdot",
    "times",
    "le",
    "leq",
    "ge",
    "geq",
    "neq",
    "in",
    "notin",
    "to",
    "mathbb",
    "mathrm"
  ];
  COMMANDS_REQUIRING_BOUNDARY.forEach(cmd => {
    const regex = new RegExp(`(\\\\${cmd})([a-zA-Z0-9])`, 'g');
    v = v.replace(regex, "$1{}$2");
  });
  
  // Clean up trailing artifacts like specific question 9 issue
  v = v.replace(/y_CT=0\)$/, "y_{CT}=0)"); // Just in case
  
  return v;

}

export function normalizeMathToken(value: string | undefined | null): string {
  return normalizeMathExpression(value);
}
export function normalizeMathValue(value: string | undefined | null): string {
  return normalizeMathExpression(value);
}
