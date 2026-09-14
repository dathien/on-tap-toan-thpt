const fs = require('fs');
let code = fs.readFileSync('src/pages/TreasureHunt.tsx', 'utf8');

const stateToAdd = `
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
`;
code = code.replace("const [bossCorrectCount, setBossCorrectCount] = useState(0);", "const [bossCorrectCount, setBossCorrectCount] = useState(0);\n" + stateToAdd);

// In loadLevel:
code = code.replace("setCurrentLevel(levelId);\n    setGameState('PLAYING');", "setCurrentLevel(levelId);\n    setGameState('PLAYING');\n    setQuestionStartTime(Date.now());");

// In nextQuestion:
code = code.replace("setShowExplanation(false);\n    } else {", "setShowExplanation(false);\n      setQuestionStartTime(Date.now());\n    } else {");

// In handleAnswer:
const handleAnswerOriginal = `
    if (correct) {
      setCorrectCount(prev => prev + 1);
      if (currentLevel === 5) setBossCorrectCount(prev => prev + 1);
      
      let earned = 100; // base
      setXp(prev => prev + earned);
`;

const handleAnswerNew = `
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
`;
code = code.replace(handleAnswerOriginal, handleAnswerNew);

// UI for fast correct
const uiOriginal = `
                  {isCorrect && (
                    <div className="inline-flex items-center gap-1 bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      +100 XP
                    </div>
                  )}
`;
const uiNew = `
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
`;
code = code.replace(uiOriginal, uiNew);

fs.writeFileSync('src/pages/TreasureHunt.tsx', code);
console.log('done');
