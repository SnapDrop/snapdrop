use std::net::SocketAddr;

use futures_util::stream::SplitSink;
use tokio::net::TcpStream;
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};

type Socket = SplitSink<WebSocketStream<TcpStream>, Message>;

pub(crate) struct Peer {
    socket: Socket,

    name: Name,
    ip: SocketAddr,
    rtc_supported: bool,
    // timer: ,

    // last_beat: ,
}

struct Name {
    model: String,
    os: String,
    browser: String,
    type_: String,
    device_name: String,
    device_type: String,
}

impl Peer {
    pub(crate) fn new(socket: Socket, peer_addr: SocketAddr) -> Peer {
        Peer {
            socket,
            name: Name {
                model: "".to_string(),
                os: "".to_string(),
                browser: "".to_string(),
                type_: "".to_string(),
                device_name: "".to_string(),
                device_type: "".to_string(),
            },
            ip: peer_addr,
            rtc_supported: false,
        }
    }
}
