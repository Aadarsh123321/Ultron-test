const fs = require('fs');

let content = fs.readFileSync('tests-data.js', 'utf8');

// Advanced Test paths
content = content.replace(/url:\s*\`Test \$\{num\} \(Advanced\) \(Paper 01\)\.html\`/g, "url: `advanced/Test ${num} (Advanced) (Paper 01).html`");
content = content.replace(/url:\s*\`Test \$\{num\} \(Advanced\) \(Paper 02\)\.html\`/g, "url: `advanced/Test ${num} (Advanced) (Paper 02).html`");

// Universal Test paths
content = content.replace(/url:\s*'Universe test /g, "url: 'universal/Universe test ");

// Mains Test paths
content = content.replace(/url:\s*'Mains Test /g, "url: 'mains/Mains Test ");

fs.writeFileSync('tests-data.js', content);
