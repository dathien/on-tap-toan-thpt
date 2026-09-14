const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><div></div>`);
const div = dom.window.document.querySelector("div");
div.innerHTML = "$\\infty$";
console.log(div.textContent.length);
console.log(div.textContent === "$\\infty$");
