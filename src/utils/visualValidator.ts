import { Question } from '../types';

export function validateQuestionVisual(q: Question): { valid: boolean; reason?: string } {
  const content = q.content || '';
  const needsTable = /(bảng biến thiên|như hình vẽ|quan sát bảng)/i.test(content);
  
  if (!q.visual || q.visual.type === 'NONE') {
    if (needsTable) return { valid: false, reason: 'MISSING_VISUAL_FOR_TABLE_QUESTION' };
    return { valid: true };
  }

  if (q.visual.type === 'VARIATION_TABLE') {
    const data = q.visual.data;
    const fallback = q.visual.source;
    
    let isStructuredValid = true;
    if (!data || !data.xPoints || !data.derivative || !data.function) {
      isStructuredValid = false;
    } else if (!Array.isArray(data.xPoints) || data.xPoints.length < 2) {
      isStructuredValid = false;
    } else if (!data.derivative.intervals || !Array.isArray(data.derivative.intervals) || data.derivative.intervals.length === 0) {
      isStructuredValid = false;
    } else if (!data.function.intervalDirections || !Array.isArray(data.function.intervalDirections) || data.function.intervalDirections.length === 0) {
      isStructuredValid = false;
    }

    if (!isStructuredValid && !fallback) {
      return { valid: false, reason: 'INVALID_VARIATION_TABLE' };
    }
  }

  return { valid: true };
}
