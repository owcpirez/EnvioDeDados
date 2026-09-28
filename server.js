const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT) || 5500;
const files = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/style.css', 'style.css'],
  ['/script.js', 'script.js']
]);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

http.createServer((request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  const filename = files.get(pathname);

  if (!filename) {
    response.writeHead(404).end('Not found');
    return;
  }

  fs.readFile(path.join(__dirname, filename), (error, content) => {
    if (error) {
      response.writeHead(500).end('Could not read file');
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filename)]
    });
    response.end(content);
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`Formulário disponível em http://localhost:${port}`);
});