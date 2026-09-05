const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Inject refreshLeaderboard logic
const lbLogic = `
async function refreshLeaderboard(){
  if(!db){
    $('#leaderboardList').innerHTML='<div style="padding:40px 0;text-align:center;">Firebase not connected</div>';
    return;
  }
  try {
    const snap = await getDocs(query(collection(db,'users'), orderBy('totalScore','desc'), limit(10)));
    let html = '';
    let rank = 1;
    let foundMe = false;
    snap.forEach(d => {
       const u = d.data();
       const isMe = user && d.id === user.uid;
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
    if(html === '') html = '<div style="padding:40px 0;text-align:center;color:var(--muted);">No data yet.</div>';
    $('#leaderboardList').innerHTML = html;
    
    // Bottom rank for current user
    if (user && db) {
       if (foundMe) {
          $('#currentUserRank').style.display='none';
       } else {
          // get user's doc directly
          const myDoc = await getDoc(doc(db, 'users', user.uid));
          if (myDoc.exists()) {
             const u = myDoc.data();
             // rough rank estimation or just show score
             $('#currentUserRank').innerHTML = \`<div style="display:flex; justify-content:space-between; align-items:center; color:#ff4265; font-weight:bold;">
                 <div style="display:flex; align-items:center; gap:12px;">
                   <div style="width:28px; height:28px; border-radius:50%; background:rgba(255,42,85,0.2); display:grid; place-items:center; font-size:12px;">-</div>
                   <div style="font-size:15px;">\${u.displayName || 'You'}</div>
                 </div>
                 <div style="font-size:18px; font-family:'Space Grotesk', sans-serif;">\${u.totalScore || 0}</div>
             </div>\`;
             $('#currentUserRank').style.display='block';
          } else {
             $('#currentUserRank').style.display='none';
          }
       }
    } else {
       $('#currentUserRank').style.display='none';
    }
  } catch(e) {
    console.error(e);
    $('#leaderboardList').innerHTML='<div style="padding:40px 0;text-align:center;color:red;">Error loading leaderboard. Please ensure index on totalScore is built.</div>';
  }
}
`;

// Insert it before window.APP_API
app = app.replace('window.APP_API={', lbLogic + '\nwindow.APP_API={');

// Update showPage to call refreshLeaderboard
app = app.replace(
  /if\(id==='analytics'\)refreshAnalytics\(\);/,
  `if(id==='analytics')refreshAnalytics();if(id==='leaderboard')refreshLeaderboard();`
);

fs.writeFileSync('app.js', app);
