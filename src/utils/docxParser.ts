import JSZip from 'jszip';
import { Question } from '../types';
import { v4 as uuidv4 } from 'uuid';

function ommlToLatex(ommlNode: Element): string {
    let latex = '';
    
    // Very basic mapping for OMML to LaTeX
    // This should ideally be a more comprehensive converter
    // For now, we'll try to extract text and basic structures
    
    for (const child of Array.from(ommlNode.childNodes)) {
        if (child.nodeType !== 1) continue;
        const el = child as Element;
        const tag = el.localName;
        
        if (tag === 'f') { // Fraction
            const num = el.querySelector('fPr') ? el.querySelector('num') : el.querySelector('num');
            const den = el.querySelector('den');
            latex += `\\frac{${num ? ommlToLatex(num) : ''}}{${den ? ommlToLatex(den) : ''}}`;
        } else if (tag === 'rad') { // Radical
            const deg = el.querySelector('deg');
            const e = el.querySelector('e');
            if (deg && deg.textContent?.trim()) {
                latex += `\\sqrt[${ommlToLatex(deg)}]{${e ? ommlToLatex(e) : ''}}`;
            } else {
                latex += `\\sqrt{${e ? ommlToLatex(e) : ''}}`;
            }
        } else if (tag === 'sSup') { // Superscript
            const e = el.querySelector('e');
            const sup = el.querySelector('sup');
            latex += `${e ? ommlToLatex(e) : ''}^{${sup ? ommlToLatex(sup) : ''}}`;
        } else if (tag === 'sSub') { // Subscript
            const e = el.querySelector('e');
            const sub = el.querySelector('sub');
            latex += `${e ? ommlToLatex(e) : ''}_{${sub ? ommlToLatex(sub) : ''}}`;
        } else if (tag === 'sSubSup') { // Subscript and Superscript
            const e = el.querySelector('e');
            const sub = el.querySelector('sub');
            const sup = el.querySelector('sup');
            latex += `${e ? ommlToLatex(e) : ''}_{${sub ? ommlToLatex(sub) : ''}}^{${sup ? ommlToLatex(sup) : ''}}`;
        } else if (tag === 'd') {
            const dPr = el.querySelector('dPr');
            let begCh = '(';
            let endCh = ')';
            let sepCh = '|';
            if (dPr) {
                const b = dPr.querySelector('begCh');
                if (b) begCh = b.getAttribute('m:val') || b.getAttribute('val') || begCh;
                const e = dPr.querySelector('endCh');
                if (e) endCh = e.getAttribute('m:val') || e.getAttribute('val') || endCh;
                const s = dPr.querySelector('sepCh');
                if (s) sepCh = s.getAttribute('m:val') || s.getAttribute('val') || sepCh;
            }
            const eNodes = Array.from(el.childNodes).filter(n => n.nodeType === 1 && (n as Element).localName === 'e');
            let innerLatex = '';
            for (let i = 0; i < eNodes.length; i++) {
                innerLatex += ommlToLatex(eNodes[i] as Element);
                if (i < eNodes.length - 1) innerLatex += sepCh;
            }
            let lBeg = begCh;
            let lEnd = endCh;
            if (lBeg === '{' || lBeg === '}') lBeg = '\\' + lBeg;
            if (lEnd === '{' || lEnd === '}') lEnd = '\\' + lEnd;
            if (lBeg === '') lBeg = '.';
            if (lEnd === '') lEnd = '.';
            latex += `\\left${lBeg}${innerLatex}\\right${lEnd}`;
        } else if (tag === 'r') {
            const t = el.querySelector('t');
            if (t && t.textContent) {
                // Escape special latex chars if needed, but usually OMML text inside math is just variables
                latex += t.textContent;
            }
        } else {
            // Recursively process other tags
            latex += ommlToLatex(el);
        }
    }
    
    return latex;
}

