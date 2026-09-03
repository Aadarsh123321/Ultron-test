import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
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

async function handleUser(u){user=u;if(u){const first=(u.displayName||'Student').trim().split(/\s+/)[0];$('#hello').textContent=`Hi, ${first}`;$('#hello').classList.remove('hidden');$('#loginBtn').classList.add('hidden');$('#profileWrap').classList.remove('hidden');$('#avatarImg').src=u.photoURL||avatarSVG(first);$('#profileEmail').textContent=u.email||'';await loadProfile();}else{user=null;$('#hello').classList.add('hidden');$('#loginBtn').classList.remove('hidden');$('#profileWrap').classList.add('hidden');}}
function avatarSVG(t){return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#51051d"/><text x="50" y="58" text-anchor="middle" fill="white" font-size="42" font-family="Arial">${t[0]||'N'}</text></svg>`)}
$('#loginBtn').onclick=async()=>{if(!configured)return toast('First paste your Firebase config.');try{await signInWithPopup(auth,new GoogleAuthProvider());toast('Welcome to NEXUS.')}catch(e){toast(e.code?.includes('popup')?'Popup was blocked. Allow popups and try again.':e.message)}};
$('#logoutBtn').onclick=()=>configured&&signOut(auth);$('#profileBtn').onclick=()=>$('#profileMenu').classList.toggle('open');document.addEventListener('click',e=>{if(!$('#profileWrap').contains(e.target))$('#profileMenu').classList.remove('open')});

function showPage(id){$$('.page').forEach(p=>p.classList.toggle('active',p.id===id));$$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.section===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='analytics')refreshAnalytics();}
$$('.nav-item').forEach(b=>b.onclick=()=>showPage(b.dataset.section));$('#practiceBtn').onclick=()=>showPage('practice');$('#exploreBtn').onclick=()=>showPage('tests');$('#brandBtn').onclick=()=>showPage('home');if($('#openCBT'))$('#openCBT').onclick=()=>{toast('CBT hook ready — connect your existing module.');window.dispatchEvent(new CustomEvent('open-cbt'))};
$('#sideToggle').onclick=()=>$('#sidebar').classList.toggle('collapsed');
$('#saveSettings').onclick=async()=>{if(!user||!db)return toast('Sign in first.');await setDoc(doc(db,'users',user.uid),{displayName:$('#displayName').value||user.displayName,updatedAt:serverTimestamp()},{merge:true});toast('Settings synced.');};
async function loadProfile(){if(!db||!user)return;const s=await getDoc(doc(db,'users',user.uid));if(s.exists()&&s.data().displayName)$('#displayName').value=s.data().displayName;else $('#displayName').value=user.displayName||'';}
export async function saveAttempt(attempt){if(!db||!user)return false;await addDoc(collection(db,'users',user.uid,'attempts'),{...attempt,createdAt:serverTimestamp()});await setDoc(doc(db,'users',user.uid),{lastActiveAt:serverTimestamp()},{merge:true});return true;}
async function refreshAnalytics(){if(!db||!user){$('#activity').textContent='Sign in to sync your analytics across devices.';return}const snap=await getDocs(query(collection(db,'users',user.uid,'attempts'),orderBy('createdAt','desc'),limit(50)));let tests=0,q=0,correct=0;const rows=[];snap.forEach(d=>{const a=d.data();tests++;q+=Number(a.questions||0);correct+=Number(a.correct||0);rows.push(`${a.title||'CBT Attempt'} — ${a.score??'—'} score`)});$('#mTests').textContent=tests;$('#mQuestions').textContent=q;$('#mAccuracy').textContent=q?Math.round(correct/q*100)+'%':'—';$('#activity').innerHTML=rows.length?rows.slice(0,8).map(x=>`<div style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,.07)">${x}</div>`).join(''):'No synced attempts yet.';}
function toast(msg){const t=$('#toast');t.textContent=msg;t.style.opacity=1;t.style.transform='translate(-50%,0)';clearTimeout(window._toast);window._toast=setTimeout(()=>{t.style.opacity=0;t.style.transform='translate(-50%,20px)'},3000)}
window.NEXUS={get user(){return user},saveAttempt,showPage,toast};

