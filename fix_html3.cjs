const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

let startMatch = /function start\(\)\{[^}]+\}/g;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Check if we already modified it
    if (content.includes("let res=localStorage.getItem(TEST_STORAGE_ID+'_result');")) {
        return;
    }
    
    let replacement = `function start(){initSubjectTime();restoreDraft();let res=localStorage.getItem(TEST_STORAGE_ID+'_result');if(res){try{let r=JSON.parse(res);renderResult(r.score,r.maxScore,r.subjectBreakdown,true,r.usedTime||0);return;}catch(e){}}renderTabs();render();$('#timer').textContent=formatTime(remaining);lastTick=Date.now();timerId=setInterval(tick,1000)}`;

    content = content.replace(startMatch, replacement);
    fs.writeFileSync(f, content);
});

