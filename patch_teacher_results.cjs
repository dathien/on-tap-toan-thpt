const fs = require('fs');
let code = fs.readFileSync('src/pages/TeacherResults.tsx', 'utf8');

// We need to replace the students, exams, and attempts assignments
const searchStr = `  const students = isDemoMode ? DEMO_STUDENTS : [];
  const exams: any[] = isDemoMode ? DEMO_EXAMS : store.exams;
  const attempts = isDemoMode ? DEMO_ATTEMPTS : store.attempts;`;

const replaceStr = `  const exams: any[] = isDemoMode ? DEMO_EXAMS : store.exams;
  
  const attempts = useMemo(() => {
    if (isDemoMode) return DEMO_ATTEMPTS;
    return store.attempts.filter((a: any) => a.status !== 'IN_PROGRESS').map((a: any) => {
      const version = store.examVersions.find((v: any) => v.id === a.examVersionId);
      return {
        ...a,
        studentId: a.studentName + '-' + a.className,
        examId: version ? version.examConfigId : a.examVersionId,
        date: new Date(a.endTime || a.startTime).toISOString(),
        timeSpent: a.durationUsed || (a.endTime ? Math.floor((a.endTime - a.startTime) / 60000) : 0),
        score: a.score || 0
      };
    });
  }, [isDemoMode, store.attempts, store.examVersions]);

  const students = useMemo(() => {
    if (isDemoMode) return DEMO_STUDENTS;
    const studentMap = new Map();
    attempts.forEach((a: any) => {
      if (!studentMap.has(a.studentId)) {
        studentMap.set(a.studentId, {
          id: a.studentId,
          name: a.studentName,
          classId: a.className,
          isDemo: false
        });
      }
    });
    return Array.from(studentMap.values());
  }, [isDemoMode, attempts]);`;

if (code.includes(searchStr)) {
  code = code.replace(searchStr, replaceStr);
  fs.writeFileSync('src/pages/TeacherResults.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find search string");
}