// Cinematic red universe / energy field
const canvas=$('#universe'),ctx=canvas.getContext('2d');let W,H,dpr,particles=[],orbs=[],mouse={x:.5,y:.5},reduced=false;
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const n=Math.min(190,Math.floor(W*H/8500));particles=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random(),a:Math.random()*Math.PI*2,s:.2+Math.random()*1.2,r:.4+Math.random()*1.7}));orbs=Array.from({length:7},(_,i)=>({a:i/7*Math.PI*2,r:Math.min(W,H)*(.18+Math.random()*.22),s:(i%2?1:-1)*(.00025+Math.random()*.0003),x:0,y:0}))}resize();addEventListener('resize',resize);addEventListener('pointermove',e=>{mouse.x=e.clientX/W;mouse.y=e.clientY/H});
function frame(t){requestAnimationFrame(frame);ctx.clearRect(0,0,W,H);const cx=W*(.5+(mouse.x-.5)*.035),cy=H*(.47+(mouse.y-.5)*.035),max=Math.max(W,H);let g=ctx.createRadialGradient(cx,cy,0,cx,cy,max*.58);g.addColorStop(0,'rgba(255,10,55,.12)');g.addColorStop(.25,'rgba(180,0,40,.045)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 if(!reduced){for(const p of particles){p.a+=.001;p.x+=Math.cos(p.a)*p.s;p.y-=p.s*.22;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;const dx=p.x-cx,dy=p.y-cy,dist=Math.hypot(dx,dy);let alpha=.15+p.z*.45;if(dist<max*.25)alpha*=.3;ctx.beginPath();ctx.fillStyle=`rgba(255,${70+Math.floor(100*p.z)},${100+Math.floor(70*p.z)},${alpha})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}
 const R=Math.min(W,H)*.33;ctx.save();ctx.translate(cx,cy);ctx.globalCompositeOperation='lighter';for(let k=0;k<9;k++){ctx.rotate(.002*(k%2?1:-1));ctx.beginPath();for(let a=0;a<Math.PI*2;a+=.025){const rr=R*(.56+.09*Math.sin(a*3+k)+.025*Math.sin(a*17+t*.0007));const x=Math.cos(a)*rr,y=Math.sin(a)*rr*.48; if(a===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.strokeStyle=`rgba(255,${25+k*8},${55+k*7},${.025+k*.006})`;ctx.lineWidth=1+k*.18;ctx.stroke()}ctx.restore();
 for(const o of orbs){o.a+=o.s*16;o.x=cx+Math.cos(o.a)*o.r;o.y=cy+Math.sin(o.a)*o.r*.48;ctx.beginPath();ctx.fillStyle='rgba(255,90,115,.8)';ctx.shadowBlur=18;ctx.shadowColor='#ff174d';ctx.arc(o.x,o.y,1.3+o.r/450,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}}
}
requestAnimationFrame(frame);$('#reducedMotion').onchange=e=>{reduced=e.target.checked};

// Test grid data & logic

let currentCategory = 'ja';
let universalFilter = 'all';
let searchQuery = '';
let userAttempts = {};

function loadLocalAttempts() {
  testsData.forEach(t => {
    let totalScore = 0;
    let totalMax = 0;
    let completedCount = 0;
    t.papers.forEach(p => {
       if(p.url === '#') return;
       const storageId = 'embedded-jee-cbt-' + p.url.replace('.html','').replace(/[\s\(\)]+/g, '_').replace(/_$/, '');
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
      return `<a href="${url}" target="_blank" class="paper-btn" onclick="event.stopPropagation()">${p.name}</a>`;
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
    renderTests();
  };
});
$$('.filter-btn').forEach(btn => {
  btn.onclick = () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    universalFilter = btn.dataset.filter;
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
      userAttempts[a.testId].score += Number(a.score || 0);
      userAttempts[a.testId].totalMarks += Number(a.totalMarks || 180);
    }
  });
  loadLocalAttempts(); // re-merge local overrides
  renderTests();
}

// Hook into existing handleUser to fetch attempts
const originalHandleUser = handleUser;
handleUser = async function(u) {
  await originalHandleUser(u);
  if(u) {
    await fetchUserAttempts();
  } else {
    userAttempts = {};
    renderTests();
  }
};

// Initial render
loadLocalAttempts();
renderTests();
