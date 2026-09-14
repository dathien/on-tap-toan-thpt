const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
`.answer-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  min-width: 0;
  overflow: hidden;
}`, 
`.answer-option {
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
  gap: 10px;
  box-sizing: border-box;
  /* padding is usually handled by utility classes like p-4 */
}`);

css = css.replace(
`.answer-option .answer-content {
  flex: 1 1 auto;
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: normal;
  line-height: 1.55;
}`, 
`.answer-option .answer-content {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  line-height: 1.55;
}

.answer-math {
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: visible;
  white-space: nowrap;
}`);

css = css.replace(
`.answers-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .answers-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}`,
`.answers-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;
}

/* We will let React decide if it's 1 or 2 columns based on content length using utility classes */
.answers-grid.auto-cols {
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .answers-grid.auto-cols {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}
.answers-grid.one-col {
  grid-template-columns: 1fr;
}
.answers-grid.two-cols {
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .answers-grid.two-cols {
    grid-template-columns: 1fr 1fr;
  }
}`);

fs.writeFileSync('src/index.css', css);
console.log("Patched CSS");
