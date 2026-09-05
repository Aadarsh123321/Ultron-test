const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

index = index.replace(
  /<div class="empty-card">.*?<\/div><\/section>/,
  `<div class="leaderboard-card" style="max-width:800px; margin:0; padding:0; background:rgba(20,4,12,0.8); border:1px solid var(--line); border-radius:22px; backdrop-filter:blur(18px); overflow:hidden;">
     <div style="padding:20px; border-bottom:1px solid var(--line); display:flex; justify-content:space-between; color:var(--muted); font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
        <span>Rank & Name</span><span>Total Score</span>
     </div>
     <div id="leaderboardList" style="padding:0 20px;">
        <div style="padding:40px 0; text-align:center; color:var(--muted);">Loading leaderboard...</div>
     </div>
     <div id="currentUserRank" style="padding:15px 20px; background:rgba(255,42,85,0.1); border-top:1px solid rgba(255,42,85,0.3); display:none;">
     </div>
   </div></section>`
);

// We still need to remove reduced motion manually in index.html just to be sure
index = index.replace(/<label>Reduced motion <input id="reducedMotion" type="checkbox"><\/label>/, '');

fs.writeFileSync('index.html', index);

let css = fs.readFileSync('styles.css', 'utf8');
css = css.replace(
  /\.login-btn\{[^}]+\}/,
  `.login-btn{padding:10px 16px;border:1px solid rgba(255,255,255,.13);border-radius:13px;background:#fff;color:#000;font-weight:600;backdrop-filter:blur(14px);transition:.2s}
.login-btn:hover{background:#e0e0e0;transform:translateY(-1px)}
.login-btn .google-g{color:#000;}`
);
fs.writeFileSync('styles.css', css);

