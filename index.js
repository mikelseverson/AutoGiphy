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

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
    }
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);
