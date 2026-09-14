export function sanitizeStudentContent(text: string | undefined | null): string {
  if (!text) return "";
  let v = String(text);
  
  const badStrings = [
    /undefined/gi,
    /null/gi,
    /NaN/gi,
    /debug/gi,
    /placeholder/gi,
    /fallback/gi,
    /Câu điền thêm/gi,
    /bị lỗi chứa ảnh/gi,
    /còn lại đúng ảnh/gi,
    /infty là vô cực đó/gi
  ];
  
  for (const regex of badStrings) {
    v = v.replace(regex, "");
  }
  return v;
}