function processNode(node: Node, imageMap: Map<string, string>): string {
    if (node.nodeType !== 1) return '';
    const el = node as Element;
    const tag = el.localName;

    if (tag === 'p') {
        let pText = '';
        for (const child of Array.from(el.childNodes)) {
            if (child.nodeType !== 1) continue;
            const cel = child as Element;
            const ctag = cel.localName;
            if (ctag === 'r') {
                const texts = cel.querySelectorAll('t');
                texts.forEach(t => { pText += t.textContent || ''; });
                const drawings = cel.querySelectorAll('drawing, pict');
                drawings.forEach(d => {
                    const blip = d.querySelector('blip');
                    const imagedata = d.querySelector('imagedata');
                    let rId = null;
                    if (blip) rId = blip.getAttribute('r:embed');
                    if (imagedata) rId = imagedata.getAttribute('r:id');
                    if (rId && imageMap.has(rId)) {
                        pText += `<img src="${imageMap.get(rId)}" className="max-w-full h-auto mt-2 mb-2 rounded-lg" />`;
                    }
                });
            } else if (ctag === 'oMath') {
                pText += `$${ommlToLatex(cel)}$`;
            } else if (ctag === 'oMathPara') {
                cel.querySelectorAll('oMath').forEach(om => {
                    pText += `$$${ommlToLatex(om)}$$`;
                });
            }
        }
        return pText + '\n';
    } else if (tag === 'tbl') {
        let tblHtml = '<table className="w-full border-collapse border border-slate-300 mt-2 mb-2">';
        const trs = Array.from(el.childNodes).filter(n => n.nodeType === 1 && (n as Element).localName === 'tr');
        trs.forEach(tr => {
            tblHtml += '<tr>';
            const tcs = Array.from(tr.childNodes).filter(n => n.nodeType === 1 && (n as Element).localName === 'tc');
            tcs.forEach(tc => {
                tblHtml += '<td className="border border-slate-300 p-2">';
                const ps = Array.from(tc.childNodes).filter(n => n.nodeType === 1 && (n as Element).localName === 'p');
                ps.forEach(p => {
                    tblHtml += processNode(p, imageMap).replace(/\n/g, '<br/>');
                });
                tblHtml += '</td>';
            });
            tblHtml += '</tr>';
        });
        tblHtml += '</table>\n';
        return tblHtml;
    }
    return '';
}

export async function parseDocx(file: File): Promise<string> {
    const zip = await JSZip.loadAsync(file);
    
    // Extract images
    const imageMap = new Map<string, string>();
    const relsXml = await zip.file('word/_rels/document.xml.rels')?.async('text');
    if (relsXml) {
        const parser = new DOMParser();
        const relsDoc = parser.parseFromString(relsXml, 'text/xml');
        const rels = relsDoc.querySelectorAll('Relationship');
        for (const rel of Array.from(rels)) {
            const id = rel.getAttribute('Id');
            const target = rel.getAttribute('Target');
            if (id && target && target.startsWith('media/')) {
                const imgFile = zip.file(`word/${target}`);
                if (imgFile) {
                    const ext = target.split('.').pop()?.toLowerCase();
                    const mimeType = ext === 'png' ? 'image/png' : ext === 'jpeg' || ext === 'jpg' ? 'image/jpeg' : 'image/png';
                    const base64 = await imgFile.async('base64');
                    imageMap.set(id, `data:${mimeType};base64,${base64}`);
                }
            }
        }
    }

    const docXml = await zip.file('word/document.xml')?.async('text');
    if (!docXml) throw new Error("Invalid DOCX format: missing document.xml");

    const parser = new DOMParser();
    const doc = parser.parseFromString(docXml, 'text/xml');
    
    let fullText = '';
    const body = doc.querySelector('body');
    if (body) {
        for (const node of Array.from(body.childNodes)) {
            if (node.nodeType !== 1) continue;
            const el = node as Element;
            if (el.localName === 'p' || el.localName === 'tbl') {
                fullText += processNode(el, imageMap);
            }
        }
    } else {
        const paragraphs = doc.querySelectorAll('p');
        for (const p of Array.from(paragraphs)) {
            fullText += processNode(p, imageMap);
        }
    }
    return fullText;
}

