const fs = require('fs');
const path = require('path');
const dir = './public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if we already applied the fix
    if (!content.includes('let _res=localStorage.getItem(TEST_STORAGE_ID')) {
        content = content.replace(/start\(\);\s*<\/script><\/body><\/html>/, 
            "let _res=localStorage.getItem(TEST_STORAGE_ID+'_result');if(_res){let p=JSON.parse(_res);for(let i=0;i<answers.length;i++)answers[i]=p.answers[i];for(let i=0;i<reviewed.length;i++)reviewed[i]=p.reviewed[i];subjectTime=p.subjectTime;renderResult(p.score,p.maxScore,p.subjects,false,p.timeUsed);}else{start();}\n</script></body></html>"
        );
        fs.writeFileSync(filePath, content);
        console.log('Fixed', file);
    }
}
console.log('Done');
