const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

// For diagnostic
code = code.replace(
    /<\/button>\n              <\/div>\n            <\/>\n          \) : \(\n            <div className="text-center py-12">/,
    '</button>\n              </div>\n            </>\n          )) : (\n            <div className="text-center py-12">'
);

// For practice
code = code.replace(
    /<\/button>\n                      <\/div>\n                    <\/>\n                  \) : \(\n                    <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-xl">/,
    '</button>\n                      </div>\n                    </>\n                  )) : (\n                    <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-xl">'
);

// For final
code = code.replace(
    /<\/button>\n              <\/div>\n            <\/>\n          \) : \(\n            <div className="text-center py-12">/, // wait, final looks identical to diagnostic
    '</button>\n              </div>\n            </>\n          )) : (\n            <div className="text-center py-12">'
);


fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Fixed syntax");
