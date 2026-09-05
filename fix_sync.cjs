const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Update CBT_SAVE_RESULT to pass payloadStr and storageId
app = app.replace(
  /wrong: Object\.values\(payload\.subjects\|\|\{\}\)\.reduce\(\(acc, sub\) => acc \+ \(sub\.wrong \|\| 0\), 0\),/,
  `wrong: Object.values(payload.subjects||{}).reduce((acc, sub) => acc + (sub.wrong || 0), 0),
       storageId: payload.testId,
       payloadStr: JSON.stringify(payload),`
);

// Update fetchUserAttempts to restore local storage
app = app.replace(
  /async function fetchUserAttempts\(\) \{[\s\S]*?loadLocalAttempts\(\); \/\/ re-merge local overrides/m,
  `async function fetchUserAttempts() {
  if (!db || !user) return;
  const snap = await getDocs(query(collection(db, 'users', user.uid, 'attempts')));
  snap.forEach(d => {
    const a = d.data();
    if (a.testId) {
      if (!userAttempts[a.testId]) userAttempts[a.testId] = { score: 0, totalMarks: 0 };
      userAttempts[a.testId].score = Math.max(userAttempts[a.testId].score, Number(a.score || 0));
      userAttempts[a.testId].totalMarks = Math.max(userAttempts[a.testId].totalMarks, Number(a.totalMarks || 180));
    }
    if (a.storageId && a.payloadStr) {
      try {
        localStorage.setItem(a.storageId + '_result', a.payloadStr);
      } catch(e) {}
    }
  });
  loadLocalAttempts(); // re-merge local overrides`
);

fs.writeFileSync('app.js', app);
