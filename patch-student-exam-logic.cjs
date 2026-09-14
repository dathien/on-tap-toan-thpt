const fs = require('fs');
let content = fs.readFileSync('src/pages/StudentExam.tsx', 'utf-8');

const regex = /const handleAutoSubmit = useCallback\(\(\) => \{[\s\S]*?const gradeAttempt = \(id: string, ans: any, questions: Question\[\]\) => \{/m;

const newLogic = `
  const handleConfirmSubmit = useCallback((isAuto: boolean = false) => {
    if (!attempt || attempt.status !== 'IN_PROGRESS' || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      updateAttempt(attempt.id, {
        status: isAuto ? 'AUTO_SUBMITTED' : 'SUBMITTED',
        endTime: Date.now(),
        answers
      });
      
      gradeAttempt(attempt.id, answers, version!.questions);
      navigate(\`/student/result/\${attempt.id}\`, { replace: true });
    } catch (error) {
      console.error("SUBMIT_EXAM_ERROR", error);
      alert("Không thể nộp bài. Vui lòng thử lại.");
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  }, [attempt, answers, updateAttempt, version, navigate, isSubmitting]);

  const handleAutoSubmit = useCallback(() => {
    handleConfirmSubmit(true);
  }, [handleConfirmSubmit]);

  const handleSubmit = () => {
    if (attempt?.status !== 'IN_PROGRESS') return;
    setShowSubmitModal(true);
  };

  const gradeAttempt = (id: string, ans: any, questions: Question[]) => {`;

content = content.replace(regex, newLogic);
fs.writeFileSync('src/pages/StudentExam.tsx', content);