export function extractQuestionsFromText(text: string, gradeId: number): Question[] {
    const questions: Question[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
    
    let currentQuestion: any = null;
    let currentOption: string | null = null;
    
    const questionRegex = /^Câu\s+(\d+)[\.\:]\s*(.*)/i;
    const optionRegexMCQ = /^(\*?)\s*([A-D])[\.\:\)]\s*(.*)/;
    const optionRegexTF = /^(\*?)\s*([a-d])\)\s*(.*)/;
    const answerRegex = /^(?:Đáp án|HDG|Hướng dẫn giải)[\:\.]\s*(.*)/i;
    const explRegex = /^(?:Lời giải|Giải)[\:\.]\s*(.*)/i;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        const qMatch = line.match(questionRegex);
        if (qMatch) {
            if (currentQuestion) finalizeQuestion(currentQuestion, questions, gradeId);
            
            currentQuestion = {
                type: 'UNKNOWN',
                content: qMatch[2] ? qMatch[2] : '',
                options: {},
                tfOptions: {},
                answerText: '',
                correctAnswer: '',
                explanation: ''
            };
            currentOption = null;
            continue;
        }

        if (!currentQuestion) continue;

        const optMatch = line.match(optionRegexMCQ);
        if (optMatch) {
            currentQuestion.type = 'MCQ';
            currentOption = optMatch[2];
            currentQuestion.options[currentOption] = optMatch[3] ? optMatch[3] : '';
            if (optMatch[1] === '*') {
                currentQuestion.correctAnswer = currentOption;
            }
            continue;
        }

        const tfMatch = line.match(optionRegexTF);
        if (tfMatch) {
            currentQuestion.type = 'TF';
            currentOption = tfMatch[2];
            currentQuestion.tfOptions[currentOption] = tfMatch[3] ? tfMatch[3] : '';
            if (optMatch && optMatch[1] === '*') {
                // not fully supported but we can mark it
            }
            continue;
        }

        const ansMatch = line.match(answerRegex);
        if (ansMatch) {
            currentQuestion.answerText = ansMatch[1].trim();
            currentOption = null;
            continue;
        }
        
        const explMatch = line.match(explRegex);
        if (explMatch) {
            currentQuestion.explanation = explMatch[1].trim();
            currentOption = null;
            continue;
        }

        if (line.toLowerCase().includes('đúng') || line.toLowerCase().includes('sai')) {
            if (currentQuestion.answerText !== '') {
               currentQuestion.answerText += ' ' + line;
               continue;
            }
        }

        if (currentOption && currentQuestion.type === 'MCQ') {
            currentQuestion.options[currentOption] += (currentQuestion.options[currentOption] ? '<br/>' : '') + line;
        } else if (currentOption && currentQuestion.type === 'TF') {
            currentQuestion.tfOptions[currentOption] += (currentQuestion.tfOptions[currentOption] ? '<br/>' : '') + line;
        } else if (currentQuestion.answerText && !currentQuestion.explanation) {
             currentQuestion.answerText += ' ' + line;
        } else if (currentQuestion.explanation || currentQuestion.answerText) {
             currentQuestion.explanation += (currentQuestion.explanation ? '<br/>' : '') + line;
        } else {
            currentQuestion.content += (currentQuestion.content ? '<br/>' : '') + line;
        }
    }

    if (currentQuestion) {
        finalizeQuestion(currentQuestion, questions, gradeId);
    }

    return questions;
}

