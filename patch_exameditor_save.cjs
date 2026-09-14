const fs = require('fs');
let code = fs.readFileSync('src/pages/ExamEditor.tsx', 'utf8');

const replacement = `
  const handleSaveQuestion = (mode: 'UPDATE_BANK' | 'ONLY_IN_EXAM', rawQ: Question) => {
     const q = { ...rawQ };
     delete q._importError;
     delete q._importMessage;
     
     if (mode === 'UPDATE_BANK') {
`;

code = code.replace(
    /const handleSaveQuestion = \(mode: 'UPDATE_BANK' \| 'ONLY_IN_EXAM', q: Question\) => \{\s*if \(mode === 'UPDATE_BANK'\) \{/,
    replacement
);

fs.writeFileSync('src/pages/ExamEditor.tsx', code);
console.log("Patched ExamEditor save");
