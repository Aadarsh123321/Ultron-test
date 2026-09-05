import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, getCountFromServer, where, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { testsData } from './tests-data.js';

const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const navItems=[['home','⌂','Home'],['practice','✦','Practice'],['tests','◈','Tests'],['analytics','◒','Analytics'],['leaderboard','♛','Leaderboard']];
$('#nav').innerHTML=navItems.map(x=>`<button class="nav-item" data-section="${x[0]}"><span>${x[1]}</span><b>${x[2]}</b></button>`).join('');
const cards=[['⚡','Quick Practice','Short focused sessions.'],['◈','Full Mock','Plug your CBT paper here.'],['⌁','Mistake Lab','Revisit weak questions.'],['✦','Daily Challenge','Build a streak every day.']];
$('#practiceCards').innerHTML=cards.map(c=>`<article class="practice-card"><div class="icon">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p></article>`).join('');

let app,auth,db,user=null;
const configured=!firebaseConfig.apiKey.startsWith('PASTE_')&&!firebaseConfig.projectId.startsWith('YOUR_');
if(configured){app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);onAuthStateChanged(auth,handleUser);}else{toast('Add Firebase config to enable Google sync.');}

async function handleUser(u){user=u;if(u){const first=(u.displayName||'Student').trim().split(/\s+/)[0];$('#hello').textContent=`Hi, ${first.toUpperCase()}`;$('#hello').classList.remove('hidden');$('#loginBtn').classList.add('hidden');$('#profileWrap').classList.remove('hidden');$('#avatarImg').src=u.photoURL||avatarSVG(first);$('#profileEmail').textContent=u.email||'';await loadProfile();
    await fetchUserAttempts();
  }else{
    userAttempts = {};
    renderTests();user=null;$('#hello').classList.add('hidden');$('#loginBtn').classList.remove('hidden');$('#profileWrap').classList.add('hidden');}}
function avatarSVG(t){return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#51051d"/><text x="50" y="58" text-anchor="middle" fill="white" font-size="42" font-family="Arial">${t[0]||'N'}</text></svg>`)}
$('#loginBtn').onclick=async()=>{if(!configured)return toast('First paste your Firebase config.');try{await signInWithPopup(auth,new GoogleAuthProvider());toast('Welcome.')}catch(e){toast(e.code?.includes('popup')?'Popup was blocked. Allow popups and try again.':e.message)}};
$('#logoutBtn').onclick=()=>configured&&signOut(auth);$('#profileBtn').onclick=()=>$('#profileMenu').classList.toggle('open');document.addEventListener('click',e=>{if(!$('#profileWrap').contains(e.target))$('#profileMenu').classList.remove('open')});

function showPage(id){$$('.page').forEach(p=>p.classList.toggle('active',p.id===id));$$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.section===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='analytics')refreshAnalytics();if(id==='leaderboard')refreshLeaderboard();}
$$('.nav-item').forEach(b=>b.onclick=()=>showPage(b.dataset.section));$('#practiceBtn').onclick=()=>showPage('practice');$('#exploreBtn').onclick=()=>showPage('tests');$('#brandBtn').onclick=()=>showPage('home');if($('#openCBT'))$('#openCBT').onclick=()=>{toast('CBT hook ready — connect your existing module.');window.dispatchEvent(new CustomEvent('open-cbt'))};
$('#sideToggle').onclick=()=>$('#sidebar').classList.toggle('collapsed');
$('#saveSettings').onclick=async()=>{
    if(!user||!db)return toast('Sign in first.');
    const newName = $('#displayName').value || user.displayName;
    await setDoc(doc(db,'users',user.uid),{displayName:newName,updatedAt:serverTimestamp()},{merge:true});
    toast('Settings synced.');
    const first = newName.trim().split(/\s+/)[0];
    $('#hello').textContent = 'Hi, ' + first.toUpperCase();
    $('#profileEmail').textContent = user.email || '';
  };
async function loadProfile(){if(!db||!user)return;const s=await getDoc(doc(db,'users',user.uid));if(s.exists()&&s.data().displayName){
    $('#displayName').value=s.data().displayName;
    const first = s.data().displayName.trim().split(/\s+/)[0];
    $('#hello').textContent = 'Hi, ' + first.toUpperCase();
  } else {
    $('#displayName').value=user.displayName||'';
  }}
export async function saveAttempt(attempt){
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
  }
