const fs = require('fs');

// Fix useAppStore.ts
let storeCode = fs.readFileSync('src/store/useAppStore.ts', 'utf8');

if (!storeCode.includes('updateExam:')) {
    storeCode = storeCode.replace(
        "addExam: (exam: ExamConfig) => void;",
        "addExam: (exam: ExamConfig) => void;\n  updateExam: (id: string, updates: Partial<ExamConfig>) => void;"
    );
    storeCode = storeCode.replace(
        "addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),",
        "addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),\n      updateExam: (id, updates) => set((state) => ({ exams: state.exams.map(e => e.id === id ? { ...e, ...updates } : e) })),"
    );
}

if (!storeCode.includes('updateExamVersion:')) {
    storeCode = storeCode.replace(
        "addExamVersion: (version: ExamVersion) => void;",
        "addExamVersion: (version: ExamVersion) => void;\n  updateExamVersion: (id: string, updates: Partial<ExamVersion>) => void;"
    );
    storeCode = storeCode.replace(
        "addExamVersion: (version) => set((state) => ({ examVersions: [...state.examVersions, version] })),",
        "addExamVersion: (version) => set((state) => ({ examVersions: [...state.examVersions, version] })),\n      updateExamVersion: (id, updates) => set((state) => ({ examVersions: state.examVersions.map(v => v.id === id ? { ...v, ...updates } : v) })),"
    );
}

fs.writeFileSync('src/store/useAppStore.ts', storeCode);

// Fix QuestionEditorModal.tsx
let modalCode = fs.readFileSync('src/components/QuestionEditorModal.tsx', 'utf8');
modalCode = modalCode.replace("grade_id: 12,", "grade_id: 12 as any,");
fs.writeFileSync('src/components/QuestionEditorModal.tsx', modalCode);

console.log("Fixed store and modal");
