const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentExam.tsx', 'utf8');

// Add states
code = code.replace(
  "const [isSubmitting, setIsSubmitting] = useState(false);",
  "const [isSubmitting, setIsSubmitting] = useState(false);\n  const [showCheatWarning, setShowCheatWarning] = useState(false);\n  const [tabId] = useState(() => {\n    let id = sessionStorage.getItem('exam_tab_' + attemptId);\n    if (!id) {\n      id = crypto.randomUUID();\n      sessionStorage.setItem('exam_tab_' + attemptId, id);\n    }\n    return id;\n  });"
);

// Add Anti Cheat hook
const antiCheatCode = `
  // Anti-cheat: Multiple tab detection
  useEffect(() => {
    if (!attempt || attempt.status !== 'IN_PROGRESS' || !attemptId) return;

    let isViolationProcessed = false;
    let channel: BroadcastChannel | null = null;
    let heartbeat: NodeJS.Timeout | null = null;

    const handleViolation = (detectedTabId: string) => {
        if (isViolationProcessed) return;
        isViolationProcessed = true;
        
        // Use a functional state update equivalent to get latest attempt state
        // Actually, since we need to update the attempt in the store:
        // We will just read from the current attempt via closure, but it might be stale.
        // It's safer to get it from the store directly if we can, but since this effect depends on currentIndex,
        // we can just use the current question index.
        const currentQ = version?.questions[currentIndex];
        
        if (currentQ) {
            const currentAttempt = useAppStore.getState().attempts.find(a => a.id === attemptId);
            if (currentAttempt) {
                updateAttempt(attemptId, {
                  antiCheatEvents: [
                    ...(currentAttempt.antiCheatEvents || []),
                    { type: 'MULTIPLE_TAB', questionId: currentQ.id, timestamp: Date.now(), tabId: detectedTabId }
                  ],
                  forcedZeroQuestions: {
                    ...(currentAttempt.forcedZeroQuestions || {}),
                    [currentQ.id]: true
                  }
                });
            }
        }
        
        setShowCheatWarning(true);
        
        setTimeout(() => {
            isViolationProcessed = false;
        }, 5000);
    };

    try {
        channel = new BroadcastChannel(\`exam_session_\${attemptId}\`);
        channel.onmessage = (event) => {
            if (event.data && (event.data.type === 'TAB_ACTIVE' || event.data.type === 'HEARTBEAT')) {
                if (event.data.tabId !== tabId) {
                    handleViolation(event.data.tabId);
                }
            }
        };

        channel.postMessage({ type: 'TAB_ACTIVE', attemptId, tabId, timestamp: Date.now() });
        
        heartbeat = setInterval(() => {
            channel?.postMessage({ type: 'HEARTBEAT', attemptId, tabId, timestamp: Date.now() });
            
            // Fallback: localStorage
            const storageKey = \`exam_active_\${attemptId}\`;
            localStorage.setItem(storageKey, JSON.stringify({ tabId, timestamp: Date.now() }));
        }, 3000);
    } catch (e) {
        console.error("Anti-cheat error:", e);
    }
    
    const onStorage = (e: StorageEvent) => {
        const storageKey = \`exam_active_\${attemptId}\`;
        if (e.key === storageKey && e.newValue) {
            try {
                const data = JSON.parse(e.newValue);
                if (data.tabId && data.tabId !== tabId) {
                    if (Date.now() - data.timestamp < 5000) {
                       handleViolation(data.tabId);
                    }
                }
            } catch (err) {}
        }
    };
    
    window.addEventListener('storage', onStorage);
    
    return () => {
        if (channel) channel.close();
        if (heartbeat) clearInterval(heartbeat);
        window.removeEventListener('storage', onStorage);
    };
  }, [attemptId, tabId, attempt?.status, currentIndex, version?.questions]);
`;

code = code.replace(
  "// Anti-cheat: Track visibility",
  antiCheatCode + "\n  // Anti-cheat: Track visibility"
);

// Update gradeAttempt
code = code.replace(
  "const gradeAttempt = (id: string, ans: any, questions: Question[]) => {",
  "const gradeAttempt = (id: string, ans: any, questions: Question[], forcedZero: Record<string, boolean> = {}) => {"
);

code = code.replace(
  "questions.forEach(q => {",
  `questions.forEach(q => {
      if (forcedZero[q.id]) {
        return;
      }`
);

code = code.replace(
  "gradeAttempt(attempt.id, answers, version!.questions);",
  "gradeAttempt(attempt.id, answers, version!.questions, attempt.forcedZeroQuestions || {});"
);

// Add Modal render
const modalCode = `
      {/* Cheat Warning Modal */}
      {showCheatWarning && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-red-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200 border-2 border-red-500">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-2">⚠️ CẢNH BÁO GIAN LẬN</h3>
            <p className="text-slate-600 text-center mb-6">
              Hệ thống phát hiện bài kiểm tra này đang được mở ở nhiều hơn một tab.<br/><br/>
              Nếu tiếp tục sử dụng nhiều tab, câu hỏi bạn đang làm sẽ bị chấm 0 điểm.
            </p>
            <button 
              onClick={() => setShowCheatWarning(false)}
              className="w-full px-5 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              ĐÓNG TAB KHÁC VÀ TIẾP TỤC
            </button>
          </div>
        </div>
      )}
`;

code = code.replace(
  "{/* Submit Modal */}",
  modalCode + "\n\n      {/* Submit Modal */}"
);

fs.writeFileSync('src/pages/StudentExam.tsx', code);
console.log('Done StudentExam');
