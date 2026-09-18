const COMMANDS_REQUIRING_BOUNDARY = [
    "Leftrightarrow",
    "Rightarrow",
    "Leftarrow",
    "rightarrow",
    "leftarrow",
    "infty",
    "cdot",
    "times",
    "le",
    "leq",
    "ge",
    "geq",
    "neq",
    "in",
    "notin",
    "to",
    "mathbb",
    "mathrm"
];

// Sort by length descending to match longest possible command first
const sortedCmds = [...COMMANDS_REQUIRING_BOUNDARY].sort((a, b) => b.length - a.length);

// Also add a whitelist of valid commands that might start with our keywords so we don't break them.
// Actually, if we just find the LONGEST match in sortedCmds, is that enough?
// What if word is 'left'? 
// sortedCmds has 'le'. 'left' starts with 'le'. 
// Is 'left' in sortedCmds? No. So it would match 'le' and split into 'le' + 'ft'.
// That means we need to know that 'left' is a valid command itself and shouldn't be split by 'le'.

console.log("sorted:", sortedCmds);
