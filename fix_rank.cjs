const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Update refreshLeaderboard to calculate the exact rank for the current user
app = app.replace(
  /const myDoc = await getDoc\(doc\(db, 'users', user.uid\)\);[\s\S]*?\$\('#currentUserRank'\)\.style\.display='none';\s*\}/m,
  `const myDoc = await getDoc(doc(db, 'users', user.uid));
          if (myDoc.exists()) {
             const u = myDoc.data();
             const snap = await getCountFromServer(query(collection(db, 'users'), where('totalScore', '>', u.totalScore || 0)));
             const myRank = snap.data().count + 1;
             $('#currentUserRank').innerHTML = \`<div style="display:flex; justify-content:space-between; align-items:center; color:#ff4265; font-weight:bold;">
                 <div style="display:flex; align-items:center; gap:12px;">
                   <div style="width:28px; height:28px; border-radius:50%; background:rgba(255,42,85,0.2); display:grid; place-items:center; font-size:12px;">\${myRank}</div>
                   <div style="font-size:15px;">\${u.displayName || 'You'}</div>
                 </div>
                 <div style="font-size:18px; font-family:'Space Grotesk', sans-serif;">\${u.totalScore || 0}</div>
             </div>\`;
             $('#currentUserRank').style.display='block';
          } else {
             $('#currentUserRank').style.display='none';
          }`
);

fs.writeFileSync('app.js', app);
