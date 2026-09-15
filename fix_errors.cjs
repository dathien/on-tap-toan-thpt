const fs = require('fs');

// Fix useAppStore.ts
let storePath = 'src/store/useAppStore.ts';
let storeContent = fs.readFileSync(storePath, 'utf8');
storeContent = storeContent.replace("import { AppSettings, Grade, StudentAttempt, ExamConfig, ExamVersion, Question, Class, Student } from '../types';", 
"import { AppSettings, Grade, StudentAttempt, ExamConfig, ExamVersion, Question, Class, Student, GameResult } from '../types';");
fs.writeFileSync(storePath, storeContent);

// Fix demoQuestions.ts
let dqPath = 'src/data/demoQuestions.ts';
let dqContent = fs.readFileSync(dqPath, 'utf8');
dqContent = dqContent.replace(/options: \[/g, "tags: [],\n  options: [");
fs.writeFileSync(dqPath, dqContent);

