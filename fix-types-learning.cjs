const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

const newTypes = `
export type LearningStatus = 'SETUP' | 'DIAGNOSTIC' | 'LEARNING' | 'ASSESSMENT' | 'REMEDIATION' | 'COMPLETED';

export interface LearningUnit {
  id: string;
  title: string;
  theory: string[];
  status: 'LOCKED' | 'CURRENT' | 'COMPLETED' | 'REMEDIATION';
  score?: number;
}

export interface LearningSession {
  id: string;
  grade: number;
  topic: string;
  goal: string;
  status: LearningStatus;
  diagnosticResult?: { score: number; weakUnits: string[] };
  units: LearningUnit[];
  currentUnitIndex: number;
  progress: number;
  finalScore?: number;
  startedAt: string;
}
`;

if (!code.includes('LearningSession')) {
  fs.appendFileSync('src/types/index.ts', newTypes);
}
