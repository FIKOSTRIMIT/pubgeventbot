const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const apiBase = process.env.API_BASE || 'https://your-backend.koyeb.app';

let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace('__API_BASE__', apiBase);

fs.writeFileSync(indexPath, html);
console.log(`Build complete. API_BASE set to: ${apiBase}`);