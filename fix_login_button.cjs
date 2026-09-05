const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');
index = index.replace(
  /<button id="loginBtn" class="login-btn"><span class="google-g">G<\/span> Sign in with Google<\/button>/,
  `<button id="loginBtn" class="login-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="margin-right:8px;">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Sign In
    </button>`
);
fs.writeFileSync('index.html', index);

let css = fs.readFileSync('styles.css', 'utf8');
css = css.replace(
  /\.login-btn\{[^}]+\}/,
  `.login-btn{padding:10px 18px;border:none;border-radius:18px;background:#0d0d12;color:#ffffff;font-size:15px;font-weight:600;display:flex;align-items:center;transition:background .2s;cursor:pointer; font-family: 'Inter', sans-serif;}`
);
css = css.replace(
  /\.login-btn:hover\{[^}]+\}/,
  `.login-btn:hover{background:#1a1a24;}`
);
fs.writeFileSync('styles.css', css);

