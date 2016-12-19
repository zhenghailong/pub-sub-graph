var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cors = require('cors');

var redis = require("redis");
var pub = redis.createClient();
var sub = redis.createClient();

app.use(cors());
app.options('*', cors());

app.post('/p', function (req, res) {
  pub.publish("test_channel", JSON.stringify([5,5,6,3,5,8,13]));
  res.json({ message: 'success.' });
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('msg_from_back', { data: JSON.stringify([13,8,5,3,2,1,1]) });

  socket.on('msg_from_front', function (data) {
    console.log(data);
  });

  sub.on('message', function(chan, msg) {
    console.log("redis channel msg : " + chan + ": " + msg);
    socket.emit('msg_from_back', {data: msg});
  });

  sub.subscribe('test_channel');
});

server.listen(3000, function(){
  console.log('listening on :3000');
});
