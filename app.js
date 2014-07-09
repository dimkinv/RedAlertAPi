var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var poller = require('./poller');

var openSockets = [];

app.use('/bower_components', express.static(__dirname + '/bower_components'));


// view engine setup
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.get('/alert.wav', function (req, res) {
    res.sendfile('PANSIREN.WAV');
});

io.on('connection', function (socket) {
    openSockets.push(socket);
    console.log('socked connected');
});

poller.registerHandler(function (message) {
    for (var i = 0; i < openSockets.length; i++) {
        if (openSockets[i].lastMessageId === message.id) {
            continue;
        }
        openSockets[i].lastMessageId = message.id;
        openSockets[i].emit('message', message);
    }
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
