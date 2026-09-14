const fs = require('fs');
let content = fs.readFileSync('src/pages/PracticeConfig.tsx', 'utf-8');

const replacement = `
  const allQuestions = useAppStore(state => state.questions);
  const addExamVersion = useAppStore(state => state.addExamVersion);
  const addAttempt = useAppStore(state => state.addAttempt);

  const handleStartPractice = () => {
    // Create an ExamConfig
    const newConfig: ExamConfig = {
      id: uuidv4(),
      name: \`Luyện tập: \${scope === 'LESSON' ? lesson?.name : topic?.name}\`,
      type: type === 'thuong-xuyen' ? 'THUONG_XUYEN' : type === 'giua-ky' ? 'GIUA_KY' : type === 'cuoi-ky' ? 'CUOI_KY' : 'TOT_NGHIEP',
      durationMinutes: isThuongXuyen ? 15 : Math.ceil(questionCount * 1.5), // Approximate duration
      parts,
      shuffleQuestions: true,
      shuffleOptions: true,
      showAnswersAfter: true,
      grade: currentGrade
    };
    addExam(newConfig);

    // Build selected questions
    const pool = allQuestions.filter(q => q.grade_id === currentGrade);
    
    // Naive shuffle
    const shuffleArray = (array: any[]) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    let selectedQuestions = [];
    if (parts.includes('I')) {
      let iQ = pool.filter(q => q.question_type === 'MCQ_SINGLE');
      iQ = shuffleArray(iQ);
      selectedQuestions.push(...iQ.slice(0, questionCount));
    }
    if (parts.includes('II') && !isThuongXuyen) {
      let iiQ = pool.filter(q => q.question_type === 'TRUE_FALSE_GROUP');
      iiQ = shuffleArray(iiQ);
      selectedQuestions.push(...iiQ.slice(0, 4));
    }
    if (parts.includes('III') && !isThuongXuyen) {
      let iiiQ = pool.filter(q => q.question_type === 'SHORT_ANSWER');
      iiiQ = shuffleArray(iiiQ);
      selectedQuestions.push(...iiiQ.slice(0, 6));
    }

    const newVersion = {
      id: uuidv4(),
      examConfigId: newConfig.id,
      questions: selectedQuestions,
    };
    addExamVersion(newVersion);

    const newAttempt = {
      id: uuidv4(),
      examVersionId: newVersion.id,
      studentName: 'Học sinh (Luyện tập)',
      className: 'Tự học',
      startTime: Date.now(),
      endTime: null,
      durationUsed: null,
      answers: {},
      score: null,
      status: 'IN_PROGRESS' as const,
      focusEvents: []
    };
    addAttempt(newAttempt);
    navigate(\`/student/take/\${newAttempt.id}\`);
  };
`;

content = content.replace(/const handleStartPractice \= \(\) \=\> \{[\s\S]*?navigate\(\`\/exam\-preview\/\$\{newConfig\.id\}\`\);\n  \};/, replacement.trim());
fs.writeFileSync('src/pages/PracticeConfig.tsx', content);
