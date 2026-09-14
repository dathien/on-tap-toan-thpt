const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const regex = /const handleStartSetup = \(\) => \{[\s\S]*?setView\('SESSION'\);\n  \};/;

const replacement = `const handleStartSetup = () => {
    if (!selectedGrade || !selectedTopic || !selectedLesson || !target || !selectedAbility) {
        alert("Vui lòng chọn đầy đủ thông tin.");
        return;
    }
    
    const qs = proposedQuestions || generateRoadmapQuestions();
    
    const topicObj = demoCurriculum[selectedGrade as keyof typeof demoCurriculum]?.find(t => t.id === selectedTopic);
    const lessonObj = topicObj?.lessons.find(l => l.id === selectedLesson);
    
    let pathName = "Lộ trình";
    if (selectedAbility === 'WEAK') pathName = \`Lộ trình củng cố – \${lessonObj?.name || selectedTopic} – Toán \${selectedGrade}\`;
    else if (selectedAbility === 'AVERAGE') pathName = \`Lộ trình cơ bản – \${lessonObj?.name || selectedTopic} – Toán \${selectedGrade}\`;
    else if (selectedAbility === 'GOOD') pathName = \`Lộ trình vận dụng – \${lessonObj?.name || selectedTopic} – Toán \${selectedGrade}\`;
    else if (selectedAbility === 'EXCELLENT') pathName = \`Lộ trình nâng cao – \${lessonObj?.name || selectedTopic} – Toán \${selectedGrade}\`;

    const newSession: LearningSession = {
      id: String(Date.now()),
      name: pathName,
      grade: selectedGrade,
      topic: topicObj ? topicObj.name : selectedTopic, 
      goal: target,
      abilityLevel: selectedAbility,
      status: 'DIAGNOSTIC',
      units: generateUnitsForTopic(lessonObj ? lessonObj.name : selectedTopic, selectedAbility),
      currentUnitIndex: 0,
      progress: 0,
      startedAt: new Date().toISOString(),
      questions: qs || []
    };
    
    setSession(newSession);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setView('SESSION');
  };`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched handleStartSetup");
