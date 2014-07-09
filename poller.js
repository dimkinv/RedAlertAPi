var request = require('request');
var iconv = require('iconv-lite');

var http = require('http');

var callbacks = [];
var lastMessage;

//ar poolerInterval = setInterval(function () {
//  request({
//    url: 'http://www.oref.org.il/WarningMessages/alerts.json',
//    headers: {
//      'encoding': 'null',
//      'Content-type': 'text/html'
//    }
//  }, function (status, response, body) {
//    console.log(body.toString('utf-8'));
//  });
////}, 2000);


setInterval(function(){
  http.get('http://www.oref.org.il/WarningMessages/alerts.json', function (res) {
    res.on('data', function (data) {
      var decodedMessage = JSON.parse(iconv.decode(data, 'utf-16'));

      notifyClients(decodedMessage);
    });
  });
}, 2000);

function notifyClients(message){
  for(var i = 0; i < callbacks.length; i++){
    if(typeof callbacks[i] === 'function'){
      callbacks[i](message);
    }
  }
}

exports.registerHandler = function(callback){
  callbacks.push(callback);
};




