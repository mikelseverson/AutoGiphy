var express = require('express');
var app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'super-gipfy-secret') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
