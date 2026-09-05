const fs = require('fs');
const path = require('path');

const dirs = ['public/mains', 'public/advanced', 'public/universal'];

const newRenderResult = `function renderResult(total,max,by,auto,used){
    $('#exam').classList.add('hidden');
    $('#result').style.display='block';
    $('#timer').style.display='none';
    $('#submit').textContent='Reattempt';
    $('#submit').onclick=reattempt;
    $('#submit').style.display='inline-block';
    let pct=max?Math.max(0,total/max*100):0;
    $('#finalScore').textContent=\`\${total} / \${max}\`;
    $('#finalPct').textContent=\`\${pct.toFixed(1)}% · Time used \${formatTime(used)}\`;
    $('#finalBand').textContent=band(pct)+(auto?' · Time ended':'');
    
    by = by || {};
    $('#subjects').innerHTML=subjects().map(s=>{
        let x=by[s]||{score:0,max:0,correct:0,wrong:0};
        let p=x.max?Math.max(0,x.score/x.max*100):0;
        return \`<div class="subject"><b>\${s}</b><div class="score" style="font-size:25px">\${x.score} / \${x.max}</div><div class="bar"><i style="width:\${Math.max(0,Math.min(100,p))}%;"></i></div><div class="muted">\${p.toFixed(1)}% · \${band(p)} · \${x.correct} correct · \${x.wrong} wrong · Time \${formatTime(subjectTime[s]||0)}</div></div>\`
    }).join('');

    function getOptTxt(q, ids){
        if(ids===null||ids===undefined||ids==='')return '—';
        if(q.type==='Numeric') return String(ids);
        let mapId = (id) => {
            let idx=(q.options||[]).findIndex(o=>o.id===id);
            return idx>=0?String.fromCharCode(65+idx):id;
        };
        if(Array.isArray(ids)) return ids.map(mapId).join(', ');
        return mapId(ids);
    }

    $('#analysis').innerHTML=QUESTIONS.map((q,i)=>{
        let ansVal = answers[i];
        if (Array.isArray(ansVal) && ansVal.length === 0) ansVal = null;
        let att = (ansVal !== null && ansVal !== undefined && ansVal !== '');
        let ok = att && isCorrect(q,ansVal);
        let status = !att?'UNATTEMPTED':ok?'CORRECT':'INCORRECT';
        let cls = status==='CORRECT'?'correct':status==='INCORRECT'?'wrong':'';
        let ua = att ? getOptTxt(q, ansVal) : '—';
        let ca = q.type==='Numeric' ? q.correctText : getOptTxt(q, q.correctOptionIds||[q.correctOptionId]);
        return \`<div class="review-item \${cls}"><div class="label \${status==='CORRECT'?'good':status==='INCORRECT'?'bad':''}">\${status}</div><h3>Question \${i+1} · \${q.subject}</h3><div>\${(q.questionImages?.en||[]).map(u=>\`<img src="\${u}" loading="lazy">\`).join('')}</div><div class="answerline"><b>Your answer:</b> \${ua} &nbsp; <b>Correct:</b> \${ca}</div><button class="action" onclick="this.nextElementSibling.classList.toggle('hidden')">See Solution</button><div class="solution hidden">\${(q.solutionImages?.en||[]).map(u=>\`<img src="\${u}" loading="lazy">\`).join('')}</div></div>\`
    }).join('');
}`;

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    files.forEach(f => {
        const p = path.join(dir, f);
        let content = fs.readFileSync(p, 'utf8');
        
        // Replace renderResult
        content = content.replace(/function renderResult\(total,max,by,auto,used\)\{.*?\n\}\n?function persistResult/s, newRenderResult + '\nfunction persistResult');
        
        // Fix the blank screen bug in start() where r.subjectBreakdown was passed instead of r.subjects
        content = content.replace(/renderResult\(r\.score,r\.maxScore,r\.subjectBreakdown,true,r\.usedTime\|\|0\)/g, 'renderResult(r.score,r.maxScore,r.subjects,true,r.timeUsed||0)');

        // Just to be safe, also replace any remaining single line ones
        content = content.replace(/function renderResult\(total,max,by,auto,used\)\{.*?\}\s*function persistResult/s, newRenderResult + '\nfunction persistResult');

        fs.writeFileSync(p, content);
    });
});
console.log("HTML files patched.");
