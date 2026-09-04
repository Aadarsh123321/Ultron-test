const fs = require('fs');
const path = require('path');
const dir = './public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if we already applied this specific fix
    if (!content.includes('window.location.href="/"')) {
        const securityScript = `<script>
if(window.self === window.top) { window.location.href = "/"; }
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => { if(e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || (e.ctrlKey && e.key === 'u')) e.preventDefault(); });
document.addEventListener('copy', e => e.preventDefault());
</script>`;
        content = content.replace('</head>', securityScript + '\n</head>');
        fs.writeFileSync(filePath, content);
        console.log('Secured', file);
    }
}
console.log('Done');
