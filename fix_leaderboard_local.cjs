const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Update refreshLeaderboard
app = app.replace(
  /const snap = await getDocs\(query\(collection\(db,'users'\), orderBy\('totalScore','desc'\), limit\(10\)\)\);[\s\S]*?if\(html === ''\) html = '<div style="padding:40px 0;text-align:center;color:var\(--muted\);">No data yet.<\/div>';/m,
  `const snap = await getDocs(collection(db,'users'));
    let usersArr = [];
    snap.forEach(d => {
       usersArr.push({ id: d.id, ...d.data() });
    });
    usersArr.sort((a,b) => (b.totalScore||0) - (a.totalScore||0));
    
    let html = '';
    let rank = 1;
    let foundMe = false;
    
    let top10 = usersArr.slice(0, 10);
    top10.forEach(u => {
       const isMe = user && u.id === user.uid;
       if (isMe) foundMe = true;
       html += \`<div style="display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.05); \${isMe?'color:#ff4265; font-weight:bold;':''}">
          <div style="display:flex; align-items:center; gap:12px;">
             <div style="width:28px; height:28px; border-radius:50%; background:rgba(255,255,255,0.1); display:grid; place-items:center; font-size:12px; font-weight:700;">\${rank}</div>
             <div style="font-size:15px;">\${u.displayName || 'Anonymous'}</div>
          </div>
          <div style="font-size:18px; font-family:'Space Grotesk', sans-serif;">\${u.totalScore || 0}</div>
       </div>\`;
       rank++;
    });
    if(html === '') html = '<div style="padding:40px 0;text-align:center;color:var(--muted);">No data yet.</div>';`
);

// Update error message
app = app.replace(
  /\$\('#leaderboardList'\)\.innerHTML='<div style="padding:40px 0;text-align:center;color:red;">Error loading leaderboard. Please ensure index on totalScore is built.<\/div>';/,
  `$('#leaderboardList').innerHTML='<div style="padding:40px 0;text-align:center;color:red;">Error loading leaderboard. Please update your Firestore Rules in Firebase Console to allow global reads on the users collection: <br><br><code>match /users/{uid} { allow read: if true; }</code></div>';`
);

// Also update the exact rank calculation for current user since getCountFromServer requires an index!
app = app.replace(
  /const snap = await getCountFromServer\(query\(collection\(db, 'users'\), where\('totalScore', '>', u\.totalScore \|\| 0\)\)\);\s*const myRank = snap\.data\(\)\.count \+ 1;/,
  `const myRank = usersArr.findIndex(x => x.id === user.uid) + 1;`
);

fs.writeFileSync('app.js', app);
