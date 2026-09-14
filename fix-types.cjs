const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

if (!code.includes('export interface Class {')) {
  code += `\n
export interface Class {
  id: string;
  name: string;
  grade: Grade | string | number;
  schoolYear: string;
  isDemo?: boolean;
  description?: string;
}

export interface Student {
  id: string;
  fullName: string;
  classId: string;
  code?: string;
  isDemo?: boolean;
}
`;
  fs.writeFileSync('src/types/index.ts', code);
}
