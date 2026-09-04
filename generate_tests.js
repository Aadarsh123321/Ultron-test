import fs from 'fs';

let content = fs.readFileSync('tests-data.js', 'utf8');

// Find the universal test part
const uniEnd = content.indexOf('// JEE Mains');

let newData = content.substring(0, uniEnd);

newData += '// JEE Mains\n';
const files = fs.readdirSync('public/mains').filter(f => f.startsWith('Mains Test') && f.endsWith('.html'));
files.sort((a,b) => {
    const numA = parseInt(a.match(/Mains Test (\d+)/)[1], 10);
    const numB = parseInt(b.match(/Mains Test (\d+)/)[1], 10);
    return numA - numB;
});

let pyqTests = [];

files.forEach(f => {
    const match = f.match(/Mains Test (\d+)/);
    const num = match[1];
    const isPyp = f.includes('(pyp)');
    
    newData += `testsData.push({
  id: 'jm-${parseInt(num)}',
  title: 'Mains Test ${num}${isPyp ? ' (PYP)' : ''}',
  category: 'jm',
  subcat: '${isPyp ? 'pyp' : 'mock'}',
  papers: [
    { name: 'Full Paper', url: 'mains/${f}' }
  ]
});\n\n`;

    if (isPyp) {
        pyqTests.push({
            id: `pyq-jm-${parseInt(num)}`,
            title: `Mains Test ${num} (PYP)`,
            url: `mains/${f}`
        });
    }
});

newData += '// PYQ (from Mains)\n';
pyqTests.forEach((t, i) => {
    newData += `testsData.push({
  id: '${t.id}',
  title: '${t.title}',
  category: 'pyq',
  papers: [
    { name: 'Full Paper', url: '${t.url}' }
  ]
});\n\n`;
});

newData += `// AITS placeholder
for (let i = 1; i <= 10; i++) {
  testsData.push({
    id: \`aits-\${i}\`,
    title: \`AITS \${i}\`,
    category: 'aits',
    papers: [
      { name: 'Paper', url: \`#\` }
    ]
  });
}
`;

fs.writeFileSync('tests-data.js', newData);

