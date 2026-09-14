const fs = require('fs');
let code = fs.readFileSync('src/store/useAppStore.ts', 'utf8');

if (!code.includes('classes: Class[]')) {
  // Add imports
  code = code.replace(
    "import { AppSettings, Grade, StudentAttempt, ExamConfig, ExamVersion, Question } from '../types';",
    "import { AppSettings, Grade, StudentAttempt, ExamConfig, ExamVersion, Question, Class, Student } from '../types';"
  );
  
  // Add interface properties
  code = code.replace(
    '  settings: AppSettings;',
    `  settings: AppSettings;
  classes: Class[];
  addClass: (cls: Class) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  students: Student[];
  addStudent: (st: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;`
  );
  
  // Add implementations
  code = code.replace(
    '      settings: {',
    `      classes: [],
      addClass: (cls) => set((state) => ({ classes: [...state.classes, cls] })),
      updateClass: (id, updates) => set((state) => ({ classes: state.classes.map(c => c.id === id ? { ...c, ...updates } : c) })),
      deleteClass: (id) => set((state) => ({ classes: state.classes.filter(c => c.id !== id) })),
      students: [],
      addStudent: (st) => set((state) => ({ students: [...state.students, st] })),
      updateStudent: (id, updates) => set((state) => ({ students: state.students.map(s => s.id === id ? { ...s, ...updates } : s) })),
      deleteStudent: (id) => set((state) => ({ students: state.students.filter(s => s.id !== id) })),
      settings: {`
  );

  fs.writeFileSync('src/store/useAppStore.ts', code);
}
