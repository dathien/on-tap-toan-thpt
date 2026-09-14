const fs = require('fs');
let el = fs.readFileSync('src/pages/ExamList.tsx', 'utf8');
if (!el.includes("import { curriculumData }")) {
    el = el.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport { curriculumData } from '../data/curriculum';");
    fs.writeFileSync('src/pages/ExamList.tsx', el);
}

let se = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');
if (!se.includes("import { curriculumData }")) {
    se = se.replace("import { useParams, useNavigate } from 'react-router-dom';", "import { useParams, useNavigate } from 'react-router-dom';\nimport { curriculumData } from '../data/curriculum';");
    fs.writeFileSync('src/pages/StudentExam.tsx', se);
}
console.log("Fixed imports");
