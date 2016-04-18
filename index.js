var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var token = "CAAKN2CoQPMoBAFPfZC9R09PetZCgB6TS5f76iWR72xicgsgMOZAJ4HbsZAo1pZBHxCpwdctPZAscnjIlnZCStQyvkB1uS8AykNLZBj2LS0ZB1JQgQNMYSik1YenHwjaLh7DZBG6XU0QuZCnHfzZALxIlg2fEGwvrlgBOleibtFoqakZBTztXZBGoWOXJ2JQzfjy3g08bEZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.use(bodyParser.json())


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
  console.log(req.body);
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      console.log('text', text);
    }
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);
