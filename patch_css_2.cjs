const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
`.answer-option .answer-content {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  line-height: 1.55;
}`, 
`.answer-option .answer-content {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  line-height: 1.55;
  overflow-x: auto;
  overflow-y: hidden;
}`);

fs.writeFileSync('src/index.css', css);
console.log("Patched CSS 2");
