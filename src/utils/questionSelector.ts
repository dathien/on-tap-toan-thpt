import { Question } from '../types';

export interface QuestionFilter {
    gradeId?: number;
    topicId?: string;
    topicIds?: string[];
    lessonId?: string;
    lessonIds?: string[];
    questionTypes?: string[];
    difficulty?: number | number[];
    count?: number;
}

// Simple shuffle
export function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

export function getQuestions(allQuestions: Question[], filter: QuestionFilter): Question[] {
    let filtered = allQuestions;

    if (filter.gradeId !== undefined) {
        filtered = filtered.filter(q => q.grade_id === filter.gradeId);
    }
    
    // Strict exact match for topic and lesson
    if (filter.topicId !== undefined) {
        filtered = filtered.filter(q => q.topic_id === filter.topicId);
    } else if (filter.topicIds && filter.topicIds.length > 0) {
        filtered = filtered.filter(q => filter.topicIds!.includes(q.topic_id));
    }
    
    if (filter.lessonId !== undefined) {
        filtered = filtered.filter(q => q.lesson_id === filter.lessonId);
    } else if (filter.lessonIds && filter.lessonIds.length > 0) {
        filtered = filtered.filter(q => filter.lessonIds!.includes(q.lesson_id));
    }
    
    if (filter.questionTypes && filter.questionTypes.length > 0) {
        filtered = filtered.filter(q => filter.questionTypes!.includes(q.question_type));
    }
    
    if (filter.difficulty !== undefined) {
        if (Array.isArray(filter.difficulty)) {
            filtered = filtered.filter(q => (filter.difficulty as number[]).includes(q.difficulty));
        } else {
            filtered = filtered.filter(q => q.difficulty === filter.difficulty);
        }
    }
    
    // Shuffle pool before selecting
    filtered = shuffleArray(filtered);

    if (filter.count !== undefined && filter.count > 0) {
        return filtered.slice(0, filter.count);
    }
    
    return filtered;
}
