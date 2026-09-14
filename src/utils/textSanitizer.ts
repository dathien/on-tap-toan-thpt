export function sanitizeQuestionText(text: string): string {
  if (!text) return text;
  return text.replace(/\s*\(Câu điền thêm \d+\)\s*/g, '')
             .replace(/\s*\(Câu demo \d+\)\s*/g, '')
             .replace(/\s*\(Generated \d+\)\s*/g, '')
             .replace(/\s*\(Fallback \d+\)\s*/g, '')
             .replace(/\s*\(Placeholder \d+\)\s*/g, '');
}

export function isDuplicateQuestion(q1: any, q2: any): boolean {
  if (!q1 || !q2) return false;
  if (q1.question_type !== q2.question_type) return false;
  
  const t1 = sanitizeQuestionText(q1.content || '').trim().toLowerCase();
  const t2 = sanitizeQuestionText(q2.content || '').trim().toLowerCase();
  
  if (t1 !== t2) return false;
  
  // Also compare options or answers to be safe, but matching text is usually enough
  return true;
}
