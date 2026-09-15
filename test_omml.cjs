const { JSDOM } = require('jsdom');
const xml = `
<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">
  <m:d>
    <m:dPr>
      <m:begCh m:val="["/>
      <m:endCh m:val=")"/>
    </m:dPr>
    <m:e>
      <m:r><m:t>-1; 3</m:t></m:r>
    </m:e>
  </m:d>
</m:oMath>
`;
const dom = new JSDOM(xml, { contentType: "text/xml" });
const el = dom.window.document.documentElement.querySelector('d');
const dPr = el.querySelector('dPr');
let beg = '(';
let end = ')';
if (dPr) {
  const b = dPr.querySelector('begCh');
  if (b) beg = b.getAttribute('m:val') || b.getAttribute('val') || beg;
  const e = dPr.querySelector('endCh');
  if (e) end = e.getAttribute('m:val') || e.getAttribute('val') || end;
}
console.log(beg, end);
