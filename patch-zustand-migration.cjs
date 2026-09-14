const fs = require('fs');
let content = fs.readFileSync('src/store/useAppStore.ts', 'utf-8');

// I will add a migration logic or just update the version in persist config.
// Or I can add a migration function.
const persistRegex = /name:\s*'gvbm-storage',/;
content = content.replace(persistRegex, "name: 'gvbm-storage',\n      version: 1,\n      migrate: (persistedState: any, version: number) => {\n        if (version === 0) {\n          // Reset questions to demoQuestions if migrating from v0 to v1\n          persistedState.questions = demoQuestions;\n        }\n        return persistedState;\n      },");

fs.writeFileSync('src/store/useAppStore.ts', content);
