const cmds = ['le', 'Leftrightarrow', 'in'];

function test(str) {
  let v = str;
  cmds.forEach(cmd => {
    const regex = new RegExp(`(\\\\${cmd})([a-zA-Z0-9])(?![a-zA-Z])`, 'g');
    v = v.replace(regex, "$1{}$2");
  });
  console.log(str, "->", v);
}

test("\\left(x\\right)");
test("\\lex");
test("\\lex^2");
test("\\Leftrightarrowx^2");
test("\\inA");
test("\\inAB");
test("\\infty");
