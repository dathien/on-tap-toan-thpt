const React = require('react');
const ReactDOMServer = require('react-dom/server');

const el = React.createElement('div', {
  dangerouslySetInnerHTML: { __html: "$-\\infty$" }
});

console.log(ReactDOMServer.renderToString(el));
