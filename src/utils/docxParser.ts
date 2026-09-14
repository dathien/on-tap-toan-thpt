import JSZip from 'jszip';
import { Question, McqQuestion, TrueFalseGroupQuestion, ShortAnswerQuestion } from '../types';
import { v4 as uuidv4 } from 'uuid';

function parseOmmlToLatex(node: Element): string {
    if (node.nodeType !== 1) return '';
    const tagName = node.localName;

    switch (tagName) {
        case 'f': {
            const num = node.querySelector('fName, num');
            const den = node.querySelector('den');
            return `\\frac{${num ? parseOmmlChildren(num) : ''}}{${den ? parseOmmlChildren(den) : ''}}`;
        }
        case 'sSup': {
            const e = node.querySelector('e');
            const sup = node.querySelector('sup');
            return `{${e ? parseOmmlChildren(e) : ''}}^{${sup ? parseOmmlChildren(sup) : ''}}`;
        }
        case 'sSub': {
            const e = node.querySelector('e');
            const sub = node.querySelector('sub');
            return `{${e ? parseOmmlChildren(e) : ''}}_{${sub ? parseOmmlChildren(sub) : ''}}`;
        }
        case 'sSubSup': {
            const e = node.querySelector('e');
            const sub = node.querySelector('sub');
            const sup = node.querySelector('sup');
            return `{${e ? parseOmmlChildren(e) : ''}}_{${sub ? parseOmmlChildren(sub) : ''}}^{${sup ? parseOmmlChildren(sup) : ''}}`;
        }
        case 'rad': {
            const deg = node.querySelector('deg');
            const e = node.querySelector('e');
            const degLatex = deg ? parseOmmlChildren(deg) : '';
            return degLatex.trim() ? `\\sqrt[${degLatex}]{${e ? parseOmmlChildren(e) : ''}}` : `\\sqrt{${e ? parseOmmlChildren(e) : ''}}`;
        }
        case 'd': {
            const pr = node.querySelector('dPr');
            let begCh = '(', endCh = ')';
            if (pr) {
                begCh = pr.querySelector('begCh')?.getAttribute('m:val') || '(';
                endCh = pr.querySelector('endCh')?.getAttribute('m:val') || ')';
            }
            return `\\left${begCh} ${node.querySelector('e') ? parseOmmlChildren(node.querySelector('e')!) : ''} \\right${endCh}`;
        }
        case 'nary': {
            const naryPr = node.querySelector('naryPr');
            let chr = '\\int';
            if (naryPr) {
                const v = naryPr.querySelector('chr')?.getAttribute('m:val');
                if (v === '∑') chr = '\\sum';
                else if (v === '∏') chr = '\\prod';
                else if (v === '∫') chr = '\\int';
            }
            const sub = node.querySelector('sub');
            const sup = node.querySelector('sup');
            const e = node.querySelector('e');
            let res = chr;
            if (sub && sub.textContent?.trim()) res += `_{${parseOmmlChildren(sub)}}`;
            if (sup && sup.textContent?.trim()) res += `^{${parseOmmlChildren(sup)}}`;
            if (e) res += ` ${parseOmmlChildren(e)}`;
            return res;
        }
        case 'limLow': {
            return `\\lim_{${node.querySelector('lim') ? parseOmmlChildren(node.querySelector('lim')!) : ''}} ${node.querySelector('e') ? parseOmmlChildren(node.querySelector('e')!) : ''}`;
        }
        case 'm': {
            const mrList = node.querySelectorAll('mr');
            let matrixContent = Array.from(mrList).map(mr => 
                Array.from(mr.querySelectorAll('e')).map(e => parseOmmlChildren(e)).join(' & ')
            ).join(' \\\\ ');
            return `\\begin{matrix} ${matrixContent} \\end{matrix}`;
        }
        case 't': {
            return node.textContent || '';
        }
        default: {
            return parseOmmlChildren(node);
        }
    }
}

function parseOmmlChildren(node: Element): string {
    let res = '';
    for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === 1) res += parseOmmlToLatex(child as Element);
    }
    return res;
}

export function ommlToLatex(oMathNode: Element): string {
    return parseOmmlChildren(oMathNode);
}

export async function parseDocx(file: File): Promise<string> {
    const zip = new JSZip();
    await zip.loadAsync(file);

    const relsXml = await zip.file('word/_rels/document.xml.rels')?.async('text');
    const imageMap = new Map<string, string>();
    
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
    const paragraphs = doc.querySelectorAll('p');
    
    for (const p of Array.from(paragraphs)) {
        let pText = '';
        for (const node of Array.from(p.childNodes)) {
            if (node.nodeType !== 1) continue;
            const el = node as Element;
            const tag = el.localName;

            if (tag === 'r') {
                const texts = el.querySelectorAll('t');
                texts.forEach(t => { pText += t.textContent || ''; });

                const drawings = el.querySelectorAll('drawing, pict');
                drawings.forEach(d => {
                    const blip = d.querySelector('blip');
                    const imagedata = d.querySelector('imagedata');
                    let rId = null;
                    if (blip) rId = blip.getAttribute('r:embed');
                    if (imagedata) rId = imagedata.getAttribute('r:id');
                    if (rId && imageMap.has(rId)) {
                        pText += `\n![](${imageMap.get(rId)})\n`;
                    }
                });
            } else if (tag === 'oMath') {
                pText += `$${ommlToLatex(el)}$`;
            } else if (tag === 'oMathPara') {
                el.querySelectorAll('oMath').forEach(om => {
                    pText += `\n$$${ommlToLatex(om)}$$\n`;
                });
            }
        }
        fullText += pText + '\n';
    }

    return fullText;
}

