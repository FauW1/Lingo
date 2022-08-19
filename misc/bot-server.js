// From https://replit.com/@BeauCarnes/Encourage-Bot-JS#server.js
// Require the express library
const express = require('express');
const path = require('node:path'); // require path for file paths

// server.use(express.static(path.join(__dirname, '..', 'public')));

// Create a server with express
const server = express();

// Responds to all HTTP requests
server.all('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'docs', 'index.html')); // try to move it to a docs folder outside of misc
  // res.sendFile(path.join(__dirname, 'docs', 'index.html')); // use bot page instead; edit based on https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files (IT WORKS AAAAAAAAA)
})

// Keeps repl.it instance alive
function keepAlive() {
  server.listen(3000, () => {
    console.log('Server is running.');
  })
}

//export to be used in index.js
module.exports = keepAlive;