const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf-8');
index = index.replace(/<title>TRỢ LÝ GVBM<\/title>/g, '<title>TRỢ LÝ GV TOÁN</title>');
index = index.replace(/content="TRỢ LÝ GVBM"/g, 'content="TRỢ LÝ GV TOÁN"');
fs.writeFileSync('index.html', index);

let metadata = fs.readFileSync('metadata.json', 'utf-8');
metadata = metadata.replace(/"name": "TRỢ LÝ GVBM"/g, '"name": "TRỢ LÝ GV TOÁN"');
fs.writeFileSync('metadata.json', metadata);

let store = fs.readFileSync('src/store/useAppStore.ts', 'utf-8');
store = store.replace(/appName: 'TRỢ LÝ GVBM'/g, "appName: 'TRỢ LÝ GV TOÁN'");
store = store.replace(/appShortName: 'GVBM'/g, "appShortName: 'GV TOÁN'");
fs.writeFileSync('src/store/useAppStore.ts', store);
