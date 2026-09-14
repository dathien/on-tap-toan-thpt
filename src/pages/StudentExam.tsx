import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { MathText } from '../components/MathText';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { VisualRenderer } from '../components/visuals/VisualRenderer';
import { Question, McqQuestion, TrueFalseGroupQuestion, ShortAnswerQuestion } from '../types';

export function StudentExam() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  
  const attempts = useAppStore(state => state.attempts);
  const examVersions = useAppStore(state => state.examVersions);
  const exams = useAppStore(state => state.exams);
  const updateAttempt = useAppStore(state => state.updateAttempt);

  const attempt = attempts.find(a => a.id === attemptId);
  const version = examVersions.find(v => v.id === attempt?.examVersionId);
  const config = exams.find(e => e.id === version?.examConfigId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(attempt?.answers || {});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answeredCount = useMemo(() => {
    if (!version) return 0;
    return version.questions.filter(q => {
      if (q.question_type === 'TRUE_FALSE_GROUP') {
        const tf = q as TrueFalseGroupQuestion;
        return tf.statements.every(s => answers[q.id]?.[s.id] !== undefined);
      }
      return answers[q.id] !== undefined && answers[q.id].toString().trim() !== '';
    }).length;
  }, [answers, version]);


  useEffect(() => {
    if (!attempt || !version || !config) return;
    if (attempt.status !== 'IN_PROGRESS') {
      navigate(`/student/result/${attempt.id}`);
      return;
    }

    const durationMs = config.durationMinutes * 60 * 1000;
    const deadline = attempt.startTime + durationMs;
    
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, deadline - now);
      setTimeLeft(Math.floor(remaining / 1000));
      
      if (remaining <= 0) {
        handleAutoSubmit();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [attempt, version, config, navigate]);

  // Anti-cheat: Track visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateAttempt(attemptId!, {
          focusEvents: [...(attempt?.focusEvents || []), { event: 'blur', timestamp: Date.now() }]
        });
        alert("Cảnh báo: Bạn đã rời khỏi màn hình làm bài!");
      } else {
        updateAttempt(attemptId!, {
          focusEvents: [...(attempt?.focusEvents || []), { event: 'focus', timestamp: Date.now() }]
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attemptId, attempt?.focusEvents, updateAttempt]);

  
  const handleConfirmSubmit = useCallback((isAuto: boolean = false) => {
    if (!attempt || attempt.status !== 'IN_PROGRESS' || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      updateAttempt(attempt.id, {
        status: isAuto ? 'AUTO_SUBMITTED' : 'SUBMITTED',
        endTime: Date.now(),
        answers
      });
      
      gradeAttempt(attempt.id, answers, version!.questions);
      navigate(`/student/result/${attempt.id}`, { replace: true });
    } catch (error) {
      console.error("SUBMIT_EXAM_ERROR", error);
      alert("Không thể nộp bài. Vui lòng thử lại.");
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  }, [attempt, answers, updateAttempt, version, navigate, isSubmitting]);

  const handleAutoSubmit = useCallback(() => {
    handleConfirmSubmit(true);
  }, [handleConfirmSubmit]);

  const handleSubmit = () => {
    if (attempt?.status !== 'IN_PROGRESS') return;
    setShowSubmitModal(true);
  };

  const gradeAttempt = (id: string, ans: any, questions: Question[]) => {
    let score = 0;
    let totalQuestions = questions.length;
    let maxScore = 10;
    
    let correctCount = 0;
    
    questions.forEach(q => {
      if (q.question_type === 'MCQ_SINGLE') {
        const mcq = q as McqQuestion;
        const correctOpt = mcq.options.find(o => o.isCorrect);
        if (ans[q.id] === correctOpt?.id) correctCount++;
      } else if (q.question_type === 'TRUE_FALSE_GROUP') {
        const tf = q as TrueFalseGroupQuestion;
        let p = 0;
        tf.statements.forEach(s => {
          if (ans[q.id]?.[s.id] === s.isTrue) p++;
        });
        // typically 4/4 = full points for this question, etc. but let's just count total correct items for now and scale to 10.
        // Actually the scoring logic: 
        // 1 right = 0.1, 2 right = 0.25, 3 right = 0.5, 4 right = 1 point per question in typical VN exam.
        if (p === 1) score += 0.1;
        else if (p === 2) score += 0.25;
        else if (p === 3) score += 0.5;
        else if (p === 4) score += 1;
      } else if (q.question_type === 'SHORT_ANSWER') {
        const sa = q as ShortAnswerQuestion;
        if (ans[q.id]?.toString().trim() === sa.correctAnswer.trim()) correctCount++;
      }
    });

    // Simple grading scale for now (MCQ + SA = 0.2/0.25 per question usually, but let's just use correct/total * 10)
    // For T/F we already calculated score incrementally, so let's simplify for this prototype.
    // Total max points = (MCQ count * 0.25) + TF points + (SA count * 0.5)...
    // Just a placeholder calculation for Demo:
    let finalScore = (correctCount / totalQuestions) * 10; 
    if (finalScore > 10) finalScore = 10;

    updateAttempt(id, { score: parseFloat(finalScore.toFixed(2)) });
  };

  const setAnswer = (qId: string, value: any) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    updateAttempt(attemptId!, { answers: newAnswers });
  };

  if (!attempt || !version || !config) return <div>Đang tải...</div>;
  if (!version.questions || version.questions.length === 0) return (
    <div className="p-8 text-center bg-white rounded-xl shadow-sm max-w-md mx-auto mt-12">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Không có câu hỏi</h2>
      <p className="text-slate-500 mb-6">Ngân hàng câu hỏi hiện tại chưa có dữ liệu phù hợp với thiết lập của bạn.</p>
      <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium">Về trang chủ</button>
    </div>
  );

  const currentQuestion = version.questions[currentIndex];

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 600; // 10 mins
  const isDanger = timeLeft <= 300; // 5 mins
  const isCritical = timeLeft <= 60; // 1 min

  // Group questions by parts for navigation
  const part1Questions = version.questions.filter(q => q.question_type === 'MCQ_SINGLE');
  const part2Questions = version.questions.filter(q => q.question_type === 'TRUE_FALSE_GROUP');
  const part3Questions = version.questions.filter(q => q.question_type === 'SHORT_ANSWER');

  const countAnswered = (questions: Question[]) => questions.filter(q => {
    if (q.question_type === 'TRUE_FALSE_GROUP') {
      const tf = q as TrueFalseGroupQuestion;
      // count as answered if all statements have answers
      return tf.statements.every(s => answers[q.id]?.[s.id] !== undefined);
    }
    return answers[q.id] !== undefined && answers[q.id].toString().trim() !== '';
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="font-bold text-slate-800 line-clamp-1 uppercase">{config.name}</h1>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xl md:text-2xl font-bold transition-colors ${isCritical ? 'bg-red-100 text-red-700 animate-pulse' : isDanger ? 'bg-orange-100 text-orange-700 animate-pulse' : isWarning ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-700'}`}>
            ⏱ {formatTime(timeLeft)}
          </div>

          <div className="flex-1 flex justify-end">
            <button onClick={handleSubmit} className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm">
              Nộp bài
            </button>
          </div>
        </div>

        {/* Part Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-sm font-semibold">
          {part1Questions.length > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">
              PHẦN I <span className="text-indigo-400 font-medium ml-1">{countAnswered(part1Questions)}/{part1Questions.length}</span>
            </div>
          )}
          {part2Questions.length > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-100 whitespace-nowrap">
              PHẦN II <span className="text-cyan-400 font-medium ml-1">{countAnswered(part2Questions)}/{part2Questions.length}</span>
            </div>
          )}
          {part3Questions.length > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 whitespace-nowrap">
              PHẦN III <span className="text-amber-400 font-medium ml-1">{countAnswered(part3Questions)}/{part3Questions.length}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 pb-24">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
            <span className="font-bold text-indigo-600">Câu {currentIndex + 1} / {version.questions.length}</span>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {currentQuestion.question_type === 'MCQ_SINGLE' ? 'Nhiều phương án' : 
               currentQuestion.question_type === 'TRUE_FALSE_GROUP' ? 'Đúng/Sai' : 'Trả lời ngắn'}
            </span>
          </div>

          <div className="text-lg text-slate-800 mb-8 overflow-x-auto">
            <MathText text={sanitizeQuestionText(currentQuestion.content)} />
            <VisualRenderer visual={currentQuestion.visual} />
          </div>

          {/* Answer Area */}
          <div className="space-y-4">
            {currentQuestion.question_type === 'MCQ_SINGLE' && (
              <div className="answers-grid">
                {(currentQuestion as McqQuestion).options.map((opt, i) => {
                  const labels = ['A', 'B', 'C', 'D'];
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setAnswer(currentQuestion.id, opt.id)}
                      className={`answer-option text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`answer-label w-8 h-8 rounded-full font-bold mr-4 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {labels[i]}
                      </span>
                      <div className="answer-content font-medium pt-0.5">
                        <MathText text={opt.content} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.question_type === 'TRUE_FALSE_GROUP' && (
              <div className="space-y-4">
                {(currentQuestion as TrueFalseGroupQuestion).statements.map((stmt, i) => {
                  const labels = ['a', 'b', 'c', 'd'];
                  const currentAns = answers[currentQuestion.id]?.[stmt.id];
                  
                  return (
                    <div key={stmt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="answer-option mb-4 border-none p-0">
                        <span className="answer-label font-bold text-slate-600">{labels[i]})</span>
                        <div className="answer-content font-medium"><MathText text={stmt.content} /></div>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setAnswer(currentQuestion.id, { ...answers[currentQuestion.id], [stmt.id]: true })}
                          className={`flex-1 py-3 rounded-lg border-2 font-bold transition-colors ${
                            currentAns === true ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          ĐÚNG
                        </button>
                        <button
                          onClick={() => setAnswer(currentQuestion.id, { ...answers[currentQuestion.id], [stmt.id]: false })}
                          className={`flex-1 py-3 rounded-lg border-2 font-bold transition-colors ${
                            currentAns === false ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          SAI
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {currentQuestion.question_type === 'SHORT_ANSWER' && (
              <div className="pt-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Nhập kết quả..."
                  className="w-full text-center text-2xl font-bold text-slate-800 p-4 rounded-xl border-2 border-slate-300 focus:border-indigo-600 focus:ring-0 outline-none transition-colors"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 md:p-4 pb-safe flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 gap-2">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
          className="flex-1 md:flex-none min-h-[44px] px-3 md:px-6 py-2 md:py-3 rounded-xl font-medium disabled:opacity-50 text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm md:text-base whitespace-nowrap"
        >
          ← Trước
        </button>
        
        <div className="text-sm font-medium text-slate-500 hidden md:block px-4">
          Đã làm: {answeredCount} / {version.questions.length}
        </div>

        <button
          disabled={currentIndex === version.questions.length - 1}
          onClick={() => setCurrentIndex(prev => prev + 1)}
          className="flex-1 md:flex-none min-h-[44px] px-3 md:px-6 py-2 md:py-3 rounded-xl font-medium disabled:opacity-50 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors text-sm md:text-base whitespace-nowrap"
        >
          Tiếp →
        </button>

        <button
          onClick={handleSubmit}
          className="flex-1 md:hidden min-h-[44px] px-3 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors text-sm whitespace-nowrap"
        >
          Nộp bài
        </button>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận nộp bài</h3>
            {version.questions.length - answeredCount > 0 ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
                <div className="flex gap-3">
                  <div className="text-amber-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800">Bạn chưa hoàn thành bài thi</p>
                    <p className="text-amber-700 text-sm mt-1">Đã làm: {answeredCount}/{version.questions.length}</p>
                    <p className="text-amber-700 text-sm">Chưa làm: {version.questions.length - answeredCount} câu.</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-600 mb-6">Bạn đã hoàn thành tất cả câu hỏi. Bạn có chắc chắn muốn nộp bài ngay bây giờ?</p>
            )}
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Quay lại
              </button>
              <button 
                onClick={() => handleConfirmSubmit(false)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
