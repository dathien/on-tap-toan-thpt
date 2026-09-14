const fs = require('fs');
let content = fs.readFileSync('src/pages/QuestionEditor.tsx', 'utf-8');

// Add import
if (!content.includes('VariationTableEditor')) {
  content = content.replace("import { VisualRenderer } from '../components/visuals/VisualRenderer';", "import { VisualRenderer } from '../components/visuals/VisualRenderer';\nimport { VariationTableEditor } from '../components/visuals/VariationTableEditor';\nimport { validateVariationTable } from '../components/visuals/VariationTable';");
}

// Replace visual editor area
const oldVisualEditor = `{tempVisualType !== 'NONE' && (
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Dữ liệu cấu hình (JSON)</label>
                     <textarea value={tempVisualData} onChange={e => setTempVisualData(e.target.value)} rows={6} className="w-full p-2 font-mono text-sm rounded-xl border border-slate-300" placeholder={\`{
  "type": "\${tempVisualType}",
  "source": "https...",
  "data": {}
}\`} />
                  </div>
                )}`;

const newVisualEditor = `{tempVisualType === 'VARIATION_TABLE' ? (
                  <VariationTableEditor value={tempVisualData} onChange={setTempVisualData} />
                ) : tempVisualType !== 'NONE' ? (
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Dữ liệu cấu hình (JSON)</label>
                     <textarea value={tempVisualData} onChange={e => setTempVisualData(e.target.value)} rows={6} className="w-full p-2 font-mono text-sm rounded-xl border border-slate-300" placeholder={\`{
  "type": "\${tempVisualType}",
  "source": "https...",
  "data": {}
}\`} />
                  </div>
                ) : null}`;

content = content.replace(oldVisualEditor, newVisualEditor);

const oldSaveVisual = `try {
                      if (tempVisualType === 'NONE') { setVisual(undefined); }
                      else { setVisual(JSON.parse(tempVisualData)); }
                      setShowVisualEditor(false);
                    } catch(e) { alert('JSON không hợp lệ'); }`;

const newSaveVisual = `try {
                      if (tempVisualType === 'NONE') { setVisual(undefined); }
                      else { 
                        const parsed = JSON.parse(tempVisualData);
                        if (tempVisualType === 'VARIATION_TABLE' && !validateVariationTable(parsed.data)) {
                          alert('Bảng biến thiên chưa đủ dữ liệu. Vui lòng kiểm tra lại cấu trúc JSON.');
                          return;
                        }
                        setVisual(parsed); 
                      }
                      setShowVisualEditor(false);
                    } catch(e) { alert('JSON không hợp lệ'); }`;

content = content.replace(oldSaveVisual, newSaveVisual);

fs.writeFileSync('src/pages/QuestionEditor.tsx', content);
console.log("Patched QuestionEditor.tsx");
