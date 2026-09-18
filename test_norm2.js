import { normalizeMathExpression } from './src/utils/mathNormalizer.ts';
console.log("Original:", "\\sin\\left( x\\right)");
console.log("Normalized:", normalizeMathExpression("\\sin\\left( x\\right)"));
