const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Remove the garbage line 103
app = app.replace(/const snap=await getDocs\(query\(collection\(db,'users',user\.uid,'attempts'\),orderBy\('createdAt','desc'\),limit\(50\)\)\);let tests=0,q=0,correct=0;const rows=\[\];snap\.forEach\(d=>\{const a=d\.data\(\);tests\+\+;q\+=Number\(a\.questions\|\|0\);correct\+=Number\(a\.correct\|\|0\);rows\.push\(\`\$\{a\.title\|\|'CBT Attempt'\} — \$\{a\.score\?\?'—'\} score\`\)\}\);\$\('#mTests'\)\.textContent=tests;\$\('#mQuestions'\)\.textContent=q;\$\('#mAccuracy'\)\.textContent=q\?Math\.round\(correct\/q\*100\)\+'%':'—';\$\('#activity'\)\.innerHTML=rows\.length\?rows\.slice\(0,8\)\.map\(x=>\`<div style="padding:9px 0;border-bottom:1px solid rgba\\(255,255,255,\.07\\)">\$\{x\}<\/div>\`\)\.join\(''\):'No synced attempts yet\.';\}/, '');

fs.writeFileSync('app.js', app);
