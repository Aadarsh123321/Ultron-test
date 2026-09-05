const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /const u = myDoc\.data\(\);\s*const myRank = usersArr\.findIndex\(x => x\.id === user\.uid\) \+ 1;\s*const u = usersArr\.find\(x => x\.id === user\.uid\) \|\| myDoc\.data\(\);/,
  `const myRank = usersArr.findIndex(x => x.id === user.uid) + 1;
             const u = usersArr.find(x => x.id === user.uid) || myDoc.data();`
);

fs.writeFileSync('app.js', app);
