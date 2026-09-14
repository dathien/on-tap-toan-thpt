const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

// Update State definitions
const newStates = `
  // Setup Form State
  const [selectedGrade, setSelectedGrade] = useState<number>(12);
  const [selectedTopic, setSelectedTopic] = useState<string>(demoCurriculum[12][0].id);
  const [selectedLesson, setSelectedLesson] = useState<string>(demoCurriculum[12][0].lessons[0].id);
  const [target, setTarget] = useState<string>('Điểm 7+');
`;

code = code.replace(/  \/\/ Setup Form State[\s\S]*?const \[target, setTarget\] = useState<string>\('Điểm 8\+'\);/, newStates.trim());

// Update handleStartSetup
const startSetupLogic = `
  const handleStartSetup = () => {
    if (!selectedGrade || !selectedTopic || !selectedLesson || !target) return;
    
    const topicObj = demoCurriculum[selectedGrade].find(t => t.id === selectedTopic);
    const lessonObj = topicObj?.lessons.find(l => l.id === selectedLesson);

    const newSession: LearningSession = {
      id: String(Date.now()),
      grade: selectedGrade,
      topic: topicObj ? topicObj.name : selectedTopic, // For backwards compatibility
      goal: target,
      status: 'DIAGNOSTIC',
      units: generateUnitsForTopic(lessonObj ? lessonObj.name : selectedTopic),
      currentUnitIndex: 0,
      progress: 0,
      startedAt: new Date().toISOString()
    };
`;
code = code.replace(/  const handleStartSetup = \(\) => \{[\s\S]*?startedAt: new Date\(\)\.toISOString\(\)\n    \};/, startSetupLogic.trim());

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log('done');
