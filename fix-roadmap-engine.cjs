const fs = require('fs');

const roadmapCode = `
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  Rocket, Zap, BookOpen, PenTool, CheckCircle2, 
  BarChart2, RotateCcw, ChevronLeft, ArrowRight, Play, CheckCircle
} from 'lucide-react';
import { MathText } from '../components/MathText';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { VisualRenderer } from '../components/visuals/VisualRenderer';
import { Question, LearningSession, LearningUnit } from '../types';
import clsx from 'clsx';

// Shared Curriculum Data
const mathCurriculum = {
  10: [
    "Mệnh đề và tập hợp",
    "Bất phương trình và hệ bất phương trình",
    "Hàm số và đồ thị",
    "Hệ thức lượng trong tam giác",
    "Vectơ",
    "Thống kê",
    "Xác suất"
  ],
  11: [
    "Hàm số lượng giác và phương trình lượng giác",
    "Dãy số - Cấp số cộng - Cấp số nhân",
    "Giới hạn",
    "Hàm số liên tục",
    "Đạo hàm",
    "Quan hệ song song trong không gian",
    "Quan hệ vuông góc trong không gian",
    "Xác suất"
  ],
  12: [
    "Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số",
    "Vectơ và hệ tọa độ trong không gian",
    "Các số đặc trưng đo mức độ phân tán",
    "Nguyên hàm và tích phân",
    "Phương pháp tọa độ trong không gian",
    "Xác suất có điều kiện"
  ]
};

// Generic Unit Generator based on Topic
const generateUnitsForTopic = (topic: string): LearningUnit[] => {
  return [
    {
      id: 'u1',
      title: 'Khái niệm và Định nghĩa cơ bản',
      theory: [
        \`Lý thuyết trọng tâm về \${topic}.\`,
        'Nắm vững các công thức và định nghĩa cốt lõi.',
      ],
      status: 'LOCKED'
    },
    {
      id: 'u2',
      title: 'Phân loại các dạng bài tập',
      theory: [
        'Nhận biết các dạng toán thường gặp.',
        'Phương pháp giải nhanh và tránh sai lầm.'
      ],
      status: 'LOCKED'
    },
    {
      id: 'u3',
      title: 'Bài tập vận dụng cao',
      theory: [
        'Kỹ năng biến đổi và giải quyết bài toán phức tạp.',
        'Kết hợp nhiều kiến thức trong cùng một bài toán.'
      ],
      status: 'LOCKED'
    }
  ];
};

export function Roadmap() {
  const { currentGrade, questions } = useAppStore();
  
  // Setup Form State
  const [selectedGrade, setSelectedGrade] = useState<number>(12);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [target, setTarget] = useState<string>('Điểm 8+');

  // Engine State
  const [session, setSession] = useState<LearningSession | null>(() => {
    try {
      const saved = localStorage.getItem('currentLearningPath');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Local interaction states
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [learningStep, setLearningStep] = useState<'THEORY' | 'EXAMPLE' | 'PRACTICE'>('THEORY');

  // Save session on change
  useEffect(() => {
    if (session) {
      localStorage.setItem('currentLearningPath', JSON.stringify(session));
    } else {
      localStorage.removeItem('currentLearningPath');
    }
  }, [session]);

  const handleStartSetup = () => {
    if (!selectedGrade || !selectedTopic || !target) return;
    
    const newSession: LearningSession = {
      id: String(Date.now()),
      grade: selectedGrade,
      topic: selectedTopic,
      goal: target,
      status: 'DIAGNOSTIC',
      units: generateUnitsForTopic(selectedTopic),
      currentUnitIndex: 0,
      progress: 0,
      startedAt: new Date().toISOString()
    };
    
    setSession(newSession);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const quitSession = () => {
    if (window.confirm('Bạn có chắc muốn thoát lộ trình này? Mọi tiến độ sẽ bị xóa.')) {
      setSession(null);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER: SETUP
  // ---------------------------------------------------------------------------
  if (!session || session.status === 'SETUP') {
    const availableTopics = (mathCurriculum as any)[selectedGrade] || [];
    
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-12 mt-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-wide">Thiết lập Lộ trình</h2>
          <p className="text-slate-500 mt-2">Hệ thống sẽ cá nhân hóa bài học dựa trên lựa chọn của bạn</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">1. Khối lớp</label>
              <select 
                value={selectedGrade}
                onChange={e => {
                  setSelectedGrade(Number(e.target.value));
                  setSelectedTopic('');
                }}
                className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
              >
                <option value={10}>Khối 10</option>
                <option value={11}>Khối 11</option>
                <option value={12}>Khối 12</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">2. Chủ đề học thuật</label>
              <select 
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
              >
                <option value="">[Chọn chủ đề]</option>
                {availableTopics.map((topic: string) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">3. Mục tiêu điểm số</label>
              <select 
                value={target}
                onChange={e => setTarget(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
              >
                <option value="Củng cố nền tảng">Củng cố nền tảng</option>
                <option value="Điểm 5+">Điểm 5+</option>
                <option value="Điểm 7+">Điểm 7+</option>
                <option value="Điểm 8+">Điểm 8+</option>
                <option value="Điểm 9+">Điểm 9+</option>
              </select>
            </div>
            
            <div className="pt-4">
              <button 
                type="button"
                onClick={handleStartSetup}
                disabled={!selectedTopic}
                className={clsx(
                  "w-full py-4 font-bold rounded-xl transition-all text-lg shadow-sm",
                  !selectedTopic 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                )}
              >
                {!selectedTopic ? 'VUI LÒNG CHỌN CHỦ ĐỀ' : 'BẮT ĐẦU CHẨN ĐOÁN'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper: Get generic questions (mock filtering for diagnostic/practice)
  // In a real app, this filters by session.topic and difficulty
  const getQuestions = (count: number) => {
    // Just return some MCQ questions for demonstration
    return questions.filter(q => q.question_type === 'MCQ_SINGLE').slice(0, count);
  };

  const getTargetScore = () => {
    if (session.goal.includes('5+')) return 5;
    if (session.goal.includes('7+')) return 7;
    if (session.goal.includes('8+')) return 8;
    if (session.goal.includes('9+')) return 9;
    return 5;
  };

  // ---------------------------------------------------------------------------
  // HEADER PROGRESS
  // ---------------------------------------------------------------------------
  const renderHeader = () => {
    const steps = [
      { id: 'DIAGNOSTIC', label: 'Chẩn đoán' },
      { id: 'LEARNING', label: 'Học tập' },
      { id: 'ASSESSMENT', label: 'Kiểm tra' },
      { id: 'COMPLETED', label: 'Hoàn thành' }
    ];
    
    // determine current step index for UI
    let currentStepIdx = 0;
    if (session.status === 'LEARNING' || session.status === 'REMEDIATION') currentStepIdx = 1;
    if (session.status === 'ASSESSMENT') currentStepIdx = 2;
    if (session.status === 'COMPLETED') currentStepIdx = 3;

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{session.topic}</h2>
            <p className="text-slate-500 font-medium">Khối {session.grade} • Mục tiêu: {session.goal}</p>
          </div>
          <button onClick={quitSession} className="text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors">
            THOÁT LỘ TRÌNH
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500"
            style={{ width: \`\${(currentStepIdx / (steps.length - 1)) * 100}%\` }}
          ></div>
          
          <div className="relative z-10 flex justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2",
                  idx < currentStepIdx ? "bg-indigo-600 border-indigo-600 text-white" : 
                  idx === currentStepIdx ? "bg-white border-indigo-600 text-indigo-600" :
                  "bg-white border-slate-200 text-slate-400"
                )}>
                  {idx < currentStepIdx ? <CheckCircle size={16} /> : idx + 1}
                </div>
                <span className={clsx(
                  "text-xs font-bold uppercase",
                  idx <= currentStepIdx ? "text-slate-700" : "text-slate-400"
                )}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER: DIAGNOSTIC
  // ---------------------------------------------------------------------------
  if (session.status === 'DIAGNOSTIC') {
    const diagnosticQuestions = getQuestions(5);
    
    const submitDiagnostic = () => {
      // Calculate score
      let correct = 0;
      diagnosticQuestions.forEach(q => {
        const selectedId = quizAnswers[q.id];
        const option = (q as any).options?.find((o: any) => o.id === selectedId);
        if (option?.isCorrect) correct++;
      });
      
      const score = (correct / diagnosticQuestions.length) * 10;
      setQuizScore(score);
      setQuizSubmitted(true);
      
      // Update session
      setTimeout(() => {
        const newUnits = [...session.units];
        newUnits[0].status = 'CURRENT';
        
        setSession({
          ...session,
          status: 'LEARNING',
          diagnosticResult: { score, weakUnits: [newUnits[0].id, newUnits[1].id] },
          units: newUnits,
          progress: 20
        });
        setQuizAnswers({});
        setQuizSubmitted(false);
        setLearningStep('THEORY');
      }, 3000);
    };

    return (
      <div className="max-w-4xl mx-auto pb-12 mt-8 space-y-6">
        {renderHeader()}
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          {!quizSubmitted ? (
            <>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Bài kiểm tra chẩn đoán</h3>
                  <p className="text-slate-500">Hoàn thành 5 câu hỏi để hệ thống cá nhân hóa lộ trình cho bạn.</p>
                </div>
              </div>
              
              <div className="space-y-8">
                {diagnosticQuestions.map((q, i) => (
                  <div key={q.id}>
                    <div className="font-bold text-slate-700 mb-3">Câu {i + 1}:</div>
                    <div className="mb-4 text-slate-800 text-lg">
                      <MathText text={sanitizeQuestionText(q.content)} />
                    </div>
                    <VisualRenderer visual={q.visual} />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {(q as any).options?.map((opt: any, oIdx: number) => (
                        <label 
                          key={opt.id}
                          className={clsx(
                            "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                            quizAnswers[q.id] === opt.id 
                              ? "border-indigo-600 bg-indigo-50" 
                              : "border-slate-100 hover:border-indigo-200 bg-white"
                          )}
                        >
                          <input 
                            type="radio" 
                            name={\`diag_\${q.id}\`}
                            className="mt-1 sr-only"
                            checked={quizAnswers[q.id] === opt.id}
                            onChange={() => setQuizAnswers({...quizAnswers, [q.id]: opt.id})}
                          />
                          <span className={clsx(
                            "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border",
                            quizAnswers[q.id] === opt.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 text-slate-500 border-slate-200"
                          )}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-slate-700 font-medium pt-0.5">
                            <MathText text={sanitizeQuestionText(opt.content)} />
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 text-right">
                <button 
                  onClick={submitDiagnostic}
                  disabled={Object.keys(quizAnswers).length < diagnosticQuestions.length}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  NỘP BÀI CHẨN ĐOÁN
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Đang phân tích kết quả...</h3>
              <p className="text-slate-500 mb-6">Điểm chẩn đoán: {quizScore}/10</p>
              <p className="text-indigo-600 font-semibold animate-pulse">Hệ thống đang khởi tạo các đơn vị bài học phù hợp với bạn.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: LEARNING & REMEDIATION
  // ---------------------------------------------------------------------------
  if (session.status === 'LEARNING' || session.status === 'REMEDIATION') {
    const currentUnit = session.units[session.currentUnitIndex];
    const isLastUnit = session.currentUnitIndex === session.units.length - 1;
    const practiceQuestions = getQuestions(3); // 3 practice questions

    const submitPractice = () => {
      let correct = 0;
      practiceQuestions.forEach(q => {
        const selectedId = quizAnswers[q.id];
        const option = (q as any).options?.find((o: any) => o.id === selectedId);
        if (option?.isCorrect) correct++;
      });
      
      const pct = (correct / practiceQuestions.length) * 100;
      setQuizScore(pct);
      setQuizSubmitted(true);
    };

    const nextUnitOrAssessment = () => {
      if (quizScore >= 70) {
        // Passed this unit
        const newUnits = [...session.units];
        newUnits[session.currentUnitIndex].status = 'COMPLETED';
        
        if (isLastUnit) {
          // Go to final assessment
          setSession({
            ...session,
            status: 'ASSESSMENT',
            units: newUnits,
            progress: 80
          });
        } else {
          // Next unit
          newUnits[session.currentUnitIndex + 1].status = 'CURRENT';
          setSession({
            ...session,
            units: newUnits,
            currentUnitIndex: session.currentUnitIndex + 1,
            progress: session.progress + (60 / session.units.length)
          });
          setLearningStep('THEORY');
        }
      } else {
        // Failed, retry
        setLearningStep('THEORY');
      }
      
      setQuizAnswers({});
      setQuizSubmitted(false);
    };

    return (
      <div className="max-w-5xl mx-auto pb-12 mt-8 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {renderHeader()}
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
             {/* Learning Step Tabs */}
             <div className="flex border-b border-slate-100 bg-slate-50">
               <button 
                 onClick={() => setLearningStep('THEORY')}
                 className={clsx("flex-1 py-4 font-bold text-sm transition-colors", learningStep === 'THEORY' ? "text-indigo-600 bg-white border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700")}
               >
                 1. LÝ THUYẾT
               </button>
               <button 
                 onClick={() => setLearningStep('EXAMPLE')}
                 className={clsx("flex-1 py-4 font-bold text-sm transition-colors", learningStep === 'EXAMPLE' ? "text-indigo-600 bg-white border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700")}
               >
                 2. VÍ DỤ MẪU
               </button>
               <button 
                 onClick={() => setLearningStep('PRACTICE')}
                 className={clsx("flex-1 py-4 font-bold text-sm transition-colors", learningStep === 'PRACTICE' ? "text-indigo-600 bg-white border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700")}
               >
                 3. LUYỆN TẬP
               </button>
             </div>

             {/* Content Area */}
             <div className="p-8 flex-1">
                {learningStep === 'THEORY' && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">{currentUnit.title}</h3>
                    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl space-y-4">
                      {currentUnit.theory.map((t, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="mt-1 w-2 h-2 bg-indigo-500 rounded-full shrink-0"></div>
                          <p className="text-slate-700 text-lg leading-relaxed">{t}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-8">
                      <button onClick={() => setLearningStep('EXAMPLE')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2">
                        XEM VÍ DỤ <ArrowRight size={20}/>
                      </button>
                    </div>
                  </div>
                )}

                {learningStep === 'EXAMPLE' && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Ví dụ minh họa</h3>
                    <div className="p-6 border border-slate-200 rounded-xl">
                       <div className="font-semibold text-slate-700 mb-2">Đề bài:</div>
                       <MathText text="Tìm tập xác định của hàm số $y = \sqrt{x - 1}$" />
                       <div className="mt-6 font-semibold text-emerald-700 mb-2">Hướng dẫn giải:</div>
                       <div className="p-4 bg-emerald-50 rounded-lg text-emerald-900">
                         <MathText text="Điều kiện xác định: $x - 1 \ge 0 \Leftrightarrow x \ge 1$. Vậy $D = [1; +\infty)$" />
                       </div>
                    </div>
                    <div className="flex justify-end pt-8">
                      <button onClick={() => setLearningStep('PRACTICE')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2">
                        CHUYỂN SANG LUYỆN TẬP <ArrowRight size={20}/>
                      </button>
                    </div>
                  </div>
                )}

                {learningStep === 'PRACTICE' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800">Luyện tập nhanh ({practiceQuestions.length} câu)</h3>
                      {quizSubmitted && (
                        <span className={clsx("px-4 py-1.5 rounded-full font-bold text-sm", quizScore >= 70 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                          Tỉ lệ đúng: {quizScore}%
                        </span>
                      )}
                    </div>

                    {!quizSubmitted ? (
                      <>
                        {practiceQuestions.map((q, i) => (
                          <div key={q.id} className="p-6 border border-slate-200 rounded-xl">
                            <div className="font-bold text-slate-700 mb-3">Câu {i + 1}:</div>
                            <div className="mb-4 text-slate-800 text-lg">
                              <MathText text={sanitizeQuestionText(q.content)} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                              {(q as any).options?.map((opt: any, oIdx: number) => (
                                <label 
                                  key={opt.id}
                                  className={clsx(
                                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    quizAnswers[q.id] === opt.id 
                                      ? "border-indigo-600 bg-indigo-50" 
                                      : "border-slate-100 hover:border-indigo-200 bg-white"
                                  )}
                                >
                                  <input 
                                    type="radio" 
                                    className="sr-only"
                                    checked={quizAnswers[q.id] === opt.id}
                                    onChange={() => setQuizAnswers({...quizAnswers, [q.id]: opt.id})}
                                  />
                                  <span className={clsx(
                                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border",
                                    quizAnswers[q.id] === opt.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 text-slate-500 border-slate-200"
                                  )}>
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span className="text-slate-700 font-medium pt-0.5">
                                    <MathText text={sanitizeQuestionText(opt.content)} />
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="pt-4 text-right">
                           <button 
                             onClick={submitPractice}
                             disabled={Object.keys(quizAnswers).length < practiceQuestions.length}
                             className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                           >
                             NỘP BÀI LUYỆN TẬP
                           </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        {quizScore >= 70 ? (
                           <>
                             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                               <CheckCircle2 size={40}/>
                             </div>
                             <h3 className="text-2xl font-bold text-slate-800 mb-2">Tuyệt vời!</h3>
                             <p className="text-slate-600 mb-8">Bạn đã nắm vững kiến thức phần này.</p>
                             <button onClick={nextUnitOrAssessment} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">
                               {isLastUnit ? 'CHUYỂN SANG KIỂM TRA CUỐI' : 'CHUYỂN SANG ĐƠN VỊ TIẾP THEO'}
                             </button>
                           </>
                        ) : (
                           <>
                             <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                               <RotateCcw size={40}/>
                             </div>
                             <h3 className="text-2xl font-bold text-slate-800 mb-2">Cần cố gắng thêm!</h3>
                             <p className="text-slate-600 mb-8">Tỷ lệ đúng chưa đạt yêu cầu (>=70%). Bạn cần ôn tập lại.</p>
                             <div className="flex justify-center gap-4">
                               <button onClick={nextUnitOrAssessment} className="px-6 py-3 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200">
                                 XEM LẠI LÝ THUYẾT
                               </button>
                             </div>
                           </>
                        )}
                      </div>
                    )}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Sidebar Tracking */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
             <h3 className="font-bold text-slate-800 mb-6 uppercase text-sm tracking-wider">Kế hoạch học tập</h3>
             <div className="space-y-1 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100 before:z-0">
               {session.units.map((unit, idx) => (
                 <div key={unit.id} className="relative z-10 flex items-center gap-4 p-3 rounded-xl transition-colors">
                   <div className={clsx(
                     "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm shrink-0",
                     unit.status === 'COMPLETED' ? "bg-emerald-500 text-white" :
                     unit.status === 'CURRENT' || unit.status === 'REMEDIATION' ? "bg-indigo-600 text-white ring-4 ring-indigo-100" :
                     "bg-slate-100 text-slate-400"
                   )}>
                     {unit.status === 'COMPLETED' ? <CheckCircle size={14} /> : idx + 1}
                   </div>
                   <div>
                     <div className={clsx("font-bold text-sm", unit.status === 'CURRENT' ? "text-indigo-700" : "text-slate-700")}>
                       {unit.title}
                     </div>
                     <div className="text-xs text-slate-500 mt-0.5">
                       {unit.status === 'COMPLETED' ? 'Đã xong' : unit.status === 'CURRENT' ? 'Đang học' : 'Đang khóa'}
                     </div>
                   </div>
                 </div>
               ))}
               <div className="relative z-10 flex items-center gap-4 p-3 rounded-xl mt-2">
                 <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs shrink-0">
                   <CheckCircle size={14} />
                 </div>
                 <div className="font-bold text-sm text-slate-500">Kiểm tra cuối</div>
               </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: FINAL ASSESSMENT
  // ---------------------------------------------------------------------------
  if (session.status === 'ASSESSMENT') {
    const finalQuestions = getQuestions(5);
    
    const submitFinal = () => {
      let correct = 0;
      finalQuestions.forEach(q => {
        const selectedId = quizAnswers[q.id];
        const option = (q as any).options?.find((o: any) => o.id === selectedId);
        if (option?.isCorrect) correct++;
      });
      
      const score = (correct / finalQuestions.length) * 10;
      const targetScore = getTargetScore();
      
      setQuizScore(score);
      setQuizSubmitted(true);
      
      if (score >= targetScore) {
        setSession({
          ...session,
          status: 'COMPLETED',
          finalScore: score,
          progress: 100
        });
      } else {
        // Remediation logic: reset weak units
        const newUnits = [...session.units].map(u => ({...u, status: 'LOCKED' as any}));
        newUnits[0].status = 'REMEDIATION'; // Mock targeting first unit as weak
        
        setTimeout(() => {
          setSession({
            ...session,
            status: 'REMEDIATION',
            finalScore: score,
            units: newUnits,
            currentUnitIndex: 0,
            progress: 20
          });
          setQuizAnswers({});
          setQuizSubmitted(false);
          setLearningStep('THEORY');
          alert('Chưa đạt mục tiêu. Hệ thống đã tạo lại lộ trình ôn tập các phần còn yếu.');
        }, 3000);
      }
    };

    return (
      <div className="max-w-4xl mx-auto pb-12 mt-8 space-y-6">
        {renderHeader()}
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
           {!quizSubmitted ? (
              <>
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Kiểm tra cuối chủ đề</h3>
                    <p className="text-slate-500">Hoàn thành bài kiểm tra để đánh giá chuẩn mục tiêu {session.goal}.</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {finalQuestions.map((q, i) => (
                    <div key={q.id}>
                      <div className="font-bold text-slate-700 mb-3">Câu {i + 1}:</div>
                      <div className="mb-4 text-slate-800 text-lg">
                        <MathText text={sanitizeQuestionText(q.content)} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {(q as any).options?.map((opt: any, oIdx: number) => (
                          <label 
                            key={opt.id}
                            className={clsx(
                              "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                              quizAnswers[q.id] === opt.id 
                                ? "border-indigo-600 bg-indigo-50" 
                                : "border-slate-100 hover:border-indigo-200 bg-white"
                            )}
                          >
                            <input 
                              type="radio" 
                              className="sr-only"
                              checked={quizAnswers[q.id] === opt.id}
                              onChange={() => setQuizAnswers({...quizAnswers, [q.id]: opt.id})}
                            />
                            <span className={clsx(
                              "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border",
                              quizAnswers[q.id] === opt.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 text-slate-500 border-slate-200"
                            )}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="text-slate-700 font-medium pt-0.5">
                              <MathText text={sanitizeQuestionText(opt.content)} />
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100 text-right">
                  <button 
                    onClick={submitFinal}
                    disabled={Object.keys(quizAnswers).length < finalQuestions.length}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    NỘP BÀI KIỂM TRA
                  </button>
                </div>
              </>
           ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-6">
                  <BarChart2 size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Đang chấm điểm...</h3>
                <p className="text-indigo-600 font-semibold animate-pulse">Hệ thống đang phân tích kết quả bài thi.</p>
              </div>
           )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: COMPLETED
  // ---------------------------------------------------------------------------
  if (session.status === 'COMPLETED') {
    return (
      <div className="max-w-4xl mx-auto pb-12 mt-8 space-y-6">
        {renderHeader()}
        
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-indigo-500"></div>
          
          <div className="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={56} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">🎉 CHÚC MỪNG BẠN!</h2>
          <p className="text-lg text-slate-600 mb-8">Bạn đã hoàn thành xuất sắc lộ trình và đạt mục tiêu <strong className="text-indigo-600">{session.goal}</strong> cho chủ đề <strong>{session.topic}</strong>.</p>
          
          <div className="flex justify-center gap-6 mb-10">
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[140px]">
               <div className="text-sm font-semibold text-slate-500 mb-2">Điểm cuối</div>
               <div className="text-4xl font-bold text-indigo-600">{session.finalScore?.toFixed(1).replace('.', ',')}</div>
             </div>
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[140px]">
               <div className="text-sm font-semibold text-slate-500 mb-2">Hoàn thành</div>
               <div className="text-4xl font-bold text-emerald-600">100%</div>
             </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
             <button onClick={() => setSession(null)} className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
               CHỌN CHỦ ĐỀ KHÁC
             </button>
             <button className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
               LUYỆN NÂNG CAO
             </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
`;

fs.writeFileSync('src/pages/Roadmap.tsx', roadmapCode);
