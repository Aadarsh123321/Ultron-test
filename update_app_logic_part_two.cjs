const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Add deleteDoc to imports
app = app.replace(
  /import \{ getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, getCountFromServer, where \} from "https:\/\/www\.gstatic\.com\/firebasejs\/12\.1\.0\/firebase-firestore\.js";/,
  `import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, getCountFromServer, where, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";`
);

// 2. Add showUserProfile to global scope
app = app.replace(
  /window\.APP_API=\{get user\(\)\{return user\},saveAttempt,showPage,toast\};/,
  `window.APP_API={get user(){return user},saveAttempt,showPage,toast};
window.showUserProfile = function(name, tests, questions, accuracy, initial) {
    document.getElementById('upmName').textContent = name;
    document.getElementById('upmTests').textContent = tests || 0;
    document.getElementById('upmQs').textContent = questions || 0;
    document.getElementById('upmAcc').textContent = accuracy ? accuracy + '%' : '0%';
    document.getElementById('upmAvatar').textContent = initial;
    document.getElementById('userProfileModal').style.display = 'grid';
};
window.APP_API.deleteAttemptByStorageId = async (storageId) => {
    if(!db||!user) return;
    let testId = storageId;
    if (typeof testsData !== 'undefined') {
       for (const t of testsData) {
          let found = false;
          for (const p of t.papers) {
             const fileName = p.url.split('/').pop();
             const sId = 'embedded-jee-cbt-' + fileName.replace('.html','').replace(/[\\s\\(\\)]+/g, '_').replace(/_$/, '');
             if (sId === storageId) { testId = t.id; found = true; break; }
          }
          if(found) break;
       }
    }
    try {
        await deleteDoc(doc(db, 'users', user.uid, 'attempts', testId));
        // Also try querying for old docs with this testId
        const oldSnap = await getDocs(query(collection(db, 'users', user.uid, 'attempts'), where('testId', '==', testId)));
        oldSnap.forEach(d => {
            deleteDoc(d.ref).catch(()=>{});
        });
        
        // Recalculate
        const snap = await getDocs(collection(db, 'users', user.uid, 'attempts'));
        let bestAttempts = {};
        snap.forEach(d => {
           let a = d.data();
           if (!a.testId) a.testId = d.id;
           if (!bestAttempts[a.testId] || (a.createdAt && bestAttempts[a.testId].createdAt && a.createdAt.toMillis() > bestAttempts[a.testId].createdAt.toMillis())) {
               bestAttempts[a.testId] = a;
           }
        });
        let totalTests = 0, totalScore = 0, totalQuestions = 0, totalCorrect = 0;
        Object.values(bestAttempts).forEach(a => {
            totalTests++;
            totalScore += Number(a.score||0);
            totalQuestions += Number(a.questions||0);
            totalCorrect += Number(a.correct||0);
        });
        let accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        await setDoc(doc(db,'users',user.uid),{
            totalScore, totalTests, totalQuestions, totalCorrect, accuracy
        }, {merge:true});
        
        delete userAttempts[testId];
        refreshAnalytics();
        renderTests();
    } catch(e) {}
};
`
);

// 3. Update saveAttempt logic
app = app.replace(
  /export async function saveAttempt\(attempt\)\{[\s\S]*?return true;\s*\}/m,
  `export async function saveAttempt(attempt){
    if(!db||!user)return false;
    const attemptDocRef = doc(db, 'users', user.uid, 'attempts', attempt.testId);
    await setDoc(attemptDocRef, {...attempt, createdAt:serverTimestamp()});
    
    const snap = await getDocs(collection(db, 'users', user.uid, 'attempts'));
    let bestAttempts = {};
    snap.forEach(d => {
       let a = d.data();
       if (!a.testId) a.testId = d.id;
       if (!bestAttempts[a.testId] || (a.createdAt && bestAttempts[a.testId].createdAt && a.createdAt.toMillis() > bestAttempts[a.testId].createdAt.toMillis())) {
           bestAttempts[a.testId] = a;
       }
    });

    let totalTests = 0, totalScore = 0, totalQuestions = 0, totalCorrect = 0;
    Object.values(bestAttempts).forEach(a => {
      totalTests++;
      totalScore += Number(a.score||0);
      totalQuestions += Number(a.questions||0);
      totalCorrect += Number(a.correct||0);
    });
    let accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    await setDoc(doc(db,'users',user.uid),{
      lastActiveAt:serverTimestamp(), 
      displayName: $('#displayName').value || user.displayName || 'Anonymous',
      totalScore, totalTests, totalQuestions, totalCorrect, accuracy
    },{merge:true});
    return true;
  }`
);

