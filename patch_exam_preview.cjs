const fs = require('fs');
let content = fs.readFileSync('src/pages/ExamPreview.tsx', 'utf-8');

// 1. Add state variable
content = content.replace(
  'const [errorDetails, setErrorDetails] = useState<{ part: string, required: number, actual: number } | null>(null);',
  `const [errorDetails, setErrorDetails] = useState<{ part: string, required: number, actual: number } | null>(null);
  const [copied, setCopied] = useState(false);`
);

// 2. Add copy functions right before return statements
const returnStatement = `  if (!examConfig) return <div>Đề không tồn tại.</div>;`;

const copyFunctions = `
  const studentLink = versionId ? \`\${window.location.origin}/student/exam/\${versionId}\` : '';

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!success) {
      throw new Error("execCommand copy failed");
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleCopyLink = async () => {
    if (!studentLink) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(studentLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
      fallbackCopy(studentLink);
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      try {
        fallbackCopy(studentLink);
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
        alert("Sao chép liên kết thất bại. Bạn có thể copy thủ công link sau:\\n\\n" + studentLink);
      }
    }
  };

  if (!examConfig) return <div>Đề không tồn tại.</div>;`;

content = content.replace(returnStatement, copyFunctions);

// 3. Remove the original studentLink declaration
content = content.replace(
  `  const studentLink = \`\${window.location.origin}/student/exam/\${versionId}\`;\n  return (`,
  `  return (`
);

// 4. Update the button
const oldButton = `<button 
            onClick={() => navigator.clipboard.writeText(studentLink)}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium text-sm transition-colors"
          >
            Copy
          </button>`;

const newButton = `<button 
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium text-sm transition-colors min-w-[120px]"
          >
            {copied ? "✓ Đã sao chép" : "Copy"}
          </button>`;

content = content.replace(oldButton, newButton);
// Also try single-line replace if it's single line
content = content.replace(
  `<button \n             onClick={() => navigator.clipboard.writeText(studentLink)}\n            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium text-sm transition-colors"\n          >\n            Copy\n          </button>`,
  newButton
);
// Make sure this is replaced regardless of formatting
content = content.replace(/<button[^>]*onClick={\(\) => navigator\.clipboard\.writeText\(studentLink\)}[^>]*>[\s\S]*?<\/button>/m, newButton);


fs.writeFileSync('src/pages/ExamPreview.tsx', content);
console.log("Patched ExamPreview copy");
