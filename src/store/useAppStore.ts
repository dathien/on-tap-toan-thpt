import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, Grade, StudentAttempt, ExamConfig, ExamVersion, Question } from '../types';
import { demoQuestions } from '../data/demoQuestions';

interface AppState {
  settings: AppSettings;
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
