function safeNormalize(value) {
  if (value === undefined || value === null) return "";
  let v = String(value);

  // Fix minus sign
  v = v.replace(/−/g, "-");

  // Replace standalone inf/infty symbols that are missing slashes
  v = v.replace(/(^|[^a-zA-Z\\])\b(infty|inf)\b/g, "$1\\infty");
  v = v.replace(/∞/g, "\\infty");

  // Fix cases where a minus/plus is followed by infty with possible spaces
  v = v.replace(/-\s*\\infty/g, "-\\infty");
  v = v.replace(/\+\s*\\infty/g, "+\\infty");

  return v;
}

console.log(safeNormalize("Tìm x tiến tới infty của hàm số")); // Tìm x tiến tới \infty của hàm số
console.log(safeNormalize("-\\infty")); // -\infty
console.log(safeNormalize("-infty")); // -\infty
console.log(safeNormalize("+\\infty")); // +\infty
console.log(safeNormalize("$-\\infty$")); // $-\infty
console.log(safeNormalize("$infty$")); // $\infty
console.log(safeNormalize("12infty")); // 12\infty (wait, 12 is not matched by \b? wait, \b matches between 2 and i)
