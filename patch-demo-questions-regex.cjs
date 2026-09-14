const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf-8');

const regex1 = /data:\s*\{\s*x:\s*\['-\\\\infty',\s*'0',\s*'2',\s*'\+\\\\infty'\],\s*yPrime:.*?\]\s*\}\s*\},/s;
const newVTable1 = `data: {
        xPoints: [
          { type: 'infinity', value: '-\\\\infty' },
          { type: 'critical', value: '0' },
          { type: 'critical', value: '2' },
          { type: 'infinity', value: '+\\\\infty' }
        ],
        derivative: {
          intervals: ['+', '-', '+'],
          criticalValues: ['0', '0']
        },
        function: {
          intervalDirections: ['up', 'down', 'up'],
          pointValues: [
            { x: '0', y: '5', type: 'local_max' },
            { x: '2', y: '1', type: 'local_min' }
          ],
          leftLimit: '-\\\\infty',
          rightLimit: '+\\\\infty'
        }
      }
    },`;

content = content.replace(regex1, newVTable1);

const regex2 = /data:\s*\{\s*x:\s*\['-\\\\infty',\s*'1',\s*'\+\\\\infty'\],\s*yPrime:.*?\]\s*\}\s*\},/s;
const newVTable2 = `data: {
        xPoints: [
          { type: 'infinity', value: '-\\\\infty' },
          { type: 'discontinuity', value: '1' },
          { type: 'infinity', value: '+\\\\infty' }
        ],
        derivative: {
          intervals: ['+', '+'],
          criticalValues: []
        },
        function: {
          intervalDirections: ['up', 'up'],
          pointValues: [
            { x: '1', y: '+\\\\infty', type: 'left_limit' },
            { x: '1', y: '-\\\\infty', type: 'right_limit' }
          ],
          leftLimit: '2',
          rightLimit: '2'
        }
      }
    },`;

content = content.replace(regex2, newVTable2);

fs.writeFileSync('src/data/demoQuestions.ts', content);
