const { JSDOM } = require('jsdom');
const dom = new JSDOM(`<!DOCTYPE html><div id="test"></div>`);
const div = dom.window.document.getElementById('test');
div.innerHTML = "$-\\infty$";
console.log(div.textContent);