function hasMeaningfulContent(str: string): boolean {
    if (!str) return false;
    // Check if it has an image tag
    if (str.includes('<img')) return true;
    // Check if it has a table
    if (str.includes('<table')) return true;
    // Check if it has math
    if (str.includes('$')) return true;
    // Otherwise check text length
    const plain = str.replace(/<[^>]*>?/gm, '').trim();
    return plain.length > 0;
}

function finalizeQuestion(qDraft: any, questions: Question[], gradeId: number) {
    const baseId = uuidv4();
    const baseQ = {
        id: baseId,
        subject_id: 'math',
        grade_id: gradeId,
        topic_id: 'imported',
        lesson_id: 'imported',
        difficulty: 2 as const,
        content: qDraft.content.trim(),
        explanation: qDraft.explanation.trim(),
        tags: ['imported'],
        _importError: false,
        _importMessage: ''
    };

    if (Object.keys(qDraft.options).length >= 2 || qDraft.type === 'MCQ') {
        let correctId = '';
        const optionsList: any[] = [];
        const optKeys = ['A', 'B', 'C', 'D'];
        
        let hasAns = false;
        for (const k of optKeys) {
            const content = qDraft.options[k] ? qDraft.options[k].trim() : '';
            if (hasMeaningfulContent(content)) {
                const optId = uuidv4();
                const isCorrect = qDraft.correctAnswer === k || (qDraft.answerText && qDraft.answerText.toUpperCase().includes(k));
                optionsList.push({ id: optId, content: content, isCorrect: isCorrect });
                if (isCorrect) {
                    correctId = optId;
                    hasAns = true;
                }
            }
        }

        const mcq: any = {
            ...baseQ,
            question_type: 'MCQ_SINGLE',
            options: optionsList,
            correct_option_id: correctId
        };
        
        if (optionsList.length < 4) {
            mcq._importError = true;
            mcq._importMessage = 'CẦN KIỂM TRA: Thiếu phương án A/B/C/D';
        } else if (!hasAns) {
            mcq._importError = true;
            mcq._importMessage = 'Cần xác định đáp án';
        }
        
        questions.push(mcq);

    } else if (Object.keys(qDraft.tfOptions).length >= 2 || qDraft.type === 'TF') {
        const statementsList: any[] = [];
        const ansText = qDraft.answerText.toLowerCase();
        const optKeys = ['a', 'b', 'c', 'd'];
        
        let hasAns = ansText.length > 0;
        for (const k of optKeys) {
            const content = qDraft.tfOptions[k] ? qDraft.tfOptions[k].trim() : '';
            if (hasMeaningfulContent(content)) {
                let isCorrect = true; 
                if (ansText) {
                    const parts = ansText.split(k);
                    if (parts.length > 1) {
                        const statementContext = parts[1];
                        const nextWord = statementContext.replace(/[^a-zđs]/gi, '').substring(0, 4);
                        if (nextWord.includes('s') || nextWord.includes('sai')) {
                            isCorrect = false;
                        }
                    }
                }
                statementsList.push({
                    id: uuidv4(),
                    content: content,
                    isTrue: isCorrect
                });
            }
        }
        
        const tfq: any = {
            ...baseQ,
            question_type: 'TRUE_FALSE_GROUP',
            statements: statementsList
        };
        
        if (statementsList.length < 4) {
            tfq._importError = true;            
            tfq._importMessage = 'CẦN KIỂM TRA: Thiếu ý a/b/c/d';
        } else if (!hasAns) {
            tfq._importError = true;
            tfq._importMessage = 'Cần xác định đáp án';
        }
        questions.push(tfq);
    } else {
        const shortQ: any = {
            ...baseQ,
            question_type: 'SHORT_ANSWER',
            correctAnswer: qDraft.answerText.replace(/,/g, '.').trim()
        };
        
        if (!shortQ.correctAnswer) {
            shortQ._importError = true;
            shortQ._importMessage = 'Cần xác định đáp án';
        }
        questions.push(shortQ);
    }
}
