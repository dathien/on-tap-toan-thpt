const fs = require('fs');
let content = fs.readFileSync('src/pages/QuestionEditor.tsx', 'utf-8');

// I will just use text replacement for exactly this part:
const badPart = `  };

   
    navigate('/bank');
  };`;
const goodPart = `  };`;

content = content.replace(badPart, goodPart);
fs.writeFileSync('src/pages/QuestionEditor.tsx', content);
