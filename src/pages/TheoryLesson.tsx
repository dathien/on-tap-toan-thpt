import React from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MathRenderer } from '../components/MathRenderer';
import { QuestionContentRenderer } from '../components/QuestionContentRenderer';
import { VisualRenderer } from '../components/visuals/VisualRenderer';
import { getMockTheory } from '../data/mockTheory';
import { curriculumData } from '../data/curriculum';
import { useAppStore } from '../store/useAppStore';

export function TheoryLesson() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  
  const currentGrade = useAppStore(state => state.currentGrade);
  const topicId = searchParams.get('topic');
  const lessonId = searchParams.get('lesson');

  const topics = curriculumData[currentGrade as keyof typeof curriculumData] || [];
  const topic = topics.find(t => t.id === topicId);
  const lesson = topic?.lessons.find(l => l.id === lessonId);

  const lessonName = lesson?.name || 'Bài học chưa xác định';
  const theory = getMockTheory(lessonName);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(`/review-space/${type}`)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2">
          <ArrowLeft size={20} /> Quay lại Không gian ôn tập
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <div className="text-indigo-200 font-medium mb-2 uppercase tracking-wider">{topic?.name || 'Chủ đề'}</div>
          <h1 className="text-3xl font-bold">{theory.title}</h1>
        </div>
        
        <div className="p-8 space-y-8">
          {theory.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">{section.title}</h3>
              <div className="prose max-w-none text-slate-700">
                <QuestionContentRenderer content={section.content} />
              </div>
              {section.visual && (
                <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-200 flex justify-center">
                  <VisualRenderer visual={section.visual} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <button 
          onClick={() => navigate(`/review-space/${type}/practice?topic=${topicId}&lesson=${lessonId}`)}
          className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          Luyện tập bài này ➔
        </button>
      </div>
    </div>
  );
}
