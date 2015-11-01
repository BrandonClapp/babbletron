(function(vex) {
  'use strict'

  // todo: refactor this out
  var connect = function(host, port, cb) {
    var net = require('net');
    var JsonSocket = require('json-socket');

    var readline = require('readline');
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout

    });

    var port = port; //The same port that the server is listening on
    var host = host;
    var netsocket = new net.Socket();
    var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
    socket.connect(port, host);
    socket.on('connect', function() { //Don't send until we're connected
        cb();
        console.log('client is connected');
        socket.sendMessage({messageType: 'chat', data: 'Go go go fire in the hole!'});

        socket.on('message', function(message) {
            console.log('Server says: ' + JSON.stringify(message));
        });

        rl.on('line', function (line) {
            if (line == 'exit' || line == 'end' || line == 'close') {
                rl.close();
                socket.end();
            }
            else {
                socket.sendMessage({messageType: 'chat', data: line});
            }
        });

    });
  }

  angular.module('babble').factory('authSvc', function($http) {
    var service = {};

    // todo: make this a promise.
    service.connect = function(host, port, username, password) {
      var connectingDialog = vex.dialog.open({
        message: 'Connecting to ' + host + ':' + port + (username ? ' as ' + username : '') + '...',
        showCloseButton: false,
        showConfirmButton: false,
        buttons: []
      });

      connect(host, port, function(){
        vex.close(connectingDialog.data().vex.id);
        // resolve promise.
      });

      console.log('Connecting to server ' + host + ':' + port + ' as user ' + username);
    }
    return service;
  });
})(vex);
