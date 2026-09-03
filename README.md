# NEXUS CBT Website

A cinematic, responsive landing page + navigation shell for your existing CBT/test engine.

## Files
- `index.html` — app shell
- `styles.css` — glass/red UI + responsive design
- `app.js` — navigation, Google login, Firestore sync, analytics and animated universe
- `firebase-config.js` — paste Firebase Web App config here
- `modules-cbt-placeholder.js` — bridge showing how your existing CBT module can save attempts
- `firestore.rules` — private per-user rules

## Firebase setup
1. Create/open a Firebase project.
2. Add a Web App and copy its config into `firebase-config.js`.
3. Authentication → Sign-in method → enable Google.
4. Firestore Database → create database.
5. Publish the included `firestore.rules`.
6. Add your deployed domain to Authentication → Settings → Authorized domains.

## Connect your existing CBT
Your CBT code should import/use `window.NEXUS.saveAttempt(...)` after submission. See `modules-cbt-placeholder.js` for the object shape. This lets attempts, scores, question counts, time and subject analytics follow the same Google account on any device.

## Run
Because this uses ES modules and Firebase, serve the folder through a local server (VS Code Live Server, `python -m http.server`, Vercel, Netlify, etc.). Do not open `index.html` with `file://` for Firebase.
