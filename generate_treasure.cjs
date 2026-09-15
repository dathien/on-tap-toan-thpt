const fs = require('fs');

const fileContent = `import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getQuestions as fetchQuestions, shuffleArray } from '../utils/questionSelector';
import { Compass, Search, Zap, Trophy, Crown, Gem, CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { QuestionContentRenderer } from '../components/QuestionContentRenderer';
import { getGridClass } from '../utils/layout';
import { sanitizeQuestionText } from '../utils/textSanitizer';
import { VisualRenderer } from '../components/visuals/VisualRenderer';
import { Question, GameResult } from '../types';
import clsx from 'clsx';
import { curriculumData } from '../data/curriculum';

const LEVELS = [
  { id: 1, name: 'Khởi hành', icon: Compass, desc: 'Khởi động nhẹ để lấy nhịp!' },
  { id: 2, name: 'Giải mã', icon: Search, desc: 'Đọc dữ kiện – tìm chìa khóa.' },
  { id: 3, name: 'Tăng tốc', icon: Zap, desc: 'Tăng tốc! Vận dụng kiến thức để tiến lên.' },
  { id: 4, name: 'Chinh phục', icon: Trophy, desc: 'Chỉ còn một chặng trước Trùm cuối!' },
  { id: 5, name: 'Trùm cuối', icon: Crown, desc: 'Chỉ còn một chặng nữa để mở Kho báu tri thức.' },
];

export function TreasureHunt() {
  const { currentGrade, questions, addGameResult } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [gameState, setGameState] = useState<'CONFIG' | 'MAP' | 'PLAYING' | 'BOSS_FAIL' | 'TREASURE'>('CONFIG');
  
  // Config state
  const [cfgGrade, setCfgGrade] = useState<number>(currentGrade || 10);
  const [cfgTopic, setCfgTopic] = useState<string>('');
  const [cfgLesson, setCfgLesson] = useState<string>('');
  const [cfgDiff, setCfgDiff] = useState<string>('ALL');
  const [cfgCount, setCfgCount] = useState<number>(10);
  
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [levelDistribution, setLevelDistribution] = useState<number[]>([0,0,0,0,0]);

  // Handle location state from Roadmap
  useEffect(() => {
    if (location.state) {
      const { gradeId, topicId, lessonId } = location.state as any;
      if (gradeId) setCfgGrade(Number(gradeId));
      if (topicId) setCfgTopic(topicId);
      if (lessonId) setCfgLesson(lessonId);
    }
  }, [location.state]);

  // Update topics when grade changes
  const topics = useMemo(() => curriculumData[cfgGrade] || [], [cfgGrade]);
  useEffect(() => {
    if (!topics.find(t => t.id === cfgTopic)) {
      setCfgTopic(topics.length > 0 ? topics[0].id : '');
    }
  }, [topics, cfgTopic]);

  const lessons = useMemo(() => {
    const t = topics.find(t => t.id === cfgTopic);
    return t ? t.lessons : [];
  }, [topics, cfgTopic]);
  useEffect(() => {
    if (!lessons.find(l => l.id === cfgLesson)) {
      setCfgLesson(lessons.length > 0 ? lessons[0].id : '');
    }
  }, [lessons, cfgLesson]);

  // Gameplay state
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [playTime, setPlayTime] = useState(0);
  
  const [levelQuestions, setLevelQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
  
  const [bossCorrectCount, setBossCorrectCount] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  const startGame = (actualCount: number, filtered: Question[]) => {
    // Determine distribution
    const n = filtered.length;
    const bossCount = n >= 15 ? 3 : (n >= 10 ? 2 : 1);
    const rem = n - bossCount;
    const base = Math.floor(rem / 4);
    let extra = rem % 4;
    const dist = [0, 0, 0, 0, bossCount];
    for (let i = 3; i >= 0; i--) {
        dist[i] = base + (extra > 0 ? 1 : 0);
        if (extra > 0) extra--;
    }
    
    // Sort by difficulty to create a progression
    const sorted = [...filtered].sort((a, b) => a.difficulty - b.difficulty);
    
    setGameQuestions(sorted);
    setLevelDistribution(dist);
    setCurrentLevel(1);
    setXp(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalAttempted(0);
    setStartTime(Date.now());
    setGameState('MAP');
  };

  const handleStartConfig = () => {
    // 1. Fetch
    let diffFilter: any = undefined;
    if (cfgDiff !== 'ALL') diffFilter = parseInt(cfgDiff);

    let gradeQuestions = fetchQuestions(questions, {
      gradeId: cfgGrade,
      topicId: cfgTopic,
      lessonId: cfgLesson,
      difficulty: diffFilter,
      questionTypes: ['MCQ_SINGLE']
    });

    if (gradeQuestions.length === 0) {
      alert("Ngân hàng chưa có câu hỏi phù hợp với lựa chọn này. Vui lòng chọn bài khác.");
      return;
    }

    if (gradeQuestions.length < cfgCount) {
      const confirm = window.confirm(\`Ngân hàng hiện có \${gradeQuestions.length}/\${cfgCount} câu phù hợp.\\n\\nNhấn OK để DÙNG \${gradeQuestions.length} CÂU.\\nNhấn Cancel để ĐỔI BÀI HỌC.\`);
      if (!confirm) return;
    }
    
    // Slice to count
    const finalQs = gradeQuestions.slice(0, cfgCount);
    startGame(finalQs.length, finalQs);
  };

  const loadLevel = (levelId: number) => {
    // Compute offset
    let offset = 0;
    for (let i = 0; i < levelId - 1; i++) {
        offset += levelDistribution[i];
    }
    const count = levelDistribution[levelId - 1];
    
    // In rare cases (e.g. 1-2 questions), some levels might be empty.
    // If a level is empty, we auto-skip it. 
    // But let's just assume valid ranges.
    if (count === 0) {
       // Just mark completed and move on.
       if (levelId === 5) {
         endGame();
       } else {
         setCurrentLevel(levelId + 1);
       }
       return;
    }
    
    const qs = gameQuestions.slice(offset, offset + count);
    
    // Shuffle within the level
    const shuffled = shuffleArray(qs);
    setLevelQuestions(shuffled);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    
    if (shuffled.length > 0) {
      setShuffledOptions(shuffleArray((shuffled[0] as any).options || []));
    }

    if (levelId === 5) setBossCorrectCount(0);
    setCurrentLevel(levelId);
    setGameState('PLAYING');
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = (optId: string, correctObj: any) => {
    if (showExplanation) return;
    setSelectedOption(optId);
    
    const correct = correctObj?.isCorrect;
    setIsCorrect(correct);
    setShowExplanation(true);
    setTotalAttempted(prev => prev + 1);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
      if (currentLevel === 5) setBossCorrectCount(prev => prev + 1);
      
      let earnedXp = 100;
      const timeTaken = (Date.now() - questionStartTime) / 1000;
      if (timeTaken <= 15) earnedXp += 20; // Fast answer
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      
      if (newStreak % 3 === 0) earnedXp += 50; // Streak bonus
      
      setXp(prev => prev + earnedXp);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < levelQuestions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setSelectedOption(null);
      setShowExplanation(false);
      setShuffledOptions(shuffleArray((levelQuestions[nextIdx] as any).options || []));
      setQuestionStartTime(Date.now());
    } else {
      // Finished level
      if (currentLevel === 5) {
        const requiredToPass = Math.max(1, Math.ceil(levelQuestions.length * 0.6));
        if (bossCorrectCount >= requiredToPass) {
          setXp(prev => prev + 300); // Boss bonus
          endGame();
        } else {
          setGameState('BOSS_FAIL');
        }
      } else {
        setXp(prev => prev + 100); // Level up bonus
        setGameState('MAP');
        setCurrentLevel(prev => prev + 1);
      }
    }
  };

  const endGame = () => {
    const durationStr = Math.floor((Date.now() - startTime) / 1000);
    setPlayTime(durationStr);
    
    const accuracyStr = Math.round((correctCount / totalAttempted) * 100) || 0;
    
    // Save to result engine
    const result: GameResult = {
      id: crypto.randomUUID(),
      activityType: 'GAME',
      gameType: 'TREASURE',
      gradeId: cfgGrade,
      topicId: cfgTopic,
      lessonId: cfgLesson,
      score: correctCount, // or XP
      correctCount,
      wrongCount: totalAttempted - correctCount,
      accuracy: accuracyStr,
      xp: xp + (currentLevel === 5 ? 300 : 0),
      duration: durationStr,
      playedAt: Date.now()
    };
    
    if (addGameResult) {
       addGameResult(result);
    }
    setGameState('TREASURE');
  };

  const getTitle = () => {
    if (currentLevel < 2) return 'Tân binh';
    if (currentLevel < 3) return 'Nhà khám phá';
    if (currentLevel < 4) return 'Người giải mã';
    if (currentLevel < 5) return 'Cao thủ tăng tốc';
    if (gameState === 'TREASURE') return 'Bậc thầy chủ đề';
    return 'Thợ săn tri thức';
  };

  if (gameState === 'CONFIG') {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
              <Gem className="text-indigo-600" size={32} />
              TRUY TÌM KHO BÁU TOÁN HỌC
            </h2>
            <p className="text-slate-500 mt-2">Cấu hình hành trình khám phá</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Khối lớp</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:border-indigo-500 outline-none"
                  value={cfgGrade}
                  onChange={(e) => setCfgGrade(Number(e.target.value))}
                >
                  <option value={10}>Khối 10</option>
                  <option value={11}>Khối 11</option>
                  <option value={12}>Khối 12</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Chủ đề</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:border-indigo-500 outline-none"
                  value={cfgTopic}
                  onChange={(e) => setCfgTopic(e.target.value)}
                >
                  {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bài học</label>
              <select 
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:border-indigo-500 outline-none"
                value={cfgLesson}
                onChange={(e) => setCfgLesson(e.target.value)}
              >
                {lessons.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mức độ</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:border-indigo-500 outline-none"
                  value={cfgDiff}
                  onChange={(e) => setCfgDiff(e.target.value)}
                >
                  <option value="ALL">Tất cả mức độ</option>
                  <option value="1">Nhận biết (Cơ bản)</option>
                  <option value="2">Thông hiểu (Trung bình)</option>
                  <option value="3">Vận dụng</option>
                  <option value="4">Vận dụng cao (Thử thách)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng câu hỏi</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:border-indigo-500 outline-none"
                  value={cfgCount}
                  onChange={(e) => setCfgCount(Number(e.target.value))}
                >
                  <option value={5}>5 câu</option>
                  <option value={10}>10 câu</option>
                  <option value={15}>15 câu</option>
                  <option value={20}>20 câu</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleStartConfig}
              className="w-full py-4 mt-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Compass size={24} /> BẮT ĐẦU HÀNH TRÌNH
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              const lvlCount = levelDistribution[level.id - 1];
              
              if (lvlCount === 0) return null; // skip empty levels
              
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
                        <p className="text-slate-500 text-sm font-medium mb-1">{level.desc}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase">{lvlCount} CÂU HỎI</p>
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
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'PLAYING') {
    const q = levelQuestions[currentQIndex];
    if (!q) return <div className="p-8 text-center bg-white rounded-xl shadow-sm max-w-md mx-auto mt-12">Lỗi tải câu hỏi.</div>;
    const isBoss = currentLevel === 5;
    const currentLvlConfig = LEVELS.find(l => l.id === currentLevel);

    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
           <button onClick={() => setGameState('MAP')} className="text-slate-500 hover:text-slate-800 font-medium">
             ← Quay lại bản đồ
           </button>
           <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 shadow-sm">
               XP: <span className="text-amber-600">{xp}</span>
             </div>
             {streak > 1 && (
                <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl border border-amber-200 font-bold shadow-sm animate-pulse">
                  🔥 Chuỗi {streak}
                </div>
             )}
           </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-slate-100">
            <div 
              className={clsx("h-full transition-all duration-500", isBoss ? "bg-amber-500" : "bg-indigo-500")}
              style={{ width: \`\${((currentQIndex) / levelQuestions.length) * 100}%\` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className={clsx(
                 "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                 isBoss ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
               )}>
                 {currentLvlConfig && <currentLvlConfig.icon size={24} />}
               </div>
               <div>
                 <h2 className="text-xl font-bold text-slate-800">
                   {currentLvlConfig?.name}
                 </h2>
                 <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                   Câu {currentQIndex + 1} / {levelQuestions.length}
                 </p>
               </div>
             </div>
          </div>

          <div className="question-content question-text text-lg text-slate-800 mb-6 font-medium">
            <QuestionContentRenderer content={sanitizeQuestionText(q.content)} />
          </div>
          
          <VisualRenderer visual={q.visual} />
          
          <div className={getGridClass(q.options) + " mt-8"}>
            {shuffledOptions.map((opt: any, oIdx: number) => {
              const isSelected = selectedOption === opt.id;
              const optIsCorrect = opt.isCorrect;
              
              let btnClass = "answer-option text-left p-4 rounded-xl border-2 transition-all ";
              if (showExplanation) {
                if (optIsCorrect) {
                  btnClass += "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm";
                } else if (isSelected) {
                  btnClass += "border-red-400 bg-red-50 text-red-700 opacity-70";
                } else {
                  btnClass += "border-slate-200 bg-slate-50 opacity-50";
                }
              } else {
                btnClass += isSelected 
                  ? "border-indigo-600 bg-indigo-50/50 shadow-[0_0_0_2px_rgba(79,70,229,0.2)]" 
                  : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-700";
              }

              return (
                <button
                  key={opt.id}
                  disabled={showExplanation}
                  onClick={() => handleAnswer(opt.id, opt)}
                  className={btnClass}
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm",
                      showExplanation && optIsCorrect ? "bg-emerald-100 text-emerald-700" :
                      showExplanation && isSelected ? "bg-red-100 text-red-700" :
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5 overflow-x-auto">
                      <span className="answer-content font-medium">
                        <QuestionContentRenderer content={sanitizeQuestionText(opt.content)} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result after answer */}
          {showExplanation && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={clsx(
                "p-6 rounded-2xl border-2 mb-6",
                isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
              )}>
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    {isCorrect ? (
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    ) : (
                      <XCircle size={32} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={clsx(
                      "text-lg font-bold mb-2",
                      isCorrect ? "text-emerald-700" : "text-red-700"
                    )}>
                      {isCorrect ? 'Tuyệt vời! Đáp án chính xác.' : '✗ Chưa chính xác.'}
                    </h4>
                    
                    {isCorrect && (
                      <div className="flex gap-2 mb-3">
                        <div className="inline-flex items-center gap-1 bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold">
                          +100 XP
                        </div>
                        {((Date.now() - questionStartTime) / 1000) <= 15 && (
                           <div className="inline-flex items-center gap-1 bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
                             ⚡ Nhanh (+20 XP)
                           </div>
                        )}
                        {(streak) % 3 === 0 && (
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
                         Luôn phân tích kỹ các điều kiện của bài toán. Vẽ hình hoặc lập bảng nếu cần thiết để nhìn rõ bản chất.
                       </p>
                    </div>
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
    const requiredToPass = Math.max(1, Math.ceil(levelQuestions.length * 0.6));
    
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>
           <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <Crown size={48} />
           </div>
           
           <h2 className="text-3xl font-bold text-slate-800 mb-4">Trùm cuối vẫn còn phòng thủ!</h2>
           <p className="text-lg text-slate-600 mb-6">
             Bạn đúng {bossCorrectCount}/{levelQuestions.length} câu. Để đánh bại Trùm cuối, bạn cần đúng ít nhất {requiredToPass} câu.
           </p>
           
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-left">
             <h4 className="font-bold text-slate-700 mb-2">Gợi ý ôn tập:</h4>
             <ul className="list-disc list-inside text-slate-600 space-y-1">
               <li>Đọc kĩ giả thiết của đề bài</li>
               <li>Cẩn thận với các phương án gây nhiễu</li>
               <li>Kiểm tra lại kết quả tính toán</li>
             </ul>
           </div>
           
           <div className="flex justify-center gap-4 flex-wrap">
             <button onClick={() => setGameState('MAP')} className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
               VỀ BẢN ĐỒ
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
              <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={20}/> Kết quả tóm tắt:</h4>
              <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                <li>Đúng {correctCount}/{totalAttempted} câu.</li>
                <li>Hoàn thành trong {Math.floor(playTime / 60)} phút {playTime % 60} giây.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><ArrowRight className="text-indigo-500" size={20}/> Bước tiếp theo:</h4>
              <p className="text-slate-600 text-sm">
                Bạn có thể tiếp tục chơi lại bài này để luyện tập phản xạ, hoặc chuyển sang một bài học mới.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
             <button onClick={() => setGameState('CONFIG')} className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
               CHƠI BÀI MỚI
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
`;
fs.writeFileSync('src/pages/TreasureHunt.tsx', fileContent);
