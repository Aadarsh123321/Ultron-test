const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Update refreshAnalytics to sort locally
app = app.replace(
  /const snap=await getDocs\(query\(collection\(db,'users',user\.uid,'attempts'\),orderBy\('createdAt','desc'\),limit\(50\)\)\);/,
  `const snap=await getDocs(collection(db,'users',user.uid,'attempts'));
      let docsArr = [];
      snap.forEach(d => docsArr.push(d.data()));
      docsArr.sort((a,b) => {
        let ta = a.createdAt ? a.createdAt.toMillis() : 0;
        let tb = b.createdAt ? b.createdAt.toMillis() : 0;
        return tb - ta;
      });
      if (docsArr.length > 50) docsArr = docsArr.slice(0, 50);
      
      // We will iterate over docsArr instead of snap`
);

// We need to replace snap.forEach with docsArr.forEach in refreshAnalytics
app = app.replace(
  /let tests=0,q=0,correct=0;const rows=\[\];\s*snap\.forEach\(d=>\{/,
  `let tests=0,q=0,correct=0;const rows=[];
      docsArr.forEach(a=>{`
);

// We also need to remove the `const a=d.data();` inside the loop since `a` is already data
app = app.replace(
  /docsArr\.forEach\(a=>\{\s*const a=d\.data\(\);/,
  `docsArr.forEach(a=>{`
);

fs.writeFileSync('app.js', app);

