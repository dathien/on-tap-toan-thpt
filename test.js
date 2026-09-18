const v1 = "f'(x)=0\\Leftrightarrowx^2-4=0\\Leftrightarrowx=-2";
let v = v1;
const COMMANDS_REQUIRING_BOUNDARY = [
  "Leftrightarrow"
];
COMMANDS_REQUIRING_BOUNDARY.forEach(cmd => {
  const regex = new RegExp(`(\\\\${cmd})([a-zA-Z0-9])`, 'g');
  console.log("Regex:", regex);
  v = v.replace(regex, "$1{}$2");
});
console.log("Result:", v);
