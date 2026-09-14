const fs = require('fs');
let code = fs.readFileSync('src/pages/ClassManagement.tsx', 'utf8');

// The main return is where the modals are.
// I will wrap the main return and ClassDetail in a fragment, and put modals at the end.

const mainReturnRegex = /return \(\s*<div className="max-w-7xl mx-auto space-y-6 pb-12">[\s\S]*?(?=\/\/\s*--- Class Detail Component ---)/;

const mainReturnMatch = code.match(mainReturnRegex);
if (mainReturnMatch) {
  let mainBody = mainReturnMatch[0];
  
  // Extract modals out of mainBody
  const modalsRegex = /\{\/\* Class Modal \*\/\}.*(?=\s*<\/div>\s*\);\s*$)/s;
  const modalsMatch = mainBody.match(modalsRegex);
  
  if (modalsMatch) {
    let modalsContent = modalsMatch[0];
    
    // Remove modals from mainBody
    mainBody = mainBody.replace(modalsContent, '');
    
    // Rewrite the render logic
    code = code.replace(
      '  if (activeClassId) {\n    return <ClassDetail ',
      '  const renderContent = () => {\n    if (activeClassId) {\n      return <ClassDetail '
    );
    
    code = code.replace(
      '    />;\n  }',
      '      />;\n    }'
    );
    
    code = code.replace(
      mainBody,
      `    return (\n      ${mainBody.substring(9)}    );\n  };\n\n  return (\n    <>\n      {renderContent()}\n      ${modalsContent}\n    </>\n  );`
    );
    
    fs.writeFileSync('src/pages/ClassManagement.tsx', code);
  }
}
