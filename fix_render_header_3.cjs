const fs = require('fs');
let code = fs.readFileSync('src/pages/Roadmap.tsx', 'utf8');

code = code.replace(
`return (
      <div className="mb-4">`,
`return (
      <>
        <div className="mb-4">`
);

code = code.replace(
`      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER: DIAGNOSTIC`,
`      </div>
      </>
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER: DIAGNOSTIC`
);

fs.writeFileSync('src/pages/Roadmap.tsx', code);
