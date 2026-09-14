const fs = require('fs');
let content = fs.readFileSync('src/pages/PracticeConfig.tsx', 'utf-8');

const target = "name: \`Luyện tập: ${scope === 'LESSON' ? lesson?.name : topic?.name}\`,";
const replacement = "name: \`Luyện tập: ${scope === 'LESSON' ? (lesson?.name || 'Bài học') : (topic?.name || 'Chủ đề')}\`,";

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/pages/PracticeConfig.tsx', content);
    console.log("Patched PracticeConfig name successfully");
} else {
    console.log("Could not find the target name string to replace");
}
