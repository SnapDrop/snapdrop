class ServerConnection {

}

class Connection {

}

class WSConnection extends Connection {

}

class RTCConnection extends Connection {

}

class Peer {

    constructor(serverConnection) {
        this._ws = new WSConnection(serverConnection);
        this._rtc = new RTCConnection(serverConnection);
        this._fileReceiver = new FileReceiver(this);
        this._fileSender = new FileSender(this);
    }

    send(message) {

    }

}

class Peers {

}