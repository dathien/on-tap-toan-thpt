export function normalizeMathToken(value: string | undefined | null): string {
  if (value === undefined || value === null) return "";
  let v = String(value);

  // If the ENTIRE string is just a math token (common in VariationTable)
  const noSpace = v.trim().replace(/\s+/g, "").replace(/−/g, "-");
  
  const map: Record<string, string> = {
    "infty": "\\infty",
    "inf": "\\infty",
    "∞": "\\infty",
    "\\infty": "\\infty",

    "+infty": "+\\infty",
    "+inf": "+\\infty",
    "+∞": "+\\infty",
    "+\\infty": "+\\infty",

    "-infty": "-\\infty",
    "-inf": "-\\infty",
    "-∞": "-\\infty",
    "-\\infty": "-\\infty"
  };

  // If it's exactly one of those tokens, return the exact replacement!
  if (map[noSpace]) {
    return map[noSpace];
  }

  // Otherwise, it might be a full sentence or a wrapped "$...$" expression.
  // We should NOT strip spaces. We'll just do safe word replacements.
  v = v.replace(/−/g, "-");
  
  // Replace missing backslash infty with sign
  v = v.replace(/-\s*infty\b/g, "-\\infty");
  v = v.replace(/\+\s*infty\b/g, "+\\infty");
  v = v.replace(/-\s*inf\b/g, "-\\infty");
  v = v.replace(/\+\s*inf\b/g, "+\\infty");
  v = v.replace(/-\s*∞/g, "-\\infty");
  v = v.replace(/\+\s*∞/g, "+\\infty");
  
  // Then replace standalone infty missing backslash
  v = v.replace(/(^|[^\\])\binfty\b/g, "$1\\infty");
  v = v.replace(/(^|[^\\])\binf\b/g, "$1\\infty");
  v = v.replace(/∞/g, "\\infty");

  return v;
}

export function normalizeMathValue(value: string | undefined | null): string {
  return normalizeMathToken(value);
}