async function refreshAnalytics(){
    if(!db||!user){$('#activity').textContent='Sign in to sync your analytics across devices.';return;}
    try {
      const snap=await getDocs(collection(db,'users',user.uid,'attempts'));
      let docsArr = [];
      let bestAttempts = {};
      snap.forEach(d => {
         let a = d.data();
         if (!a.testId) a.testId = d.id;
         if (!bestAttempts[a.testId] || (a.createdAt && bestAttempts[a.testId].createdAt && a.createdAt.toMillis() > bestAttempts[a.testId].createdAt.toMillis())) {
             bestAttempts[a.testId] = a;
         }
      });
      Object.values(bestAttempts).forEach(a => docsArr.push(a));
      docsArr.sort((a,b) => {
        let ta = a.createdAt ? (typeof a.createdAt.toMillis === 'function' ? a.createdAt.toMillis() : Date.now()) : 0;
        let tb = b.createdAt ? (typeof b.createdAt.toMillis === 'function' ? b.createdAt.toMillis() : Date.now()) : 0;
        return tb - ta;
      });
      if (docsArr.length > 50) docsArr = docsArr.slice(0, 50);
      
      // We will iterate over docsArr instead of snap
      let tests=0,q=0,correct=0;const rows=[];
      docsArr.forEach(a=>{
        tests++;
        q+=Number(a.questions||0);
        correct+=Number(a.correct||0);
        const dt = a.createdAt ? new Date((typeof a.createdAt.toMillis === 'function' ? a.createdAt.toMillis() : Date.now())).toLocaleDateString() : '';
        rows.push(`<div style="display:flex; justify-content:space-between; padding:14px 0; border-bottom:1px solid rgba(255,255,255,.07); align-items:center;">
          <div style="display:flex; flex-direction:column; gap:4px; text-align:left;">
             <strong style="color:white; font-size:15px;">${a.title||'Test Attempt'}</strong>
             <span style="font-size:12px; color:var(--muted);">${dt}</span>
          </div>
          <div style="text-align:right;">
             <strong style="color:#ff4668; font-size:16px;">${a.score??0} / ${a.totalMarks??300}</strong>
             <div style="font-size:12px; color:var(--muted);">${a.questions} attempted</div>
          </div>
        </div>`);
      });
      $('#mTests').textContent=tests;
      $('#mQuestions').textContent=q;
      $('#mAccuracy').textContent=q?Math.round(correct/q*100)+'%':'—';
      $('#activity').innerHTML=rows.length?rows.slice(0,8).join(''):'No synced attempts yet.';
    } catch (e) {
      console.error(e);
      $('#activity').textContent='Error loading analytics. Make sure index exists or check console.';
    }
  }
function toast(msg){const t=$('#toast');t.textContent=msg;t.style.opacity=1;t.style.transform='translate(-50%,0)';clearTimeout(window._toast);window._toast=setTimeout(()=>{t.style.opacity=0;t.style.transform='translate(-50%,20px)'},3000)}

