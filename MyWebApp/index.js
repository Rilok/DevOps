const express = require('express');

const app = express();

console.log('New request');
app.get('/', (req, res) => {
  res.send('Hello fron docker node app');
});

app.listen(8080, () => {
  console.log('Listening on port 8080');
});


