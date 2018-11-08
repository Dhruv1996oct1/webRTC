
const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');
var path = require('path');
const app = express();


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'dist/web-RTC-Pusher')));
// Session middleware

// Create an instance of Pusher

const pusher = new Pusher({
    appId: '638298',
    key: 'ed4324c3f7a8ff4fa128',
    secret: '605405c05868a4aaa40f',
    cluster: 'ap2',
    encrypted: true
});

var usersOnCall = [];

// get authentictation for the channel;
app.post('/pusher/auth', (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    var presenceData = {
        user_id: Math.random().toString(36).slice(2) + Date.now()
    }
    const auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
});

/* app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/web-RTC-Pusher/index.html'));
}); */

app.get('/api/getUsersOnCall', (req, res) => {
    res.json({ "usersOnCall": usersOnCall });
});

app.post('/api/usersOnCall', (req, res) => {
    usersOnCall = req.body.usersOnCall;
    pusher.trigger("presence-videocall", "usersOnCall", {
        usersOnCall: req.body.usersOnCall
    });
    res.json({ "success": true });
});

//listen on the app
app.listen(process.env.PORT || 3000, () => {
    return console.log('Server is up on', app.settings.env)
});
