const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf-8');

const replacement = `visual: {
      type: 'VARIATION_TABLE',
      data: {
        xPoints: [
          { type: 'infinity', value: '-\\infty' },
          { type: 'critical', value: '-1' },
          { type: 'critical', value: '1' },
          { type: 'infinity', value: '+\\infty' }
        ],
        derivative: {
          intervals: ['+', '-', '+'],
          criticalValues: ['0', '0']
        },
        function: {
          intervalDirections: ['up', 'down', 'up'],
          pointValues: [
            { x: '-1', y: '4', type: 'local_max' },
            { x: '1', y: '0', type: 'local_min' }
          ],
          leftLimit: '-\\infty',
          rightLimit: '+\\infty'
        }
      }
    }`;

// find the mcq-visual-1 visual block
const regex = /visual:\s*\{\s*type:\s*'VARIATION_TABLE',\s*data:\s*\{[\s\S]*?\}\s*\}\s*\}/;

content = content.replace(regex, replacement);
fs.writeFileSync('src/data/demoQuestions.ts', content);
