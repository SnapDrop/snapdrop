use std::net::SocketAddr;

use futures_util::stream::SplitSink;
use lazy_static::lazy_static;
use tokio::net::TcpStream;
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};
use uaparser::{Parser, UserAgentParser};

type Socket = SplitSink<WebSocketStream<TcpStream>, Message>;

lazy_static! {
    static ref UA_PARSER: UserAgentParser =
        UserAgentParser::from_bytes(include_bytes!("../regexes.yaml")).expect("Parser creation failed");
}

pub(crate) struct Peer {
    socket: Socket,

    name: Name,
    ip: SocketAddr,
    rtc_supported: bool,
    // timer: ,

    // last_beat: ,
}

struct Name {
    model: Option<String>,
    os: String,
    browser: String,
    type_: String,
    device_name: String,
    display_name: String,
}

impl Peer {
    pub(crate) fn new(socket: Socket, peer_addr: SocketAddr, user_agent: String) -> Peer {
        Peer {
            socket,
            name: Name::new(user_agent),
            ip: peer_addr,
            rtc_supported: false,
        }
    }
}

impl Name {
    pub(crate) fn new(user_agent: String) -> Name {
        let ua = UA_PARSER.parse(&user_agent);

        let mut device_name = ua.os.family.replace("Mac Os", "Mac");
        device_name.push(' ');

        if let Some(model) = ua.device.model.clone() {
            device_name.push_str(&model);
        } else {
            device_name.push_str(ua.user_agent.family.as_ref());
        }

        Name {
            model: ua.device.model.map(|m| m.to_string()),
            os: ua.os.family.to_string(),
            browser: ua.user_agent.family.to_string(),
            type_: ua.device.family.to_string(),

            device_name,
            display_name: "".to_string(), // TODO search for random name generator
        }
    }
}
