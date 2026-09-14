const fs = require('fs');

let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const navItemsRegex = /const navItems = \[([\s\S]*?)\];/;
const navItemsMatch = layout.match(navItemsRegex);
if (navItemsMatch) {
  let items = navItemsMatch[1];
  // Add Treasure Hunt
  items = items + `\n  { id: 'treasure', label: 'Kho báu Toán học', icon: Compass, path: '/treasure' },`; // Compass is already imported
  layout = layout.replace(navItemsRegex, `const navItems = [${items}\n];`);
  fs.writeFileSync('src/components/Layout.tsx', layout);
}

let app = fs.readFileSync('src/App.tsx', 'utf8');
const importTreasure = "import { TreasureHunt } from './pages/TreasureHunt';";
if (!app.includes(importTreasure)) {
  app = app.replace("import { Dashboard } from './pages/Dashboard';", `import { Dashboard } from './pages/Dashboard';\n${importTreasure}`);
}

const routeTreasure = '<Route path="treasure" element={<TreasureHunt />} />';
if (!app.includes(routeTreasure)) {
  app = app.replace('<Route path="lab" element={<MathLab />} />', `<Route path="lab" element={<MathLab />} />\n          ${routeTreasure}`);
  fs.writeFileSync('src/App.tsx', app);
}

console.log('done');
