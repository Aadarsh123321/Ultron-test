const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /if \(window\.APP_API && window\.APP_API\.deleteAttemptByStorageId\) \{/g,
  `if (window.parent && window.parent.APP_API && window.parent.APP_API.deleteAttemptByStorageId) {`
);

app = app.replace(
  /window\.APP_API\.deleteAttemptByStorageId\(storageId\);/g,
  `window.parent.APP_API.deleteAttemptByStorageId(storageId);`
);

fs.writeFileSync('app.js', app);
