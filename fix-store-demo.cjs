const fs = require('fs');
let code = fs.readFileSync('src/store/useAppStore.ts', 'utf8');

const demoClasses = `
const DEMO_CLASSES: Class[] = [
  { id: 'c_10a1', name: '10A1', grade: 10, schoolYear: '2026-2027', isDemo: true, description: 'Lớp chọn khối 10' },
  { id: 'c_11a1', name: '11A1', grade: 11, schoolYear: '2026-2027', isDemo: true, description: 'Lớp chọn khối 11' },
  { id: 'c_12a1', name: '12A1', grade: 12, schoolYear: '2026-2027', isDemo: true, description: 'Lớp mũi nhọn khối 12' },
];

const DEMO_STUDENTS: Student[] = [
  { id: 's1', fullName: 'Nguyễn Minh Anh', classId: 'c_12a1', code: '12A1-001', isDemo: true },
  { id: 's2', fullName: 'Trần Gia Bảo', classId: 'c_12a1', code: '12A1-002', isDemo: true },
  { id: 's3', fullName: 'Lê Hoàng Nam', classId: 'c_12a1', code: '12A1-003', isDemo: true },
  { id: 's4', fullName: 'Phạm Ngọc Hà', classId: 'c_12a1', code: '12A1-004', isDemo: true },
  { id: 's5', fullName: 'Võ Minh Khang', classId: 'c_12a1', code: '12A1-005', isDemo: true },
  { id: 's6', fullName: 'Nguyễn Khánh Linh', classId: 'c_12a1', code: '12A1-006', isDemo: true },
  { id: 's7', fullName: 'Trần Quốc Huy', classId: 'c_12a1', code: '12A1-007', isDemo: true },
  { id: 's8', fullName: 'Lê Thảo My', classId: 'c_12a1', code: '12A1-008', isDemo: true },
  { id: 's9', fullName: 'Phạm Đức Anh', classId: 'c_12a1', code: '12A1-009', isDemo: true },
  { id: 's10', fullName: 'Hoàng Gia Hân', classId: 'c_12a1', code: '12A1-010', isDemo: true },
];
`;

if (!code.includes('DEMO_CLASSES')) {
  code = code.replace(
    "import { demoQuestions } from '../data/demoQuestions';",
    "import { demoQuestions } from '../data/demoQuestions';\n" + demoClasses
  );
  
  code = code.replace('classes: [],', 'classes: DEMO_CLASSES,');
  code = code.replace('students: [],', 'students: DEMO_STUDENTS,');
  
  fs.writeFileSync('src/store/useAppStore.ts', code);
}
