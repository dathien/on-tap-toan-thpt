import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, Grade, StudentAttempt, ExamConfig, ExamVersion, Question, Class, Student } from '../types';
import { demoQuestions } from '../data/demoQuestions';

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


interface AppState {
  settings: AppSettings;
  classes: Class[];
  addClass: (cls: Class) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  students: Student[];
  addStudent: (st: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  
  currentGrade: Grade;
  setCurrentGrade: (grade: Grade) => void;

  attempts: StudentAttempt[];
  addAttempt: (attempt: StudentAttempt) => void;
  updateAttempt: (id: string, updates: Partial<StudentAttempt>) => void;

  exams: ExamConfig[];
  addExam: (exam: ExamConfig) => void;
  deleteExam: (id: string) => void;

  examVersions: ExamVersion[];
  addExamVersion: (version: ExamVersion) => void;

  questions: Question[];
  addQuestion: (q: Question) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      classes: DEMO_CLASSES,
      addClass: (cls) => set((state) => ({ classes: [...state.classes, cls] })),
      updateClass: (id, updates) => set((state) => ({ classes: state.classes.map(c => c.id === id ? { ...c, ...updates } : c) })),
      deleteClass: (id) => set((state) => ({ classes: state.classes.filter(c => c.id !== id) })),
      students: DEMO_STUDENTS,
      addStudent: (st) => set((state) => ({ students: [...state.students, st] })),
      updateStudent: (id, updates) => set((state) => ({ students: state.students.map(s => s.id === id ? { ...s, ...updates } : s) })),
      deleteStudent: (id) => set((state) => ({ students: state.students.filter(s => s.id !== id) })),
      settings: {
        appName: 'TRỢ LÝ GV TOÁN',
        appShortName: 'GV TOÁN',
        description: 'Hệ thống hỗ trợ kiểm tra và đánh giá môn Toán THPT',
        schoolYear: '2026-2027',
      },
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      
      currentGrade: 12,
      setCurrentGrade: (grade) => set({ currentGrade: grade }),

      attempts: [],
      addAttempt: (attempt) => set((state) => ({ attempts: [...state.attempts, attempt] })),
      updateAttempt: (id, updates) =>
        set((state) => ({
          attempts: state.attempts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),

      exams: [],
      addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
      deleteExam: (id) => set((state) => ({
        exams: state.exams.filter(e => e.id !== id),
        examVersions: state.examVersions.filter(v => v.examConfigId !== id)
      })),

      examVersions: [],
      addExamVersion: (version) => set((state) => ({ examVersions: [...state.examVersions, version] })),

      questions: demoQuestions,
      addQuestion: (q) => set((state) => ({ questions: [q, ...state.questions] })),
      updateQuestion: (id, updates) => set((state) => ({
        questions: state.questions.map(q => q.id === id ? { ...q, ...updates } as Question : q)
      })),
      deleteQuestion: (id) => set((state) => ({
        questions: state.questions.filter(q => q.id !== id)
      })),
    }),
    {
      name: 'gvbm-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Reset questions to demoQuestions if migrating from v0 to v1
          persistedState.questions = demoQuestions;
        }
        return persistedState;
      },
    }
  )
);
