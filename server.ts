import express from 'express';
import path from 'path';
import multer from 'multer';
import JSZip from 'jszip';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use memory storage for fast parsing of uploaded DOCX
  const upload = multer({ storage: multer.memoryStorage() });
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // API Routes
  app.post('/api/parse-docx', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Không tìm thấy file tải lên.' });
      }

      const zip = await JSZip.loadAsync(req.file.buffer);
      const docXml = zip.file('word/document.xml');
      
      if (!docXml) {
        return res.status(400).json({ error: 'File DOCX không hợp lệ: thiếu document.xml' });
      }

      const xmlData = await docXml.async('text');
      
      const prompt = `
Bạn là một trợ lý giáo viên môn Toán. Nhiệm vụ của bạn là đọc nội dung XML từ một file DOCX (chứa mã OMML) và trích xuất tất cả các câu hỏi vào một mảng JSON.
Hãy chuyển đổi mọi công thức toán học OMML (hoặc văn bản toán học) thành chuẩn LaTeX (bọc trong cặp dấu $...$).
Có 3 dạng câu hỏi cần nhận diện:
1. "MCQ_SINGLE": Trắc nghiệm 4 phương án A, B, C, D (chọn 1 đáp án đúng).
2. "TRUE_FALSE_GROUP": Trắc nghiệm Đúng/Sai với 4 ý a, b, c, d.
3. "SHORT_ANSWER": Trắc nghiệm trả lời ngắn (chỉ có một kết quả ngắn gọn).

CHÚ Ý QUAN TRỌNG:
- Trả về ĐÚNG MỘT MẢNG JSON, KHÔNG chứa các ký tự markdown như \`\`\`json.
- Mảng chứa các object có cấu trúc sau:
{
  "question_type": "MCQ_SINGLE" | "TRUE_FALSE_GROUP" | "SHORT_ANSWER",
  "content": "Nội dung câu hỏi (có $LaTeX$)",
  "options": [ { "content": "Nội dung phương án", "isCorrect": boolean } ], // Bắt buộc có nếu là MCQ_SINGLE
  "statements": [ { "content": "Nội dung mệnh đề", "isTrue": boolean } ], // Bắt buộc có nếu là TRUE_FALSE_GROUP
  "correctAnswer": "Giá trị đáp án đúng" // Bắt buộc có nếu là SHORT_ANSWER
}


Ngoài ra, nếu câu hỏi có chứa ảnh hoặc bảng biến thiên/đồ thị, hãy trích xuất thêm trường "visual":
"visual": {
  "type": "NONE" | "IMAGE" | "VARIATION_TABLE" | "FUNCTION_GRAPH" | "GEOMETRY_2D" | "GEOMETRY_3D" | "TABLE" | "OXY" | "OXYZ",
  "source": "Tên file ảnh (nếu có, VD: image1.png)",
  "data": {} // Nếu là VARIATION_TABLE (JSON mô tả xPoints, derivative, function) hoặc đồ thị
}

Nếu có bảng biến thiên, dùng "type": "VARIATION_TABLE" và điền dữ liệu vào "data" theo cấu trúc:
{ "xPoints": [{ "type": "infinity" | "critical" | "discontinuity", "value": "-\infty" }], "derivative": { "intervals": ["+", "-"], "criticalValues": ["0"] }, "function": { "intervalDirections": ["up", "down"], "pointValues": [{ "x": "0", "y": "1", "type": "local_max" | "local_min" | "inflection" | "left_limit" | "right_limit" }], "leftLimit": "-\infty", "rightLimit": "-\infty" } }
LƯU Ý: Không được gom ảnh xuống cuối nếu nó nằm giữa câu hỏi.

Đây là nội dung XML (bạn cần phân tích OMML <m:oMath> thành LaTeX, tìm <v:imagedata> hoặc <a:blip> để xác định hình ảnh, và tìm <w:tbl> để xác định bảng):
${xmlData.substring(0, 80000)}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "[]";
      let parsed = [];
      try {
        parsed = JSON.parse(text);
      } catch(e) {
        // Fallback cleanup if response somehow contains markdown
        const cleaned = text.replace(/^```json\n/, '').replace(/\n```$/, '');
        parsed = JSON.parse(cleaned);
      }
      
      res.json({ questions: parsed });
    } catch (error: any) {
      console.error("Error parsing docx:", error);
      res.status(500).json({ error: error.message || 'Lỗi hệ thống khi phân tích file' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