async function refreshLeaderboard(){
  if(!db){
    $('#leaderboardList').innerHTML='<div style="padding:40px 0;text-align:center;">Firebase not connected</div>';
    return;
  }
  try {
    const snap = await getDocs(collection(db,'users'));
    let usersArr = [];
    snap.forEach(d => {
       usersArr.push({ id: d.id, ...d.data() });
    });
    usersArr.sort((a,b) => (b.totalTests||0) - (a.totalTests||0));
    
    let html = '';
    let rank = 1;
    let foundMe = false;
    
    let top10 = usersArr.slice(0, 10);
    top10.forEach(u => {
       const isMe = user && u.id === user.uid;
       if (isMe) foundMe = true;
       let initial = (u.displayName||'A').charAt(0).toUpperCase();
       let safeName = (u.displayName||'Anonymous').replace(/'/g, "\\'");
       html += `<div onclick="showUserProfile('${safeName}', ${u.totalTests||0}, ${u.totalQuestions||0}, ${u.accuracy||0}, '${initial}')" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.05); ${isMe?'color:#ff4265; font-weight:bold;':''}">
          <div style="display:flex; align-items:center; gap:12px;">
             <div style="width:28px; height:28px; border-radius:50%; background:rgba(255,255,255,0.1); display:grid; place-items:center; font-size:12px; font-weight:700;">${rank}</div>
             <div style="font-size:15px;">${u.displayName || 'Anonymous'}</div>
          </div>
          <div style="font-size:18px; font-family:'Space Grotesk', sans-serif;">${u.totalTests || 0}</div>
       </div>`;
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
             const myRank = usersArr.findIndex(x => x.id === user.uid) + 1;
             const u = usersArr.find(x => x.id === user.uid) || myDoc.data();
             $('#currentUserRank').innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center; color:#ff4265; font-weight:bold;">
                 <div style="display:flex; align-items:center; gap:12px;">
                   <div style="width:28px; height:28px; border-radius:50%; background:rgba(255,42,85,0.2); display:grid; place-items:center; font-size:12px;">${myRank}</div>
                   <div style="font-size:15px;">${u.displayName || 'You'}</div>
                 </div>
                 <div style="font-size:18px; font-family:'Space Grotesk', sans-serif;">${u.totalTests || 0}</div>
             </div>`;
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
    $('#leaderboardList').innerHTML='<div style="padding:40px 0;text-align:center;color:red;">Error loading leaderboard. Please update your Firestore Rules in Firebase Console to allow global reads on the users collection: <br><br><code>match /users/{uid} { allow read: if true; }</code></div>';
  }
}

window.APP_API={get user(){return user},saveAttempt,showPage,toast};
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
             const sId = 'embedded-jee-cbt-' + fileName.replace('.html','').replace(/[\s\(\)]+/g, '_').replace(/_$/, '');
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


window.CBT_SAVE_RESULT = async (payload) => {
  if (window.APP_API && window.APP_API.saveAttempt) {
    let title = payload.testId.replace('embedded-jee-cbt-', '').replace(/_/g, ' ');
    
    // Find the corresponding grid ID (t.id) for this storage ID
    let gridTestId = payload.testId; // fallback
    if (typeof testsData !== 'undefined') {
       for (const t of testsData) {
          let found = false;
          for (const p of t.papers) {
             if (p.url === '#') continue;
             const fileName = p.url.split('/').pop();
             const storageId = 'embedded-jee-cbt-' + fileName.replace('.html','').replace(/[\s\(\)]+/g, '_').replace(/_$/, '');
             if (storageId === payload.testId) {
                gridTestId = t.id;
                title = t.title;
                found = true;
                break;
             }
          }
          if (found) break;
       }
    }

    let attempt = {
       title: title,
       score: payload.score,
       totalMarks: payload.maxScore,
       timeUsed: payload.timeUsed,
       questions: Object.values(payload.subjects||{}).reduce((acc, sub) => acc + (sub.attempted || 0), 0),
       correct: Object.values(payload.subjects||{}).reduce((acc, sub) => acc + (sub.correct || 0), 0),
       wrong: Object.values(payload.subjects||{}).reduce((acc, sub) => acc + (sub.wrong || 0), 0),
       storageId: payload.testId,
       payloadStr: JSON.stringify(payload),
       testId: gridTestId 
    };
    window.APP_API.saveAttempt(attempt).catch(e => console.log('Sync failed', e));
  }
  // Try to load attempts locally in case the test was just finished
  if (typeof loadLocalAttempts === 'function') loadLocalAttempts();
  if (typeof renderTests === 'function') renderTests();
};

// Test grid data & logic

let currentCategory = 'ja';
let universalFilter = 'all';
let searchQuery = '';
let userAttempts = {};

let jmFilter = 'all';

function loadLocalAttempts() {
  testsData.forEach(t => {
    let totalScore = 0;
    let totalMax = 0;
    let completedCount = 0;
    t.papers.forEach(p => {
       if(p.url === '#') return;
       const fileName = p.url.split('/').pop();
       const storageId = 'embedded-jee-cbt-' + fileName.replace('.html','').replace(/[\s\(\)]+/g, '_').replace(/_$/, '');
       const resStr = localStorage.getItem(storageId + '_result');
       if(resStr) {
          try {
            const res = JSON.parse(resStr);
            totalScore += res.score || 0;
            totalMax += res.maxScore || 0;
            completedCount++;
          } catch(e){}
       }
    });
    if (completedCount > 0) {
       if (!userAttempts[t.id]) userAttempts[t.id] = { score: 0, totalMarks: 0 };
       userAttempts[t.id].score = totalScore;
       userAttempts[t.id].totalMarks = totalMax;
    }
  });
}

window.addEventListener('focus', () => {
  if (document.getElementById('testGrid')) {
    loadLocalAttempts();
    renderTests();
  }
});

function renderTests() {
  const grid = $('#testGrid');
  if(!grid) return;
  let filtered = testsData.filter(t => t.category === currentCategory);
  if (currentCategory === 'universal' && universalFilter !== 'all') {
    filtered = filtered.filter(t => t.subcat === universalFilter);
  }
  if (currentCategory === 'jm' && jmFilter !== 'all') {
    filtered = filtered.filter(t => t.subcat === jmFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t => t.title.toLowerCase().includes(q));
  }
  
  grid.innerHTML = filtered.map(t => {
    const attempt = userAttempts[t.id];
    const isCompleted = !!attempt;
    const scoreHtml = isCompleted ? `<div class="test-score">${attempt.score} / ${attempt.totalMarks || 360}</div>` : '';
    const classStr = isCompleted ? 'test-card completed' : 'test-card';
    const papersHtml = t.papers.map(p => {
      const url = p.url.startsWith('#') ? p.url : encodeURI(p.url);
      return `<button onclick="openTest('${url}'); event.stopPropagation();" class="paper-btn">${p.name}</button>`;
    }).join('');
    return `<div class="${classStr}" onclick="this.classList.toggle('expanded')">${scoreHtml}<div class="test-title">${t.title}</div><div class="paper-list">${papersHtml}</div></div>`;
  }).join('');
}

$$('.cat-btn').forEach(btn => {
  btn.onclick = () => {
    $$('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    
    if(currentCategory === 'universal') $('#universalFilters').classList.remove('hidden');
    else $('#universalFilters').classList.add('hidden');
    
    if(currentCategory === 'jm') $('#jmFilters').classList.remove('hidden');
    else $('#jmFilters').classList.add('hidden');
    
    renderTests();
  };
});
$$('.filter-btn').forEach(btn => {
  btn.onclick = () => {
    const parent = btn.parentElement;
    parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if(parent.id === 'universalFilters') universalFilter = btn.dataset.filter;
    if(parent.id === 'jmFilters') jmFilter = btn.dataset.filter;
    renderTests();
  };
});
$('#testSearch')?.addEventListener('input', e => {
  searchQuery = e.target.value;
  renderTests();
});

// Load test attempts globally to show score
async function fetchUserAttempts() {
  if (!db || !user) return;
  const snap = await getDocs(query(collection(db, 'users', user.uid, 'attempts')));
  snap.forEach(d => {
    const a = d.data();
    if (a.testId) {
      if (!userAttempts[a.testId]) userAttempts[a.testId] = { score: 0, totalMarks: 0 };
      userAttempts[a.testId].score = Math.max(userAttempts[a.testId].score, Number(a.score || 0));
      userAttempts[a.testId].totalMarks = Math.max(userAttempts[a.testId].totalMarks, Number(a.totalMarks || 180));
    }
    if (a.storageId && a.payloadStr) {
      try {
        localStorage.setItem(a.storageId + '_result', a.payloadStr);
      } catch(e) {}
    }
  });
  loadLocalAttempts(); // re-merge local overrides
  // Auto-sync missing local attempts to Firebase
  if (db && user) {
     let existingStorageIds = new Set();
     snap.forEach(d => {
       if (d.data().storageId) existingStorageIds.add(d.data().storageId);
     });
     testsData.forEach(t => {
       t.papers.forEach(p => {
         if (p.url === '#') return;
         const fileName = p.url.split('/').pop();
         const storageId = 'embedded-jee-cbt-' + fileName.replace('.html','').replace(/[\s\(\)]+/g, '_').replace(/_$/, '');
         if (!existingStorageIds.has(storageId)) {
           const resStr = localStorage.getItem(storageId + '_result');
           if (resStr) {
             try {
               const payload = JSON.parse(resStr);
               let attempt = {
                 title: t.title,
                 score: payload.score,
                 totalMarks: payload.maxScore,
                 timeUsed: payload.timeUsed,
                 questions: Object.values(payload.subjects||{}).reduce((acc, sub) => acc + (sub.attempted || 0), 0),
                 correct: Object.values(payload.subjects||{}).reduce((acc, sub) => acc + (sub.correct || 0), 0),
                 wrong: Object.values(payload.subjects||{}).reduce((acc, sub) => acc + (sub.wrong || 0), 0),
                 storageId: payload.testId || storageId,
                 payloadStr: resStr,
                 testId: t.id
               };
               window.APP_API.saveAttempt(attempt).catch(e => console.log('Auto-sync failed', e));
             } catch(e) {}
           }
         }
       });
     });
  }
  renderTests();
}

// Hook into existing handleUser to fetch attempts
// Initial render
loadLocalAttempts();
renderTests();

window.openTest = async function(url) {
  if (url === '#') return;
  try {
    const overlay = document.getElementById('testPlayerOverlay');
    overlay.classList.remove('hidden');
    const iframe = document.getElementById('testIframe');
    const res = await fetch(url);
    let html = await res.text();
    const antiInspectScript = `
    <script>
        document.addEventListener('contextmenu', event => event.preventDefault());
        document.addEventListener('keydown', event => {
            if(event.key === 'F12' || (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) || (event.ctrlKey && event.key === 'u')) {
                event.preventDefault();
            }
        });
        document.addEventListener('copy', event => event.preventDefault());
    </script>
    `;
    if(html.includes('</head>')) {
      html = html.replace('</head>', antiInspectScript + '</head>');
    } else {
      html = antiInspectScript + html;
    }
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();
  } catch (err) {
    console.error("Failed to load test:", err);
    toast("Failed to load the test. Please check connection.");
  }
};

document.getElementById('closeTestBtn')?.addEventListener('click', () => {
  document.getElementById('testPlayerOverlay').classList.add('hidden');
  document.getElementById('testIframe').src = 'about:blank'; // clean memory
  loadLocalAttempts();
  renderTests();
});