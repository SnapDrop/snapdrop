'use strict';
var express = require('express');
var compression = require('compression');
var app = express();
var http = require('http');
var ExpressPeerServer = require('peer').ExpressPeerServer;
var wsServer = require('./server/ws-server.js');

var server = http.createServer(app);

// Serve up content from public directory
app.use(compression());
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3002;
server.listen(port);
wsServer.create(server);
app.use('/peerjs', ExpressPeerServer(server, {
    debug: true
}));


console.log('listening on port ' + port);
