const DOMParser = require('xmldom').DOMParser;
const xml = `
<w:body xmlns:w="http://example.com">
  <w:p><w:r><w:t>Câu 1. </w:t></w:r></w:p>
  <w:tbl>
    <w:tr>
      <w:tc><w:p><w:r><w:t>Cell 1</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:t>Cell 2</w:t></w:r></w:p></w:tc>
    </w:tr>
  </w:tbl>
</w:body>
`;
const doc = new DOMParser().parseFromString(xml, 'text/xml');
const body = doc.documentElement;
console.log(body.childNodes.length);
