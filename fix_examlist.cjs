const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamList.tsx', 'utf8');

code = code.replace(
`                ) : (
                  <button`,
`                ) : (
                  <div className="flex items-center gap-1">
                  <button`
);

code = code.replace(
`                  </button>
                )}`,
`                  </button>
                  </div>
                )}`
);

fs.writeFileSync('src/pages/ExamList.tsx', code);
