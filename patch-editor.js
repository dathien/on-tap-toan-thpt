const fs = require('fs');

let content = fs.readFileSync('src/pages/QuestionEditor.tsx', 'utf-8');

// Add imports
content = content.replace(
  "import { Trash2, Plus } from 'lucide-react';",
  "import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';\nimport { VisualRenderer } from '../components/visuals/VisualRenderer';\nimport { VisualType, VisualConfig } from '../types';"
);

// Add state
const statePattern = "const [shortAnswer, setShortAnswer] = useState<string>(\n    existingQuestion?.question_type === 'SHORT_ANSWER' ? existingQuestion.correctAnswer : ''\n  );";
const newStates = `
  const [visual, setVisual] = useState<VisualConfig | undefined>(existingQuestion?.visual);
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [tempVisualType, setTempVisualType] = useState<VisualType>('NONE');
  const [tempVisualData, setTempVisualData] = useState<string>('');
`;
content = content.replace(statePattern, statePattern + newStates);

// Add visual block after content editor
const contentEditorPattern = "className=\"w-full flex-1 min-h-[200px] px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y\"\n            />\n          </div>";

const visualEditorUI = `
          {/* Visual Editor */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><ImageIcon size={20} /> Hình minh họa</h3>
              {!visual || visual.type === 'NONE' ? (
                <button type="button" onClick={() => { setShowVisualEditor(true); setTempVisualType('IMAGE'); }} className="text-indigo-600 font-bold text-sm hover:underline">+ THÊM HÌNH</button>
              ) : (
                <div className="flex gap-4">
                  <button type="button" onClick={() => { setShowVisualEditor(true); setTempVisualType(visual.type); setTempVisualData(JSON.stringify(visual, null, 2)); }} className="text-indigo-600 font-bold text-sm hover:underline">CHỈNH SỬA HÌNH</button>
                  <button type="button" onClick={() => setVisual(undefined)} className="text-red-600 font-bold text-sm hover:underline">XÓA HÌNH</button>
                </div>
              )}
            </div>
            
            {visual && visual.type !== 'NONE' && !showVisualEditor && (
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <VisualRenderer visual={visual} />
              </div>
            )}
            
            {showVisualEditor && (
              <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50/50 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại hình</label>
                  <select value={tempVisualType} onChange={(e) => setTempVisualType(e.target.value as VisualType)} className="w-full p-2 rounded-xl border border-slate-300">
                    <option value="NONE">Không có</option>
                    <option value="IMAGE">Tải ảnh (hoặc URL)</option>
                    <option value="VARIATION_TABLE">Bảng biến thiên</option>
                    <option value="FUNCTION_GRAPH">Đồ thị hàm số</option>
                    <option value="GEOMETRY_2D">Hình học 2D</option>
                    <option value="GEOMETRY_3D">Hình học 3D</option>
                    <option value="OXY">Oxy</option>
                    <option value="OXYZ">Oxyz</option>
                  </select>
                </div>
                {tempVisualType !== 'NONE' && (
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Dữ liệu cấu hình (JSON)</label>
                     <textarea value={tempVisualData} onChange={e => setTempVisualData(e.target.value)} rows={6} className="w-full p-2 font-mono text-sm rounded-xl border border-slate-300" placeholder={'{\n  "type": "' + tempVisualType + '",\n  "source": "https...",\n  "data": {}\n}'} />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowVisualEditor(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600">Hủy</button>
                  <button type="button" onClick={() => {
                    try {
                      if (tempVisualType === 'NONE') { setVisual(undefined); }
                      else { setVisual(JSON.parse(tempVisualData)); }
                      setShowVisualEditor(false);
                    } catch(e) { alert('JSON không hợp lệ'); }
                  }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">Lưu hình</button>
                </div>
              </div>
            )}
          </div>
`;
content = content.replace(contentEditorPattern, contentEditorPattern + visualEditorUI);

// Update preview section
const previewPattern = "<MathText text={content || 'Chưa có nội dung'} />\n            </div>";
content = content.replace(previewPattern, previewPattern.replace('</div>', '  <VisualRenderer visual={visual} />\n            </div>'));

// Update handleSave to include visual
content = content.replace("content: content,", "content: content,\n      visual: visual,");

fs.writeFileSync('src/pages/QuestionEditor.tsx', content);
