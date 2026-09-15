/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { sanitizeQuestionText } from './utils/textSanitizer';
import { useAppStore } from './store/useAppStore';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TreasureHunt } from './pages/TreasureHunt';
import { Settings } from './pages/Settings';
import { Review } from './pages/Review';
import { ExamBuilder } from './pages/ExamBuilder';
import { ReviewSpace } from './pages/ReviewSpace';
import { TheoryLesson } from './pages/TheoryLesson';
import { PracticeConfig } from './pages/PracticeConfig';
import { ExamPreview } from './pages/ExamPreview';
import { ExamEditor } from './pages/ExamEditor';
import { CreateExam } from './pages/CreateExam';
import { Bank } from './pages/Bank';
import { QuestionEditor } from './pages/QuestionEditor';
import { WordImport } from './pages/WordImport';
import { StudentLogin } from './pages/StudentLogin';
import { StudentExam } from './pages/StudentExam';
import { StudentResult } from './pages/StudentResult';
import { LiveTracking } from './pages/LiveTracking';
import { MathLab } from './pages/MathLab';
import { ExamList } from './pages/ExamList';
import { Roadmap } from './pages/Roadmap';
import { TeacherResults } from './pages/TeacherResults';
import { ClassManagement } from './pages/ClassManagement';

export default function App() {
  const settings = useAppStore(state => state.settings);
  
  
  useEffect(() => {
    // Migration: clean up any existing dirty data in localStorage
    const store = useAppStore.getState();
    let migrated = false;
    
    const cleanQ = (q: any) => {
      if (!q) return q;
      const sanitized = sanitizeQuestionText(q.content || '');
      if (sanitized !== q.content) {
        return { ...q, content: sanitized };
      }
      return q;
    };

    const newQuestions = store.questions.filter(Boolean).map(cleanQ);
    if (newQuestions.length !== store.questions.length || newQuestions.some((q, i) => q !== store.questions[i])) {
      useAppStore.setState({ questions: newQuestions });
      migrated = true;
    }

    const newVersions = store.examVersions.map(ev => {
      let changed = false;
      const validQuestions = ev.questions.filter(Boolean);
      if (validQuestions.length !== ev.questions.length) changed = true;
      const nq = validQuestions.map(q => {
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
  useEffect(() => {
    document.title = settings.appName;
  }, [settings.appName]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Teacher Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="learning-path" element={<Roadmap />} />
          <Route path="review" element={<Review />} />
          <Route path="review-space/:type" element={<ReviewSpace />} />
          <Route path="review-space/:type/theory" element={<TheoryLesson />} />
          <Route path="review-space/:type/practice" element={<PracticeConfig />} />
          <Route path="builder/:type" element={<ExamBuilder />} />
          <Route path="exam-preview/:configId" element={<ExamPreview />} />
          <Route path="exam-editor/:id" element={<ExamEditor />} />
          <Route path="bank" element={<Bank />} />
          <Route path="question-bank" element={<Bank />} />
          <Route path="bank/import" element={<WordImport />} />
          <Route path="bank/add" element={<QuestionEditor />} />
          <Route path="bank/edit/:id" element={<QuestionEditor />} />
          
          <Route path="exam" element={<LiveTracking />} />
          <Route path="lab" element={<MathLab />} />
          <Route path="treasure" element={<TreasureHunt />} />
          <Route path="create" element={<CreateExam />} />
          <Route path="materials" element={<ExamList />} />
          <Route path="exam-list" element={<ExamList />} />
          <Route path="results" element={<TeacherResults />} />
          <Route path="classes" element={<ClassManagement />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student/exam/:versionId" element={<StudentLogin />} />
        <Route path="/student/take/:attemptId" element={<StudentExam />} />
        <Route path="/student/result/:attemptId" element={<StudentResult />} />
      </Routes>
    </BrowserRouter>
  );
}

