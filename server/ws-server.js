'use strict';
var fs = require('fs');
var parser = require('ua-parser-js');

// Serve client side statically
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

// var https = require('https');
// var server = https.createServer({
//     key: fs.readFileSync('/var/www/sharewithme/ssl/privkey.pem').toString(),
//     cert: fs.readFileSync('/var/www/sharewithme/ssl/fullchain.pem').toString()
// }, app);

var http = require('http');
var server = http.createServer(app);

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;

// link it to express
var bs = BinaryServer({
    server: server
});

function getDeviceName(req) {
    var ua = parser(req.headers['user-agent']);
    return {
        model: ua.device.model,
        os: ua.os.name,
        browser: ua.browser.name,
        type: ua.device.type
    };
}
// Wait for new user connections
bs.on('connection', function(client) {
    console.log('connection received!');


    client.deviceName = getDeviceName(client._socket.upgradeReq);

    // Incoming stream from browsers
    client.on('stream', function(stream, meta) {
        console.log('stream received!', meta);
        if (meta.handshake) {
            client.uuid = meta.handshake;
            return;
        }
        meta.from = client.uuid;

        // broadcast to all other clients
        for (var id in bs.clients) {
            if (bs.clients.hasOwnProperty(id)) {
                var otherClient = bs.clients[id];
                if (otherClient !== client && meta.toPeer === otherClient.uuid) {
                    var send = otherClient.createStream(meta);
                    stream.pipe(send, meta);
                }
            }
        }
    });
});



function forEachClient(fn) {
    for (var id in bs.clients) {
        if (bs.clients.hasOwnProperty(id)) {
            var client = bs.clients[id];
            fn(client);
        }
    }
}

function getIP(socket) {
    return socket.upgradeReq.headers['x-forwarded-for'] || socket.upgradeReq.connection.remoteAddress;
}

function notifyBuddies() {
    //TODO: This should be possible in linear time
    forEachClient(function(client1) {
        var buddies = [];
        var myIP = getIP(client1._socket);
        forEachClient(function(client2) {
            var otherIP = getIP(client2._socket);
            console.log(myIP, otherIP);
            if (client1 !== client2 && myIP === otherIP) {
                buddies.push({
                    peerId: client2.uuid,
                    name: client2.deviceName
                });
            }
        });
        var msg = {
            buddies: buddies,
            isSystemEvent: true,
            type: 'buddies'
        };
        client1.send(msg);
    });
}
setInterval(notifyBuddies, 4000);

server.listen(9001);
console.log('HTTP and BinaryJS server started on port 9001');