// 4. Update iframe hook
app = app.replace(
  /iframe\.onload = \(\) => \{\s*const win = iframe\.contentWindow;/,
  `iframe.onload = () => {
      const win = iframe.contentWindow;
      try {
        const origRemove = win.localStorage.removeItem;
        win.localStorage.removeItem = function(key) {
            origRemove.apply(this, arguments);
            if (key.endsWith('_result')) {
                const storageId = key.replace('_result', '');
                if (window.APP_API && window.APP_API.deleteAttemptByStorageId) {
                    window.APP_API.deleteAttemptByStorageId(storageId);
                }
            }
        };
      } catch(e) {}
`
);

// 5. Update refreshLeaderboard
app = app.replace(
  /usersArr\.sort\(\(a,b\) => \(b\.totalScore\|\|0\) - \(a\.totalScore\|\|0\)\);/,
  `usersArr.sort((a,b) => (b.totalTests||0) - (a.totalTests||0));`
);

// Change leaderboard columns and rows
app = app.replace(
  /<div style="font-size:10px; letter-spacing:2px; color:var\(--muted\);">TOTAL SCORE<\/div>/,
  `<div style="font-size:10px; letter-spacing:2px; color:var(--muted);">TOTAL TESTS</div>`
);

app = app.replace(
  /html \+= \`<div style="display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid rgba\(255,255,255,\.05\); \$\{isMe\?'color:#ff4265; font-weight:bold;':''\}"(>)[\s\S]*?<div style="display:flex; align-items:center; gap:12px;">[\s\S]*?<div style="width:28px; height:28px; border-radius:50%; background:rgba\(255,255,255,0\.1\); display:grid; place-items:center; font-size:12px; font-weight:700;">\$\{rank\}<\/div>[\s\S]*?<div style="font-size:15px;">\$\{u\.displayName \|\| 'Anonymous'\}<\/div>[\s\S]*?<\/div>[\s\S]*?<div style="font-size:18px; font-family:'Space Grotesk', sans-serif;">\$\{u\.totalScore \|\| 0\}<\/div>[\s\S]*?<\/div>\`;/m,
  `let initial = (u.displayName||'A').charAt(0).toUpperCase();
       let safeName = (u.displayName||'Anonymous').replace(/'/g, "\\\\'");
       html += \`<div onclick="showUserProfile('\${safeName}', \${u.totalTests||0}, \${u.totalQuestions||0}, \${u.accuracy||0}, '\${initial}')" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.05); \${isMe?'color:#ff4265; font-weight:bold;':''}">
          <div style="display:flex; align-items:center; gap:12px;">
             <div style="width:28px; height:28px; border-radius:50%; background:rgba(255,255,255,0.1); display:grid; place-items:center; font-size:12px; font-weight:700;">\${rank}</div>
             <div style="font-size:15px;">\${u.displayName || 'Anonymous'}</div>
          </div>
          <div style="font-size:18px; font-family:'Space Grotesk', sans-serif;">\${u.totalTests || 0}</div>
       </div>\`;`
);

app = app.replace(
  /<div style="font-size:18px; font-family:'Space Grotesk', sans-serif;">\$\{u\.totalScore \|\| 0\}<\/div>/g,
  `<div style="font-size:18px; font-family:'Space Grotesk', sans-serif;">\${u.totalTests || 0}</div>`
);

app = app.replace(
  /usersArr\.findIndex\(x => x\.id === user\.uid\) \+ 1;/,
  `usersArr.findIndex(x => x.id === user.uid) + 1;
             const u = usersArr.find(x => x.id === user.uid) || myDoc.data();`
);

// 6. Update refreshAnalytics sorting and deduplicating
// wait, we only want the most recent attempt per testId here too!
app = app.replace(
  /snap\.forEach\(d => docsArr\.push\(d\.data\(\)\)\);/,
  `let bestAttempts = {};
      snap.forEach(d => {
         let a = d.data();
         if (!a.testId) a.testId = d.id;
         if (!bestAttempts[a.testId] || (a.createdAt && bestAttempts[a.testId].createdAt && a.createdAt.toMillis() > bestAttempts[a.testId].createdAt.toMillis())) {
             bestAttempts[a.testId] = a;
         }
      });
      Object.values(bestAttempts).forEach(a => docsArr.push(a));`
);

fs.writeFileSync('app.js', app);
