/*
 NEXUS CBT BRIDGE
 Your existing CBT code can call:
   window.NEXUS.saveAttempt({
     title: 'JEE Mock 01',
     questions: 90,
     correct: 68,
     score: 260,
     durationSeconds: 7123,
     subjects: { physics: {questions:30, correct:24, time:2400}, chemistry:{}, maths:{} }
   });

 Then the attempt is stored under users/{uid}/attempts in Firestore and follows the Google account.
 You can also navigate with window.NEXUS.showPage('analytics').
*/
export {};
