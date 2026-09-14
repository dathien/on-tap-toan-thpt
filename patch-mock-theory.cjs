const fs = require('fs');
let content = fs.readFileSync('src/data/mockTheory.ts', 'utf-8');

const newData = `{
            xPoints: [
              { type: "infinity", value: "-\\infty" },
              { type: "critical", value: "-1" },
              { type: "critical", value: "1" },
              { type: "infinity", value: "+\\infty" }
            ],
            derivative: {
              intervals: ["+", "-", "+"],
              criticalValues: ["0", "0"]
            },
            function: {
              intervalDirections: ["up", "down", "up"],
              pointValues: [
                { x: "-1", y: "4", type: "local_max" },
                { x: "1", y: "0", type: "local_min" }
              ],
              leftLimit: "-\\infty",
              rightLimit: "+\\infty"
            }
          }`;

const oldDataRegex = /data:\s*\{\s*x:\s*\[.*\s*yPrime:\s*\[.*\s*y:\s*\[.*\s*trends:\s*\[[\s\S]*?\]\s*\}/m;
content = content.replace(oldDataRegex, `data: ${newData}`);

fs.writeFileSync('src/data/mockTheory.ts', content);
