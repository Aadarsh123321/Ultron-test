const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /    \},\{merge:true\}\);\s*return true;\s*async function refreshAnalytics/,
  `    },{merge:true});\n    return true;\n  }\nasync function refreshAnalytics`
);

fs.writeFileSync('app.js', app);
