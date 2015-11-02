(function(tcp) {
  'use strict'

  function connect(host, port, username, password) {
    return new Promise(function(resolve, reject) {
      tcp.connect(host, port, username, password).then(function(){
        resolve();
      }, function(err){
        reject(err);
      });
    });
  }

  var service = {
    connect: connect
  }

  module.exports = service;
})(require('./../services/tcp.js'));