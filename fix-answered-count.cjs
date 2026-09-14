const fs = require('fs');
let content = fs.readFileSync('src/pages/StudentExam.tsx', 'utf-8');

const calcStr = `
  const answeredCount = useMemo(() => {
    if (!version) return 0;
    return version.questions.filter(q => {
      if (q.question_type === 'TRUE_FALSE_GROUP') {
        const tf = q as TrueFalseGroupQuestion;
        return tf.statements.every(s => answers[q.id]?.[s.id] !== undefined);
      }
      return answers[q.id] !== undefined && answers[q.id].toString().trim() !== '';
    }).length;
  }, [answers, version]);
`;

content = content.replace(/  const \[isSubmitting, setIsSubmitting\] = useState\(false\);/, '  const [isSubmitting, setIsSubmitting] = useState(false);\n' + calcStr);

content = content.replace(/Object\.keys\(answers\)\.length/g, "answeredCount");

fs.writeFileSync('src/pages/StudentExam.tsx', content);
