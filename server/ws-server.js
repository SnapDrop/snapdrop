'use strict';
var parser = require('ua-parser-js');

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;

exports.create = function(server) {

    // link it to express
    var bs = BinaryServer({
        server: server,
        path: '/binary'
    });

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function getDeviceName(req) {
        var ua = parser(req.headers['user-agent']);
        return {
            model: ua.device.model,
            os: ua.os.name,
            browser: ua.browser.name,
            type: ua.device.type
        };
    }

    function hash(text) {
        // A string hashing function based on Daniel J. Bernstein's popular 'times 33' hash algorithm.
        var h = 5381,
            index = text.length;
        while (index) {
            h = (h * 33) ^ text.charCodeAt(--index);
        }
        return h >>> 0;
    }

    function getIP(socket) {
        return socket.upgradeReq.headers['x-forwarded-for'] || socket.upgradeReq.connection.remoteAddress;
    }
    // Wait for new user connections
    bs.on('connection', function(client) {
        //console.log('connection received!', client._socket.upgradeReq.connection.remoteAddress);

        client.uuidRaw = guid();
        //ip is hashed to prevent injections by spoofing the 'x-forwarded-for' header
        client.hashedIp = hash(getIP(client._socket));

        client.deviceName = getDeviceName(client._socket.upgradeReq);

        // Incoming stream from browsers
        client.on('stream', function(stream, meta) {
            if (meta && meta.serverMsg === 'rtc-support') {
                client.uuid = (meta.rtc ? 'rtc_' : '') + client.uuidRaw;
                client.send({
                    isSystemEvent: true,
                    type: 'handshake',
                    uuid: client.uuid
                });
                return;
            }
            meta.from = client.uuid;

            // broadcast to the other client
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





    function notifyBuddiesX() {
        var locations = {};
        //group all clients by location (by public ip address)
        forEachClient(function(client) {
            var ip = client.hashedIp;
            locations[ip] = locations[ip] || [];
            locations[ip].push({
                socket: client,
                contact: {
                    peerId: client.uuid,
                    name: client.deviceName,
                }
            });
        });
        //notify every location
        Object.keys(locations).forEach(function(locationKey) {
            //notify every client of all other clients in this location
            var location = locations[locationKey];
            location.forEach(function(client) {
                //all other clients
                var buddies = location.reduce(function(result, otherClient) {
                    if (otherClient !== client) {
                        result.push(otherClient.contact);
                    }
                    return result;
                }, []);
                //protocol
                var msg = {
                    buddies: buddies,
                    isSystemEvent: true,
                    type: 'buddies'
                };
                client.socket.send(msg);
            });
        });
    }

    setInterval(notifyBuddiesX, 5000);
};
