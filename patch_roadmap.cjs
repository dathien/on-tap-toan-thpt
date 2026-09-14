const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

// 1. Add ability level state
const stateAbilityStr = `
  const [selectedAbility, setSelectedAbility] = useState<'WEAK' | 'AVERAGE' | 'GOOD' | 'EXCELLENT'>('AVERAGE');
  const [proposedQuestions, setProposedQuestions] = useState<Question[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);
`;
code = code.replace(
  "const [target, setTarget] = useState<string>('Điểm 7+');",
  "const [target, setTarget] = useState<string>('Điểm 7+');" + stateAbilityStr
);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
console.log("Patched 1");
