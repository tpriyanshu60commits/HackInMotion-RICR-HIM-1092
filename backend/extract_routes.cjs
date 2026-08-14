const fs = require('fs');
const path = require('path');

let doc = '# BACKEND ROUTES AND APIS\n\n';

const routesDir = './routes';
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(routesDir, file), 'utf8');
  doc += '## ' + file + '\n';
  
  const routeRegex = /router\.(get|post|put|delete|patch)\(['"]([^'"]+)['"]/g;
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    doc += '- Method: ' + match[1].toUpperCase() + '\n';
    doc += '  Endpoint: ' + match[2] + '\n';
  }
  doc += '\n';
});

fs.writeFileSync('routes_doc.md', doc);
console.log('Routes doc generated.');
