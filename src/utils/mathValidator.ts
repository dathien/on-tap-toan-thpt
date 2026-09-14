import { Question, McqQuestion, TrueFalseGroupQuestion } from '../types';

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    actualCorrectAnswers?: string[];
}

const parseNum = (val: string): number => {
    if (!val) return NaN;
    const clean = val.replace(/\\/g, '').trim();
    if (clean === 'infty' || clean === '+infty') return Infinity;
    if (clean === '-infty') return -Infinity;
    return parseFloat(clean);
};

export const validateQuestionMath = (q: Question): ValidationResult => {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
    
    if (!q.content || q.content.trim() === '') {
        result.errors.push("Nội dung câu hỏi không được để trống.");
    }

    if (q.question_type === 'MCQ_SINGLE') {
        const mcq = q as McqQuestion;
        const correctOptions = mcq.options.filter(o => o.isCorrect);
        if (correctOptions.length !== 1) {
            result.errors.push(`Câu hỏi trắc nghiệm một lựa chọn phải có chính xác 1 phương án đúng (đang có ${correctOptions.length}).`);
        }
    } else if (q.question_type === 'SHORT_ANSWER') {
        const sa = q as any;
        if (!sa.correctAnswer || sa.correctAnswer.trim() === '') {
            result.errors.push("Câu hỏi trả lời ngắn phải có đáp án.");
        }
    }
    
    // We only deep validate math if it has a variation table
    if (q.visual?.type === 'VARIATION_TABLE' && q.visual.data) {
        const data = q.visual.data;
        const xPoints = data.xPoints.map((p: any) => parseNum(p.value));
        const derivativeIntervals = data.derivative?.intervals || [];
        
        const increasingIntervals: [number, number][] = [];
        const decreasingIntervals: [number, number][] = [];
        
        for (let i = 0; i < derivativeIntervals.length; i++) {
            const start = xPoints[i];
            const end = xPoints[i + 1];
            if (derivativeIntervals[i] === '+') {
                increasingIntervals.push([start, end]);
            } else if (derivativeIntervals[i] === '-') {
                decreasingIntervals.push([start, end]);
            }
        }
        
        const localMaxPoints: number[] = [];
        const localMinPoints: number[] = [];
        
        for (let i = 1; i < xPoints.length - 1; i++) {
            const prevSign = derivativeIntervals[i - 1];
            const nextSign = derivativeIntervals[i];
            if (prevSign === '+' && nextSign === '-') {
                localMaxPoints.push(xPoints[i]);
            } else if (prevSign === '-' && nextSign === '+') {
                localMinPoints.push(xPoints[i]);
            }
        }
        
        const checkStatement = (text: string): boolean | null => {
            const matchDongBien = text.match(/(?:đồng biến|tăng).*?(?:trên|trong).*?khoảng\s*(?:\$|)\(\s*([^;]+?)\s*;\s*([^)]+?)\s*\)(?:\$|)/i);
            const matchNghichBien = text.match(/(?:nghịch biến|giảm).*?(?:trên|trong).*?khoảng\s*(?:\$|)\(\s*([^;]+?)\s*;\s*([^)]+?)\s*\)(?:\$|)/i);
            const matchCucDai = text.match(/(?:cực đại|điểm cực đại).*?(?:tại|khi)\s*(?:\$|)x\s*=\s*([^$]+?)(?:\$|)/i);
            const matchCucTieu = text.match(/(?:cực tiểu|điểm cực tiểu).*?(?:tại|khi)\s*(?:\$|)x\s*=\s*([^$]+?)(?:\$|)/i);
            
            if (matchDongBien) {
                const a = parseNum(matchDongBien[1]);
                const b = parseNum(matchDongBien[2]);
                if (isNaN(a) || isNaN(b)) return null;
                // subset check
                return increasingIntervals.some(([ia, ib]) => a >= ia && b <= ib);
            }
            if (matchNghichBien) {
                const a = parseNum(matchNghichBien[1]);
                const b = parseNum(matchNghichBien[2]);
                if (isNaN(a) || isNaN(b)) return null;
                return decreasingIntervals.some(([ia, ib]) => a >= ia && b <= ib);
            }
            if (matchCucDai) {
                const x = parseNum(matchCucDai[1]);
                if (isNaN(x)) return null;
                return localMaxPoints.includes(x);
            }
            if (matchCucTieu) {
                const x = parseNum(matchCucTieu[1]);
                if (isNaN(x)) return null;
                return localMinPoints.includes(x);
            }
            
            return null; // Unknown statement type
        };

        if (q.question_type === 'MCQ_SINGLE') {
            const mcq = q as McqQuestion;
            let actualCorrectAnswers: string[] = [];
            
            mcq.options.forEach(opt => {
                const isTrue = checkStatement(opt.content);
                if (isTrue === true) {
                    actualCorrectAnswers.push(opt.id);
                    if (!opt.isCorrect) {
                        result.errors.push(`Phương án "${opt.content}" là ĐÚNG thực tế nhưng bị đánh dấu SAI.`);
                    }
                } else if (isTrue === false && opt.isCorrect) {
                    result.errors.push(`Phương án "${opt.content}" được đánh dấu ĐÚNG nhưng thực tế SAI theo dữ liệu BBT.`);
                }
            });
            
            if (actualCorrectAnswers.length > 0) {
                if (actualCorrectAnswers.length !== 1) {
                     result.errors.push(`Có ${actualCorrectAnswers.length} đáp án đúng thực sự theo phân tích Toán, trong khi MCQ cần đúng 1.`);
                }
                result.actualCorrectAnswers = actualCorrectAnswers;
            } else {
                 const anyParsed = mcq.options.some(o => checkStatement(o.content) !== null);
                 if (anyParsed && !mcq.options.some(o => o.isCorrect && checkStatement(o.content) === null)) {
                     result.errors.push(`Không có đáp án nào đúng về mặt toán học theo phân tích BBT.`);
                 }
            }
        }
    }
    
    if (result.errors.length > 0) {
        result.isValid = false;
    }
    
    return result;
};
