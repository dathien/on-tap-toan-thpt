const fs = require('fs');
let code = fs.readFileSync('src/store/useAppStore.ts', 'utf8');

code = code.replace(
  "(set) => ({\n    (set) => ({",
  "(set) => ({"
);
code = code.replace(
  "isTeacherMode: true,\n      toggleTeacherMode: () => set((state) => ({ isTeacherMode: !state.isTeacherMode })),\n      settings: {",
  "isTeacherMode: true,\n      toggleTeacherMode: () => set((state) => ({ isTeacherMode: !state.isTeacherMode })),\n      settings: {"
);

fs.writeFileSync('src/store/useAppStore.ts', code);
