const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

let lines = code.split('\n');

// 1149: ) : ( -> )) : (
// 1357: ) : ( -> )) : (

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("NỘP BÀI LUYỆN TẬP")) {
        // find the next ") : ("
        for (let j = i; j < i + 10; j++) {
            if (lines[j].includes(") : (")) {
                lines[j] = lines[j].replace(") : (", ")) : (");
                break;
            }
        }
    }
    
    if (lines[i].includes("NỘP BÀI KIỂM TRA")) {
        // find the next ") : ("
        for (let j = i; j < i + 10; j++) {
            if (lines[j].includes(") : (")) {
                lines[j] = lines[j].replace(") : (", ")) : (");
                break;
            }
        }
    }
}

fs.writeFileSync('src/pages/Roadmap.tsx', lines.join('\n'));
console.log("Fixed syntax 2");
