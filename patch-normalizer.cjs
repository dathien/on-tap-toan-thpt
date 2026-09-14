const fs = require('fs');
let content = fs.readFileSync('src/utils/mathNormalizer.ts', 'utf-8');

content = `
export function normalizeMathToken(value: string | undefined | null): string {
  if (value === undefined || value === null) return "";
  let raw = String(value).trim();
  
  // Clean up newlines and spaces for infinity checks
  const noSpace = raw.replace(/\\s+/g, "").replace(/−/g, "-");
  
  if (noSpace === "-infty" || noSpace === "-inf" || noSpace === "-∞" || noSpace === "-\\\\infty") {
    return "-\\\\infty";
  }
  
  if (noSpace === "+infty" || noSpace === "+inf" || noSpace === "+∞" || noSpace === "+\\\\infty") {
    return "+\\\\infty";
  }
  
  if (noSpace === "infty" || noSpace === "inf" || noSpace === "∞" || noSpace === "\\\\infty") {
    return "\\\\infty";
  }
  
  // General cleanup
  let v = raw;
  v = v.replace(/-\\s*infty/g, "-\\\\infty");
  v = v.replace(/\\+\\s*infty/g, "+\\\\infty");
  v = v.replace(/-\\s*inf\\b/g, "-\\\\infty");
  v = v.replace(/\\+\\s*inf\\b/g, "+\\\\infty");
  v = v.replace(/-\\s*∞/g, "-\\\\infty");
  v = v.replace(/\\+\\s*∞/g, "+\\\\infty");
  v = v.replace(/\\binfty\\b/g, "\\\\infty");
  v = v.replace(/\\binf\\b/g, "\\\\infty");
  v = v.replace(/∞/g, "\\\\infty");

  return v;
}
`;

fs.writeFileSync('src/utils/mathNormalizer.ts', content);
