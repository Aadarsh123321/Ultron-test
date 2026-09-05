const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Remove the hook reassignment
app = app.replace(
  /const originalHandleUser = handleUser;\s*handleUser = async function\(u\) \{\s*await originalHandleUser\(u\);\s*if\(u\) \{\s*await fetchUserAttempts\(\);\s*\} else \{\s*userAttempts = \{\};\s*renderTests\(\);\s*\}\s*\};\s*/,
  ``
);

// Inject into the original handleUser
app = app.replace(
  /await loadProfile\(\);\s*\}else\{/m,
  `await loadProfile();
    await fetchUserAttempts();
  }else{
    userAttempts = {};
    renderTests();`
);

fs.writeFileSync('app.js', app);
