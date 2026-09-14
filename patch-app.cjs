const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('migrateData')) {
  const importSanitizer = `import { sanitizeQuestionText } from './utils/textSanitizer';\n`;
  content = content.replace("import { useAppStore } from './store/useAppStore';", importSanitizer + "import { useAppStore } from './store/useAppStore';");
  
  const migrationHook = `
  useEffect(() => {
    // Migration: clean up any existing dirty data in localStorage
    const store = useAppStore.getState();
    let migrated = false;
    
    const cleanQ = (q: any) => {
      const sanitized = sanitizeQuestionText(q.content);
      if (sanitized !== q.content) {
        return { ...q, content: sanitized };
      }
      return q;
    };

    const newQuestions = store.questions.map(cleanQ);
    if (newQuestions.some((q, i) => q !== store.questions[i])) {
      useAppStore.setState({ questions: newQuestions });
      migrated = true;
    }

    const newVersions = store.examVersions.map(ev => {
      let changed = false;
      const nq = ev.questions.map(q => {
        const c = cleanQ(q);
        if (c !== q) changed = true;
        return c;
      });
      return changed ? { ...ev, questions: nq } : ev;
    });
    
    if (newVersions.some((v, i) => v !== store.examVersions[i])) {
      useAppStore.setState({ examVersions: newVersions });
      migrated = true;
    }
  }, []);
`;
  
  content = content.replace("useEffect(() => {", migrationHook + "  useEffect(() => {");
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched App.tsx with migration");
}
