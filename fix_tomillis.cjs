const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /a\.createdAt\.toMillis\(\)/g,
  `(typeof a.createdAt.toMillis === 'function' ? a.createdAt.toMillis() : Date.now())`
);

app = app.replace(
  /b\.createdAt\.toMillis\(\)/g,
  `(typeof b.createdAt.toMillis === 'function' ? b.createdAt.toMillis() : Date.now())`
);

fs.writeFileSync('app.js', app);
