const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

if (!code.includes('useNavigate')) {
    code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useNavigate } from 'react-router-dom';");
}

code = code.replace(/import\s*\{\s*Rocket,\s*Zap,\s*BookOpen,\s*PenTool,\s*CheckCircle2,\s*BarChart2,\s*RotateCcw,\s*ChevronLeft,\s*ArrowRight,\s*Play,\s*CheckCircle\s*\}\s*from\s*'lucide-react';/s, 
"import { Rocket, Zap, BookOpen, PenTool, CheckCircle2, BarChart2, RotateCcw, ChevronLeft, ArrowRight, Play, CheckCircle, Gamepad2, User, FileText } from 'lucide-react';");

code = code.replace(/const \[learningStep, setLearningStep\] = useState<'THEORY' \| 'EXAMPLE' \| 'PRACTICE'>\('THEORY'\);/g, 
"const [learningStep, setLearningStep] = useState<'THEORY' | 'EXAMPLE' | 'PRACTICE'>('THEORY');\n  const [view, setView] = useState<'HOME' | 'SETUP' | 'SESSION'>('HOME');\n  const navigate = useNavigate();");

code = code.replace(/setQuizAnswers\(\{\}\);\n\s*setQuizSubmitted\(false\);/g, "setQuizAnswers({});\n    setQuizSubmitted(false);\n    setView('SESSION');");

fs.writeFileSync('src/pages/Roadmap.tsx', code);
