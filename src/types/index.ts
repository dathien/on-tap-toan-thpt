export type Grade = 10 | 11 | 12;

export type QuestionType = 'MCQ_SINGLE' | 'TRUE_FALSE_GROUP' | 'SHORT_ANSWER';

export type VisualType = 'NONE' | 'IMAGE' | 'VARIATION_TABLE' | 'FUNCTION_GRAPH' | 'GEOMETRY_2D' | 'GEOMETRY_3D' | 'TABLE' | 'OXY' | 'OXYZ';

export interface VisualConfig {
  type: VisualType;
  source?: string;
  data?: any;
  alt?: string;
  width?: string;
  aspectRatio?: string;
}

export interface BaseQuestion {
  id: string;
  subject_id: string;
  grade_id: Grade;
  topic_id: string;
  lesson_id: string;
  question_type: QuestionType;
  difficulty: 1 | 2 | 3 | 4; // 1: Nhận biết, 2: Thông hiểu, 3: Vận dụng, 4: Vận dụng cao
  content: string; // LaTeX content
  visual?: VisualConfig;
  tags: string[];
}

export interface McqOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface McqQuestion extends BaseQuestion {
  question_type: 'MCQ_SINGLE';
  options: McqOption[];
}

export interface TrueFalseStatement {
  id: string;
  content: string;
  isTrue: boolean;
}

export interface TrueFalseGroupQuestion extends BaseQuestion {
  question_type: 'TRUE_FALSE_GROUP';
  statements: TrueFalseStatement[]; // Normally 4 statements a, b, c, d
}

export interface ShortAnswerQuestion extends BaseQuestion {
  question_type: 'SHORT_ANSWER';
  correctAnswer: string;
}

export type Question = McqQuestion | TrueFalseGroupQuestion | ShortAnswerQuestion;

export interface ExamConfig {
  id: string;
  name: string;
  type: 'THUONG_XUYEN' | 'GIUA_KY' | 'CUOI_KY' | 'TOT_NGHIEP';
  durationMinutes: number;
  parts: ('I' | 'II' | 'III')[];
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showAnswersAfter: boolean;
  grade: Grade;
}

export interface ExamVersion {
  id: string;
  examConfigId: string;
  questions: Question[]; // Shuffled and selected questions
}

export interface StudentAttempt {
  id: string;
  examVersionId: string;
  studentName: string;
  className: string;
  startTime: number; // timestamp
  endTime: number | null;
  durationUsed: number | null;
  answers: Record<string, string | Record<string, boolean>>; // questionId -> answer
  score: number | null;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED';
  focusEvents: { event: 'blur' | 'focus'; timestamp: number }[];
}

export interface AppSettings {
  appName: string;
  appShortName: string;
  description: string;
  schoolYear: string;
}
