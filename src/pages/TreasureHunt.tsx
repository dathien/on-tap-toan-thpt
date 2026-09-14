import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Compass, Search, Zap, Trophy, Crown, Gem, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { MathText } from '../components/MathText';
import { QuestionEditorModal } from '../components/QuestionEditorModal';
import { Edit } from 'lucide-react';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { VisualRenderer } from '../components/visuals/VisualRenderer';
import { Question } from '../types';
import clsx from 'clsx';

const LEVELS = [
  { id: 1, name: 'Khởi hành', icon: Compass, desc: 'Khởi động nhẹ để lấy nhịp!' },
  { id: 2, name: 'Giải mã', icon: Search, desc: 'Đọc dữ kiện – tìm chìa khóa.' },
  { id: 3, name: 'Tăng tốc', icon: Zap, desc: 'Tăng tốc! Vận dụng kiến thức để tiến lên.' },
  { id: 4, name: 'Chinh phục', icon: Trophy, desc: 'Chỉ còn một chặng trước Trùm cuối!' },
  { id: 5, name: 'Trùm cuối', icon: Crown, desc: 'Chỉ còn một chặng nữa để mở Kho báu tri thức.' },
];

export function TreasureHunt() {
  const { currentGrade, questions } = useAppStore();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'MAP' | 'PLAYING' | 'BOSS_FAIL' | 'TREASURE'>('MAP');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [playTime, setPlayTime] = useState(0);
  
  // Level specific state
  const [levelQuestions, setLevelQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [bossCorrectCount, setBossCorrectCount] = useState(0);

  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const [playedQuestionIds, setPlayedQuestionIds] = useState<Set<string>>(new Set());
  const isTeacherMode = useAppStore(state => state.isTeacherMode);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const updateQuestion = useAppStore(state => state.updateQuestion);


  const loadLevel = (levelId: number) => {
    let mcqs = questions.filter(q => q.question_type === 'MCQ_SINGLE');
    
    // Try to exclude already played questions
    let available = mcqs.filter(q => !playedQuestionIds.has(q.id));
    
    // If not enough available, just use all (prevent getting stuck)
    const numQ = levelId === 5 ? 3 : 2;
    if (available.length < numQ) {
       available = mcqs;
       setPlayedQuestionIds(new Set()); // Reset history
    }

    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const selectedQs = shuffled.slice(0, numQ);
    
    // Mark as played
    setPlayedQuestionIds(prev => {
       const next = new Set(prev);
       selectedQs.forEach(q => next.add(q.id));
       return next;
    });

    setLevelQuestions(selectedQs);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    if (levelId === 5) setBossCorrectCount(0);
    setCurrentLevel(levelId);
    setGameState('PLAYING');
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = (optId: string, correctObj: any) => {
    if (showExplanation) return; // Prevent double clicking
    setSelectedOption(optId);
    
    const correct = correctObj?.isCorrect;
    setIsCorrect(correct);
    setShowExplanation(true);
    setTotalAttempted(prev => prev + 1);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      if (currentLevel === 5) setBossCorrectCount(prev => prev + 1);
      
      let earned = 100; // base
      
      // Fast correct (+20 XP)
      const timeTaken = Date.now() - questionStartTime;
      if (timeTaken < 15000) {
        earned += 20;
      }
      
      setXp(prev => prev + earned);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      
      if (newStreak % 3 === 0) {
        setXp(prev => prev + 50); // streak bonus
      }
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < levelQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else {
      // Finished level
      if (currentLevel === 5) {
        if (bossCorrectCount >= 2) {
          // Win
          setXp(prev => prev + 300); // Boss bonus
          setPlayTime(Math.floor((Date.now() - startTime) / 1000));
          setGameState('TREASURE');
        } else {
          // Fail boss
          setGameState('BOSS_FAIL');
        }
      } else {
        setXp(prev => prev + 100); // Level bonus
        setCurrentLevel(prev => prev + 1);
        setGameState('MAP');
      }
    }
  };

  const getTitle = () => {
    if (currentLevel < 2) return 'Tân binh';
    if (currentLevel < 3) return 'Nhà khám phá';
    if (currentLevel < 4) return 'Người giải mã';
    if (currentLevel < 5) return 'Cao thủ tăng tốc';
    if (gameState === 'TREASURE') return 'Bậc thầy chủ đề';
    return 'Thợ săn tri thức';
  };

  if (gameState === 'MAP') {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-wide flex items-center justify-center gap-3">
            <Gem className="text-indigo-600" size={32} />
            TRUY TÌM KHO BÁU TOÁN HỌC
            <Gem className="text-indigo-600" size={32} />
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Hoàn thành các thử thách để mở khóa kho báu tri thức!</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold">
            <Zap size={20} /> {xp} XP
          </div>
        </div>

        <div className="relative max-w-lg mx-auto">
          {/* Path line */}
          <div className="absolute top-8 bottom-8 left-8 w-1 bg-slate-200 z-0"></div>
          
          <div className="space-y-8 relative z-10">
            {LEVELS.map((level) => {
              const isActive = currentLevel === level.id;
              const isCompleted = currentLevel > level.id;
              const isLocked = currentLevel < level.id;
              const isBoss = level.id === 5;
              
              return (
                <div key={level.id} className="flex items-center gap-6">
                  <div className={clsx(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-4 transition-all duration-300 relative",
                    isCompleted ? "bg-emerald-500 border-emerald-600 text-white" :
                    isActive ? "bg-white border-indigo-500 text-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110" :
                    "bg-slate-100 border-slate-200 text-slate-400",
                    isBoss && isActive && "border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  )}>
                    {isCompleted ? <CheckCircle2 size={32} /> : <level.icon size={32} />}
                  </div>
                  
                  <div className={clsx(
                    "flex-1 p-5 rounded-2xl border-2 transition-all duration-300",
                    isActive ? "bg-white border-indigo-100 shadow-md" : "bg-slate-50/50 border-slate-100",
                    isLocked && "opacity-50"
                  )}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={clsx(
                          "text-lg font-bold mb-1",
                          isActive ? (isBoss ? "text-amber-600" : "text-indigo-600") : "text-slate-700"
                        )}>
                          LEVEL {level.id}: {level.name}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium">{level.desc}</p>
                      </div>
                      {isActive && (
                        <button 
                          onClick={() => loadLevel(level.id)}
                          className={clsx(
                            "px-6 py-2 text-white font-bold rounded-xl whitespace-nowrap",
                            isBoss ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"
                          )}
                        >
                          VÀO THỬ THÁCH
                        </button>
                      )}
                      {isCompleted && (
                        <span className="text-emerald-500 font-bold text-sm">✓ HOÀN THÀNH</span>
                      )}
                      {isLocked && (
                        <span className="text-slate-400 text-sm"><XCircle size={20}/></span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Treasure Box */}
            <div className="flex items-center gap-6 mt-12">
              <div className={clsx(
                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-4 border-slate-200 bg-slate-100 text-slate-400"
              )}>
                <Gem size={32} />
              </div>
              <div className="flex-1 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 opacity-50 text-center">
                <h3 className="text-lg font-bold text-slate-600">💎 KHO BÁU TRI THỨC</h3>
                <p className="text-sm text-slate-500">Đánh bại Trùm cuối để mở khóa</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'PLAYING') {
    const q = levelQuestions[currentQIndex];
    const isBoss = currentLevel === 5;
    const currentLvlConfig = LEVELS.find(l => l.id === currentLevel);

    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
             <div className={clsx(
               "w-12 h-12 rounded-xl flex items-center justify-center text-white",
               isBoss ? "bg-amber-500" : "bg-indigo-600"
             )}>
                {currentLvlConfig && <currentLvlConfig.icon size={24} />}
             </div>
             <div>
               <h3 className="font-bold text-slate-800 text-lg">LEVEL {currentLevel}: {currentLvlConfig?.name}</h3>
               <p className="text-sm text-slate-500">{currentLvlConfig?.desc}</p>
             </div>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold text-slate-500">Tiến độ</div>
             <div className="font-bold text-xl text-indigo-600">{currentQIndex + 1} / {levelQuestions.length}</div>
          </div>
        </div>

        <div className="question-card bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
          {isTeacherMode && (
              <button 
                onClick={() => setEditingQuestion(q)}
                className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100"
              >
                <Edit size={14} /> Sửa câu này
              </button>
          )}
          <div className="question-content question-text text-lg text-slate-800 mb-6">
            <MathText text={sanitizeQuestionText(q.content)} />
          </div>
          <VisualRenderer visual={q.visual} />
          
          <div className="answers-grid mt-8">
            {(q as any).options?.map((opt: any, oIdx: number) => {
              const isSelected = selectedOption === opt.id;
              const optIsCorrect = opt.isCorrect;
              
              let btnClass = "border-slate-200 hover:border-indigo-300 bg-white text-slate-700";
              if (showExplanation) {
                if (optIsCorrect) {
                  btnClass = "border-emerald-500 bg-emerald-50 text-emerald-800";
                } else if (isSelected) {
                  btnClass = "border-red-500 bg-red-50 text-red-800";
                } else {
                  btnClass = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                }
              } else if (isSelected) {
                btnClass = "border-indigo-500 bg-indigo-50 text-indigo-800";
              }

              return (
                <button 
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id, opt)}
                  disabled={showExplanation}
                  className={clsx(
                    "answer-option text-left p-4 rounded-xl border-2 transition-all",
                    btnClass
                  )}
                >
                  <span className={clsx(
                    "answer-label w-7 h-7 rounded-full text-sm font-bold border",
                    showExplanation && optIsCorrect ? "bg-emerald-500 border-emerald-500 text-white" :
                    showExplanation && isSelected && !optIsCorrect ? "bg-red-500 border-red-500 text-white" :
                    "bg-slate-100 border-slate-300 text-slate-500"
                  )}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span className="answer-content font-medium pt-0.5">
                    <MathText text={sanitizeQuestionText(opt.content)} />
                  </span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-8 animate-fade-in space-y-4">
              <div className={clsx(
                "p-6 rounded-2xl border-2 flex items-start gap-4",
                isCorrect ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
              )}>
                <div className={clsx(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                )}>
                  {isCorrect ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                </div>
                <div>
                  <h4 className={clsx(
                    "text-xl font-bold mb-2",
                    isCorrect ? "text-emerald-700" : "text-red-700"
                  )}>
                    {isCorrect ? "✓ CHÍNH XÁC!" : "Chưa chính xác."}
                  </h4>
                  {isCorrect && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="inline-flex items-center gap-1 bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold">
                        +100 XP
                      </div>
                      {(Date.now() - questionStartTime < 15000) && (
                         <div className="inline-flex items-center gap-1 bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
                           ⚡ Nhanh (+20 XP)
                         </div>
                      )}
                      {(streak + 1) % 3 === 0 && (
                         <div className="inline-flex items-center gap-1 bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                           🔥 Chuỗi 3 (+50 XP)
                         </div>
                      )}
                    </div>
                  )}
                  {!isCorrect && (
                    <div className="text-slate-700 mb-2 font-medium">
                      Đáp án đúng là ý có dấu xanh bên trên.
                    </div>
                  )}
                  <div className="bg-white/60 p-4 rounded-xl border border-white/40">
                     <p className="text-sm font-bold text-slate-800 mb-1">MẸO NHỚ / KIẾN THỨC CẦN NHỚ:</p>
                     <p className="text-slate-700 text-sm">
                       Luôn phân tích kỹ các điều kiện của bài toán. Vẽ hình và lập bảng biến thiên nếu cần thiết để nhìn rõ bản chất.
                     </p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <button 
                  onClick={nextQuestion}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                >
                  {currentQIndex < levelQuestions.length - 1 ? 'CÂU TIẾP THEO' : 'HOÀN THÀNH LEVEL'}
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'BOSS_FAIL') {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>
           <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <Crown size={48} />
           </div>
           <h2 className="text-3xl font-bold text-slate-800 mb-4">Trùm cuối vẫn còn 1 lớp phòng thủ!</h2>
           <p className="text-lg text-slate-600 mb-6">
             Bạn đúng {bossCorrectCount}/3 câu. Để đánh bại Trùm cuối và lấy Kho báu, bạn cần đúng ít nhất 2 câu.
           </p>
           
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-left">
             <h4 className="font-bold text-slate-700 mb-2">Nội dung cần củng cố:</h4>
             <ul className="list-disc list-inside text-slate-600 space-y-1">
               <li>Phân tích bài toán vận dụng cao</li>
               <li>Kết hợp nhiều bước giải</li>
             </ul>
           </div>
           
           <div className="flex justify-center gap-4">
             <button onClick={() => setGameState('MAP')} className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
               VỀ BẢN ĐỒ
             </button>
             <button onClick={() => alert('Mở popup Ôn Nhanh (Demo)')} className="px-6 py-3 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 inline-flex items-center gap-2 transition-colors">
               ÔN NHANH
             </button>
             <button onClick={() => loadLevel(5)} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 inline-flex items-center gap-2 transition-colors">
               <RotateCcw size={20} /> THỬ LẠI TRÙM CUỐI
             </button>
           </div>
        </div>
      </div>
    );
  }

  if (gameState === 'TREASURE') {
    const accuracy = Math.round((correctCount / totalAttempted) * 100) || 0;
    
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>
          
          <div className="w-32 h-32 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Gem size={64} />
            <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
          </div>
          
          <h2 className="text-4xl font-bold text-slate-800 mb-2">🎉 CHINH PHỤC THÀNH CÔNG!</h2>
          <p className="text-xl text-slate-500 mb-8 font-medium">Bạn đã mở khóa Kho báu tri thức</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Tổng XP</div>
               <div className="text-3xl font-bold text-amber-600">{xp}</div>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Độ chính xác</div>
               <div className="text-3xl font-bold text-indigo-600">{accuracy}%</div>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Chuỗi đúng</div>
               <div className="text-3xl font-bold text-emerald-600">{maxStreak}</div>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Danh hiệu</div>
               <div className="text-xl font-bold text-purple-600 pt-1">{getTitle()}</div>
             </div>
          </div>
          
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-left grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={20}/> Đã vững:</h4>
              <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                <li>Tính đơn điệu của hàm số</li>
                <li>Công thức đạo hàm cơ bản</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><XCircle className="text-red-500" size={20}/> Cần luyện thêm:</h4>
              <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                <li>Cực trị hàm số lượng giác</li>
                <li>Hàm ẩn</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
             <button className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors">
               LUYỆN PHẦN YẾU
             </button>
             <button onClick={() => {
                setCurrentLevel(1);
                setXp(0);
                setStreak(0);
                setMaxStreak(0);
                setCorrectCount(0);
                setTotalAttempted(0);
                setGameState('MAP');
             }} className="px-6 py-3 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors">
               CHƠI LẠI
             </button>
             <button className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
               CHỌN BÀI KHÁC
             </button>
             <button onClick={() => navigate('/roadmap')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
               QUAY VỀ LỘ TRÌNH
             </button>
          </div>
        </div>
      </div>
    );
  }

  return null;

}
