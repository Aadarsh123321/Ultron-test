const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// 1. Update saveSettings
content = content.replace(
  /\$\('#saveSettings'\)\.onclick=async\(\)=>\{if\(\!user\|\|\!db\)return toast\('Sign in first\.'\);await setDoc\(doc\(db,'users',user\.uid\),\{displayName:\$\('#displayName'\)\.value\|\|user\.displayName,updatedAt:serverTimestamp\(\)\},\{merge:true\}\);toast\('Settings synced\.'\);\};/,
  `$('#saveSettings').onclick=async()=>{
    if(!user||!db)return toast('Sign in first.');
    const newName = $('#displayName').value || user.displayName;
    await setDoc(doc(db,'users',user.uid),{displayName:newName,updatedAt:serverTimestamp()},{merge:true});
    toast('Settings synced.');
    const first = newName.trim().split(/\\s+/)[0];
    $('#hello').textContent = 'Hi, ' + first.toUpperCase();
    $('#profileEmail').textContent = user.email || '';
  };`
);

// 2. Update loadProfile to also set hello tag if we fetched a name
content = content.replace(
  /if\(s\.exists\(\)&&s\.data\(\)\.displayName\)\$\('#displayName'\)\.value=s\.data\(\)\.displayName;else \$\('#displayName'\)\.value=user\.displayName\|\|'';/,
  `if(s.exists()&&s.data().displayName){
    $('#displayName').value=s.data().displayName;
    const first = s.data().displayName.trim().split(/\\s+/)[0];
    $('#hello').textContent = 'Hi, ' + first.toUpperCase();
  } else {
    $('#displayName').value=user.displayName||'';
  }`
);

// 3. Update handleUser upper casing name
content = content.replace(
  /const first=\(u\.displayName\|\|'Student'\)\.trim\(\)\.split\(\/\\s\+\/\)\[0\];\$\('#hello'\)\.textContent=\`Hi, \$\{first\}\`;/,
  `const first=(u.displayName||'Student').trim().split(/\\s+/)[0];$('#hello').textContent=\`Hi, \${first.toUpperCase()}\`;`
);

// 4. Update refreshAnalytics for better layout
content = content.replace(
  /async function refreshAnalytics\(\)\{.*?\}/s,
  `async function refreshAnalytics(){
    if(!db||!user){$('#activity').textContent='Sign in to sync your analytics across devices.';return;}
    try {
      const snap=await getDocs(query(collection(db,'users',user.uid,'attempts'),orderBy('createdAt','desc'),limit(50)));
      let tests=0,q=0,correct=0;const rows=[];
      snap.forEach(d=>{
        const a=d.data();
        tests++;
        q+=Number(a.questions||0);
        correct+=Number(a.correct||0);
        const dt = a.createdAt ? new Date(a.createdAt.toMillis()).toLocaleDateString() : '';
        rows.push(\`<div style="display:flex; justify-content:space-between; padding:14px 0; border-bottom:1px solid rgba(255,255,255,.07); align-items:center;">
          <div style="display:flex; flex-direction:column; gap:4px; text-align:left;">
             <strong style="color:white; font-size:15px;">\${a.title||'Test Attempt'}</strong>
             <span style="font-size:12px; color:var(--muted);">\${dt}</span>
          </div>
          <div style="text-align:right;">
             <strong style="color:#ff4668; font-size:16px;">\${a.score??0} / \${a.totalMarks??300}</strong>
             <div style="font-size:12px; color:var(--muted);">\${a.questions} attempted</div>
          </div>
        </div>\`);
      });
      $('#mTests').textContent=tests;
      $('#mQuestions').textContent=q;
      $('#mAccuracy').textContent=q?Math.round(correct/q*100)+'%':'—';
      $('#activity').innerHTML=rows.length?rows.slice(0,8).join(''):'No synced attempts yet.';
    } catch (e) {
      console.error(e);
      $('#activity').textContent='Error loading analytics. Make sure index exists or check console.';
    }
  }`
);

// 5. Update saveAttempt to sync leaderboard stats
content = content.replace(
  /export async function saveAttempt\(attempt\)\{.*?\}/s,
  `export async function saveAttempt(attempt){
    if(!db||!user)return false;
    await addDoc(collection(db,'users',user.uid,'attempts'),{...attempt,createdAt:serverTimestamp()});
    // Aggregation for leaderboard
    let totalScoreAgg = 0;
    Object.values(userAttempts).forEach(ua => totalScoreAgg += Number(ua.score||0));
    // add this latest attempt score since userAttempts might not be updated yet
    if (!userAttempts[attempt.testId]) {
      totalScoreAgg += attempt.score;
    } else {
      totalScoreAgg = totalScoreAgg - userAttempts[attempt.testId].score + Math.max(userAttempts[attempt.testId].score, attempt.score);
    }
    await setDoc(doc(db,'users',user.uid),{
      lastActiveAt:serverTimestamp(), 
      displayName: $('#displayName').value || user.displayName || 'Anonymous',
      totalScore: totalScoreAgg
    },{merge:true});
    return true;
  }`
);

fs.writeFileSync('app.js', content);
