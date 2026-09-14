const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const sessionCode = `
  const [learningSession, setLearningSession] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('currentLearningPath');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleStartLearning = () => {
    try {
      if (!selectedGrade || !selectedTopic || !target) {
        alert("Vui lòng chọn đầy đủ Khối, Chủ đề và Mục tiêu.");
        return;
      }
      
      const session = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        grade: selectedGrade,
        topic: selectedTopic,
        goal: target,
        currentStep: "warmup",
        progress: 0,
        startedAt: new Date().toISOString()
      };
      
      localStorage.setItem("currentLearningPath", JSON.stringify(session));
      setLearningSession(session);
      setActiveModule(null); // Return to roadmap view
    } catch (error) {
      console.error("START_LEARNING_ERROR", error);
      alert("Không thể bắt đầu lộ trình. Vui lòng thử lại.");
    }
  };
`;

if (!code.includes('handleStartLearning')) {
  // Find where states are defined
  code = code.replace(
    "const [target, setTarget] = useState<string>('Điểm 8+');",
    "const [target, setTarget] = useState<string>('Điểm 8+');\n" + sessionCode
  );
  
  // Add onClick to button
  code = code.replace(
    `className={\`w-full py-3 font-bold rounded-xl mt-4 transition-colors \${!selectedTopic ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}\`}`,
    `type="button"
                onClick={handleStartLearning}
                className={\`w-full py-3 font-bold rounded-xl mt-4 transition-colors relative z-10 \${!selectedTopic ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}\`}`
  );
  
  // Update progress overview to show session details
  const overviewRegex = /<h3 className="font-bold text-slate-800">Chủ đề: Khảo sát hàm số \(Đang học\)<\/h3>/;
  code = code.replace(overviewRegex, 
    `<h3 className="font-bold text-slate-800">
                {learningSession ? \`Khối \${learningSession.grade} - \${learningSession.topic} (\${learningSession.goal})\` : 'Chủ đề: Khảo sát hàm số (Đang học)'}
              </h3>`
  );

  fs.writeFileSync('src/pages/Roadmap.tsx', code);
}
