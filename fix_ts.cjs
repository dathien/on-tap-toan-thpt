const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf8');

// fix question_type casting
content = content.replace(/question_type: 'MCQ_SINGLE',/g, "question_type: 'MCQ_SINGLE' as const,");
content = content.replace(/grade_id: 10,/g, "grade_id: 10 as const,");
content = content.replace(/grade_id: 11,/g, "grade_id: 11 as const,");
content = content.replace(/difficulty: \(i % 4\) \+ 1,/g, "difficulty: ((i % 4) + 1) as 1|2|3|4,");

// remove all "tags: []," if they appear
content = content.replace(/tags: \[\],\n/g, "");

// remove duplicate "tags:" that might still remain due to spacing
let lines = content.split('\n');
let newLines = [];
let seenTags = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('tags: [')) {
    if (!seenTags) {
      newLines.push(lines[i]);
      seenTags = true;
    }
  } else if (lines[i].includes('},') || lines[i].includes('})')) {
    seenTags = false;
    newLines.push(lines[i]);
  } else {
    newLines.push(lines[i]);
  }
}

fs.writeFileSync('src/data/demoQuestions.ts', newLines.join('\n'));