export function extractQuestionsFromText(text: string, gradeId: number): Question[] {
    const questions: Question[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
    
    let currentQuestion: any = null;
    let currentOption: string | null = null;
    
    const questionRegex = /^Câu\s+(\d+)[\.\:]\s*(.*)/i;
    const optionRegexMCQ = /^([A-D])[\.\:]\s*(.*)/;
    const optionRegexTF = /^([a-d])\)\s*(.*)/;
    const answerRegex = /^Đáp án[\:\.]\s*(.*)/i;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        const qMatch = line.match(questionRegex);
        if (qMatch) {
            if (currentQuestion) finalizeQuestion(currentQuestion, questions, gradeId);
            
            currentQuestion = {
                type: 'UNKNOWN',
                content: qMatch[2] ? qMatch[2] + '\n' : '',
                options: {},
                tfOptions: {},
                answerText: '',
                correctAnswer: ''
            };
            currentOption = null;
            continue;
        }

        if (!currentQuestion) continue;

        const optMatch = line.match(optionRegexMCQ);
        if (optMatch) {
            currentQuestion.type = 'MCQ';
            currentOption = optMatch[1];
            currentQuestion.options[currentOption] = optMatch[2] ? optMatch[2] + '\n' : '';
            continue;
        }

        const tfMatch = line.match(optionRegexTF);
        if (tfMatch) {
            currentQuestion.type = 'TF';
            currentOption = tfMatch[1];
            currentQuestion.tfOptions[currentOption] = tfMatch[2] ? tfMatch[2] + '\n' : '';
            continue;
        }

        const ansMatch = line.match(answerRegex);
        if (ansMatch) {
            currentQuestion.answerText = ansMatch[1].trim();
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
            currentQuestion.options[currentOption] += line + '\n';
        } else if (currentOption && currentQuestion.type === 'TF') {
            currentQuestion.tfOptions[currentOption] += line + '\n';
        } else {
            currentQuestion.content += line + '\n';
        }
    }

    if (currentQuestion) {
        finalizeQuestion(currentQuestion, questions, gradeId);
    }

    return questions;
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
        tags: ['imported'],
        _importError: false,
        _importMessage: ''
    };

    if (Object.keys(qDraft.options).length >= 2) {
        let correctId = '';
        const optionsList: any[] = [];
        const optKeys = ['A', 'B', 'C', 'D'].filter(k => qDraft.options[k]);
        
        let hasAns = false;
        for (const k of optKeys) {
            const optId = uuidv4();
            optionsList.push({ id: optId, content: qDraft.options[k].trim() });
            if (qDraft.answerText.toUpperCase().includes(k)) {
                correctId = optId;
                hasAns = true;
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
            mcq._importMessage = 'Thiếu phương án A/B/C/D';
        } else if (!hasAns) {
            mcq._importError = true;
            mcq._importMessage = 'Cần xác định đáp án';
        }
        
        questions.push(mcq);

    } else if (Object.keys(qDraft.tfOptions).length >= 2) {
        const statementsList: any[] = [];
        const ansText = qDraft.answerText.toLowerCase();
        const optKeys = ['a', 'b', 'c', 'd'].filter(k => qDraft.tfOptions[k]);
        
        let hasAns = ansText.length > 0;
        for (const k of optKeys) {
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
                content: qDraft.tfOptions[k].trim(),
                is_correct: isCorrect
            });
        }
        
        const tfq: any = {
            ...baseQ,
            question_type: 'TRUE_FALSE_GROUP',
            statements: statementsList
        };
        
        if (statementsList.length < 4) {
            tfq._importError = true;
            tfq._importMessage = 'Thiếu ý a/b/c/d';
        } else if (!hasAns) {
            tfq._importError = true;
            tfq._importMessage = 'Cần xác định đáp án';
        }
        questions.push(tfq);

    } else {
        const shortQ: any = {
            ...baseQ,
            question_type: 'SHORT_ANSWER',
            correct_answer: qDraft.answerText.replace(/,/g, '.').trim()
        };
        
        if (!shortQ.correct_answer) {
            shortQ._importError = true;
            shortQ._importMessage = 'Cần xác định đáp án';
        }
        questions.push(shortQ);
    }
}
