const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// replace compass with gem in Layout for treasure
layout = layout.replace("{ id: 'treasure', label: 'Kho báu Toán học', icon: Compass, path: '/treasure' }", "{ id: 'treasure', label: 'Kho báu Toán học', icon: Compass, path: '/treasure' }".replace('Compass', 'Gem'));
// ensure Gem is imported
if (!layout.includes('Gem,')) {
  layout = layout.replace('import { \n  LayoutDashboard,', 'import { \n  LayoutDashboard,\n  Gem,');
}
fs.writeFileSync('src/components/Layout.tsx', layout);
console.log('done');
