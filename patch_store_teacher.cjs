const fs = require('fs');
let code = fs.readFileSync('src/store/useAppStore.ts', 'utf8');

if (!code.includes('isTeacherMode')) {
    code = code.replace(
        "interface AppState {",
        "interface AppState {\n  isTeacherMode: boolean;\n  toggleTeacherMode: () => void;"
    );
    code = code.replace(
        "const useAppStore = create<AppState>()(",
        "const useAppStore = create<AppState>()("
    );
    code = code.replace(
        "persist(",
        "persist(\n    (set) => ({"
    );
    // Find the state object start
    code = code.replace(
        "settings: {",
        "isTeacherMode: true,\n      toggleTeacherMode: () => set((state) => ({ isTeacherMode: !state.isTeacherMode })),\n      settings: {"
    );
    fs.writeFileSync('src/store/useAppStore.ts', code);
    console.log("Teacher mode added");
}
