const fs = require('fs');

const typesPath = 'src/types/index.ts';
let content = fs.readFileSync(typesPath, 'utf8');

const newType = `
export interface GameResult {
  id: string;
  activityType: 'GAME';
  gameType: 'TREASURE';
  gradeId: number;
  topicId: string;
  lessonId: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  xp: number;
  duration: number;
  playedAt: number;
}
`;

if (!content.includes('export interface GameResult')) {
  content += newType;
  fs.writeFileSync(typesPath, content);
}
