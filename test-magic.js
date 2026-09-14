const fs = require('fs');

function normalizeMathToken(value) {
  if (value === undefined || value === null) return "";
  let v = String(value);

  const noSpace = v.trim().replace(/\s+/g, "").replace(/−/g, "-");
  const map = {
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

  if (map[noSpace]) {
    return map[noSpace];
  }

  v = v.replace(/−/g, "-");
  v = v.replace(/-\s*infty\b/g, "-\\infty");
  v = v.replace(/\+\s*infty\b/g, "+\\infty");
  v = v.replace(/-\s*inf\b/g, "-\\infty");
  v = v.replace(/\+\s*inf\b/g, "+\\infty");
  v = v.replace(/-\s*∞/g, "-\\infty");
  v = v.replace(/\+\s*∞/g, "+\\infty");
  v = v.replace(/(^|[^\\])\binfty\b/g, "$1\\infty");
  v = v.replace(/(^|[^\\])\binf\b/g, "$1\\infty");
  v = v.replace(/∞/g, "\\infty");

  return v;
}

console.log(normalizeMathToken("$infty$"));
console.log(normalizeMathToken("$-infty$"));
