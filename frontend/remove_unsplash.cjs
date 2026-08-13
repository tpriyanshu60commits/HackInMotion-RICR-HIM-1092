const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find style={{ ... }} blocks containing unsplash.com
  const regex = /style=\{\{[\s\S]*?unsplash\.com[\s\S]*?\}\}/g;
  
  if (regex.test(content)) {
    console.log('Replacing in', file);
    content = content.replace(regex, '');
    fs.writeFileSync(filePath, content);
  }
});
