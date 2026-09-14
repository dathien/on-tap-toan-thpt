const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

const logicToInject = `
  const generateRoadmapQuestions = () => {
    let reqCounts = { rec: 0, und: 0, app: 0, high: 0 };
    if (selectedAbility === 'WEAK') {
      reqCounts = { rec: 5, und: 2, app: 1, high: 0 };
    } else if (selectedAbility === 'AVERAGE') {
      reqCounts = { rec: 3, und: 4, app: 3, high: 0 };
    } else if (selectedAbility === 'GOOD') {
      reqCounts = { rec: 1, und: 3, app: 5, high: 1 };
    } else if (selectedAbility === 'EXCELLENT') {
      reqCounts = { rec: 0, und: 1, app: 4, high: 5 };
    }

    const availableQs = allQuestions.filter(q => 
        q.grade_id === selectedGrade && 
        q.topic_id === selectedTopic && 
        q.lesson_id === selectedLesson &&
        q.question_type === 'MCQ_SINGLE'
    );

    // Simple distribution fallback
    const selected: Question[] = [];
    const getByDiff = (diff: number, count: number) => {
        let pool = availableQs.filter(q => q.difficulty === diff && !selected.some(s => s.id === q.id));
        if (pool.length < count) {
            // fallback to adjacent
            pool = availableQs.filter(q => Math.abs(q.difficulty - diff) <= 1 && !selected.some(s => s.id === q.id));
        }
        if (pool.length < count) {
            pool = availableQs.filter(q => !selected.some(s => s.id === q.id)); // any
        }
        
        // shuffle pool
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        selected.push(...shuffled.slice(0, count));
    };

    getByDiff(1, reqCounts.rec);
    getByDiff(2, reqCounts.und);
    getByDiff(3, reqCounts.app);
    getByDiff(4, reqCounts.high);

    return selected;
  };

  const handlePreview = () => {
    const qs = generateRoadmapQuestions();
    setProposedQuestions(qs);
    setShowPreview(true);
  };
`;

code = code.replace("  const getQuestions = (count: number) => {", logicToInject + "\n  const getQuestions = (count: number) => {");

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched 3");
