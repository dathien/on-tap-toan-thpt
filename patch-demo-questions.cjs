const fs = require('fs');
let content = fs.readFileSync('src/data/demoQuestions.ts', 'utf-8');

// Replacement 1: Cubic function variation table
const oldVTable1 = `        x: ['-\\\\infty', '0', '2', '+\\\\infty'],
        yPrime: ['+', '0', '-', '0', '+'],
        y: [
          { value: '-\\\\infty', left: '0%', top: '100%' },
          { value: '5', left: '33%', top: '0%' },
          { value: '1', left: '66%', top: '100%' },
          { value: '+\\\\infty', left: '100%', top: '0%' }
        ],
        arrows: [
          { x1: '10%', y1: '90%', x2: '25%', y2: '10%' },
          { x1: '40%', y1: '10%', x2: '60%', y2: '90%' },
          { x1: '75%', y1: '90%', x2: '90%', y2: '10%' }
        ]`;

const newVTable1 = `        xPoints: [
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
        }`;

content = content.replace(oldVTable1, newVTable1);

// Replacement 2: Rational function variation table
const oldVTable2 = `        x: ['-\\\\infty', '1', '+\\\\infty'],
        yPrime: ['+', '||', '+'],
        y: [
          { value: '2', left: '0%', top: '100%' },
          { value: '+\\\\infty', left: '45%', top: '0%' },
          { value: '||', left: '50%', top: '0%' },
          { value: '-\\\\infty', left: '55%', top: '100%' },
          { value: '2', left: '100%', top: '0%' }
        ],
        arrows: [
          { x1: '10%', y1: '90%', x2: '40%', y2: '10%' },
          { x1: '60%', y1: '90%', x2: '90%', y2: '10%' }
        ]`;

const newVTable2 = `        xPoints: [
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
        }`;

content = content.replace(oldVTable2, newVTable2);
fs.writeFileSync('src/data/demoQuestions.ts', content);
console.log("Patched demoQuestions.ts");
