const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Insert sync logic into fetchUserAttempts
app = app.replace(
  /loadLocalAttempts\(\); \/\/ re-merge local overrides/,
  `loadLocalAttempts(); // re-merge local overrides
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
         const storageId = 'embedded-jee-cbt-' + fileName.replace('.html','').replace(/[\\s\\(\\)]+/g, '_').replace(/_$/, '');
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
  }`
);

fs.writeFileSync('app.js', app);
