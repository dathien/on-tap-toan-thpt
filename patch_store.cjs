const fs = require('fs');

const storePath = 'src/store/useAppStore.ts';
let content = fs.readFileSync(storePath, 'utf8');

if (!content.includes('gameResults: GameResult[]')) {
  // Add import
  content = content.replace("import { AppSettings, Class, ExamConfig, ExamVersion, Grade, Question, Student, StudentAttempt } from '../types';", 
  "import { AppSettings, Class, ExamConfig, ExamVersion, Grade, Question, Student, StudentAttempt, GameResult } from '../types';");

  // Add to AppState
  content = content.replace("deleteQuestion: (id: string) => void;", 
  "deleteQuestion: (id: string) => void;\n  gameResults: GameResult[];\n  addGameResult: (result: GameResult) => void;");

  // Add to default state
  content = content.replace("deleteQuestion: (id) => set((state) => ({\n        questions: state.questions.filter(q => q.id !== id)\n      })),", 
  "deleteQuestion: (id) => set((state) => ({\n        questions: state.questions.filter(q => q.id !== id)\n      })),\n      gameResults: [],\n      addGameResult: (result) => set((state) => ({ gameResults: [...(state.gameResults || []), result] })),");
  
  fs.writeFileSync(storePath, content);
}
