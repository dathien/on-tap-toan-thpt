const fs = require('fs');
let code = fs.readFileSync('src/pages/TreasureHunt.tsx', 'utf8');

// Add playedQuestions state
const stateToAdd = `
  const [bossCorrectCount, setBossCorrectCount] = useState(0);
  const [playedQuestionIds, setPlayedQuestionIds] = useState<Set<string>>(new Set());
`;
code = code.replace("const [bossCorrectCount, setBossCorrectCount] = useState(0);", stateToAdd);

// Update loadLevel
const loadLevelOriginal = `
  const loadLevel = (levelId: number) => {
    // Basic filter: just take random MCQs
    const mcqs = questions.filter(q => q.question_type === 'MCQ_SINGLE');
    const shuffled = [...mcqs].sort(() => 0.5 - Math.random());
    
    // Boss takes 3, others take 2
    const numQ = levelId === 5 ? 3 : 2;
    setLevelQuestions(shuffled.slice(0, numQ));
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    if (levelId === 5) setBossCorrectCount(0);
    setCurrentLevel(levelId);
    setGameState('PLAYING');
  };
`;

const loadLevelNew = `
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
  };
`;
code = code.replace(loadLevelOriginal.trim(), loadLevelNew.trim());

// Add ÔN NHANH to BOSS_FAIL
const bossFailRegex = /<button onClick=\{\(\) => loadLevel\(5\)\} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 inline-flex items-center gap-2 transition-colors">[\s\S]*?<RotateCcw size=\{20\} \/> THỬ LẠI TRÙM CUỐI[\s\S]*?<\/button>/;
const bossFailBtns = `
             <button onClick={() => setGameState('MAP')} className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
               VỀ BẢN ĐỒ
             </button>
             <button onClick={() => alert('Mở popup Ôn Nhanh (Demo)')} className="px-6 py-3 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 inline-flex items-center gap-2 transition-colors">
               ÔN NHANH
             </button>
             <button onClick={() => loadLevel(5)} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 inline-flex items-center gap-2 transition-colors">
               <RotateCcw size={20} /> THỬ LẠI TRÙM CUỐI
             </button>
`;
code = code.replace(/<button onClick=\{\(\) => setGameState\('MAP'\)\}[\s\S]*?<\/button>\s*<button onClick=\{\(\) => loadLevel\(5\)\}[\s\S]*?<\/button>/, bossFailBtns.trim());

fs.writeFileSync('src/pages/TreasureHunt.tsx', code);
console.log('done');
