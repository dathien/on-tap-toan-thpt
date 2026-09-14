const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /const q1 = storedQuestions\.find\(q => q\.id === 'mcq-1'\);[\s\S]*?if \(!q1\) \{[\s\S]*?useAppStore\.setState\(\{ questions: \[\.\.\.storedQuestions, \.\.\.demoQuestions\] \}\);[\s\S]*?\}/;

// If the old mcq-visual-1 doesn't have valid derivative.pointValues, it should be re-seeded.
const replacement = `
      // Check if mcq-visual-1 is updated
      const qv1 = storedQuestions.find(q => q.id === 'mcq-visual-1');
      const isOutdated = qv1?.visual?.data?.derivative?.criticalValues !== undefined;
      
      if (!qv1 || isOutdated) {
         // Replace with fresh demoQuestions
         const filtered = storedQuestions.filter(q => !demoQuestions.some(dq => dq.id === q.id));
         useAppStore.setState({ questions: [...filtered, ...demoQuestions] });
      }
`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
