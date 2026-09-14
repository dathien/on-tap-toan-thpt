import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ExamVersion, Question, McqQuestion } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { isDuplicateQuestion } from '../utils/textSanitizer';
import { validateQuestionVisual } from '../utils/visualValidator';
import { getQuestions } from '../utils/questionSelector';

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function ExamPreview() {
  const { configId } = useParams<{ configId: string }>();
  const navigate = useNavigate();
  const examConfig = useAppStore((state) => state.exams.find(e => e.id === configId));
  const addExamVersion = useAppStore((state) => state.addExamVersion);
  const examVersions = useAppStore((state) => state.examVersions);
  const allQuestions = useAppStore((state) => state.questions);

  const [versionId, setVersionId] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ part: string, required: number, actual: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!examConfig) return;

    // Check if we already created a version
    const existing = examVersions.find(v => v.examConfigId === configId);
    if (existing) {
      setVersionId(existing.id);
      return;
    }

    // Generate new version based on config
    let selectedQuestions: Question[] = [];
    
    // Filter questions by config's grade, scope, and validate visual
    let rawPool = getQuestions(allQuestions, {
      gradeId: examConfig.grade,
      topicIds: examConfig.topicIds,
      lessonIds: examConfig.lessonIds,
    });
    rawPool = rawPool.filter(q => validateQuestionVisual(q).valid);
    const pool: Question[] = [];
    for (const q of rawPool) {
      if (!pool.some(existing => isDuplicateQuestion(existing, q))) {
        pool.push(q);
      }
    }

    if (examConfig.parts.includes('I')) {
      let iQ = pool.filter(q => q.question_type === 'MCQ_SINGLE');
      if (examConfig.shuffleQuestions) iQ = shuffleArray(iQ);
      const count = examConfig.partCounts?.I || (examConfig.type === 'THUONG_XUYEN' ? 10 : 12);
      
      if (iQ.length < count) {
        setErrorDetails({ part: 'I (Trắc nghiệm nhiều phương án)', required: count, actual: iQ.length });
        return;
      }
      
      let finalIQ = iQ.slice(0, count);

      if (examConfig.shuffleOptions) {
        finalIQ = finalIQ.map(q => {
          const mcq = q as McqQuestion;
          return {
            ...mcq,
            options: shuffleArray(mcq.options)
          };
        });
      }
      selectedQuestions = [...selectedQuestions, ...finalIQ];
    }

    if (examConfig.parts.includes('II')) {
      let iiQ = pool.filter(q => q.question_type === 'TRUE_FALSE_GROUP');
      if (examConfig.shuffleQuestions) iiQ = shuffleArray(iiQ);
      const count = examConfig.partCounts?.II || 4;
      if (iiQ.length < count) {
        setErrorDetails({ part: 'II (Đúng/Sai)', required: count, actual: iiQ.length });
        return;
      }
      selectedQuestions = [...selectedQuestions, ...iiQ.slice(0, count)];
    }

    if (examConfig.parts.includes('III')) {
      let iiiQ = pool.filter(q => q.question_type === 'SHORT_ANSWER');
      if (examConfig.shuffleQuestions) iiiQ = shuffleArray(iiiQ);
      const count = examConfig.partCounts?.III || 6;
      if (iiiQ.length < count) {
        setErrorDetails({ part: 'III (Trả lời ngắn)', required: count, actual: iiiQ.length });
        return;
      }
      selectedQuestions = [...selectedQuestions, ...iiiQ.slice(0, count)];
    }

    const newVersion: ExamVersion = {
      id: uuidv4(),
      examConfigId: examConfig.id,
      questions: selectedQuestions,
    };

    addExamVersion(newVersion);
    setVersionId(newVersion.id);

  }, [examConfig, configId, examVersions, addExamVersion, allQuestions]);


  const studentLink = versionId ? `${window.location.origin}/student/exam/${versionId}` : '';

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!success) {
      throw new Error("execCommand copy failed");
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleCopyLink = async () => {
    if (!studentLink) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(studentLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
      fallbackCopy(studentLink);
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      try {
        fallbackCopy(studentLink);
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
        alert("Sao chép liên kết thất bại. Bạn có thể copy thủ công link sau:\n\n" + studentLink);
      }
    }
  };

  if (!examConfig) return <div>Đề không tồn tại.</div>;
  if (errorDetails) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Không đủ câu hỏi hợp lệ</h2>
          <p className="text-slate-600 text-lg">
            Ngân hàng hiện có <strong>{errorDetails.actual} / {errorDetails.required}</strong> câu hợp lệ cho phần {errorDetails.part}.<br/>
            Cần bổ sung thêm <strong>{errorDetails.required - errorDetails.actual}</strong> câu.
          </p>
          <div className="pt-6 border-t border-slate-100 flex justify-center gap-4">
            <button 
              onClick={() => navigate('/bank')}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Bổ sung câu hỏi
            </button>
            <button 
              onClick={() => navigate('/exam/create')}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              Đổi phạm vi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!versionId) return <div>Đang tạo đề...</div>;

  

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Đã tạo đề thành công!</h2>
        <p className="text-slate-600">
          Đề thi <strong>{examConfig.name}</strong> đã sẵn sàng. Hãy gửi liên kết dưới đây cho học sinh để làm bài.
        </p>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <input 
            type="text" 
            readOnly 
            value={studentLink} 
            className="flex-1 bg-transparent outline-none text-slate-700 font-medium"
          />
          <button 
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium text-sm transition-colors min-w-[120px]"
          >
            {copied ? "✓ Đã sao chép" : "Copy"}
          </button>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-center gap-4">
          <button 
            onClick={() => window.open(studentLink, '_blank')}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Làm thử với tư cách Học sinh
          </button>
          <button 
            onClick={() => navigate('/review')}
            className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Quay lại Ôn tập
          </button>
        </div>
      </div>
    </div>
  );
}
