//! A simple echo server.
//!
//! You can test this out by running:
//!
//!     cargo run --example server 127.0.0.1:12345
//!
//! And then in another window run:
//!
//!     cargo run --example client ws://127.0.0.1:12345/

use std::{
    collections::BTreeMap,
    env,
    io::Error,
    net::SocketAddr,
    sync::{Arc, RwLock},
};

use futures_util::{future, stream::SplitSink, StreamExt, TryStreamExt};
use lazy_static::lazy_static;
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{
    tungstenite::{
        handshake::{client::Request, server::Response},
        http::Response as HttpResponse,
        Message,
    },
    WebSocketStream,
};
use tracing::info;

lazy_static! {
    static ref ROOMS: Arc<RwLock<BTreeMap<SocketAddr, String>>> =
        Arc::new(RwLock::new(BTreeMap::new()));
}

struct Peer {
    socket: SplitSink<WebSocketStream<TcpStream>, Message>,

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

#[tokio::main]
async fn main() -> Result<(), Error> {
    let addr = env::args()
        .nth(1)
        .unwrap_or_else(|| "127.0.0.1:8080".to_string());

    // Create the event loop and TCP listener we'll accept connections on.
    let try_socket = TcpListener::bind(&addr).await;
    let listener = try_socket.expect("Failed to bind");
    info!("Listening on: {}", addr);

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(accept_connection(stream));
    }

    Ok(())
}

fn header_callback(
    request: &Request,
    mut response: Response,
) -> Result<Response, HttpResponse<Option<String>>> {
    let headers = response.headers_mut();
    let cookie = request.headers().get("cookie").unwrap();
    if headers.contains_key("cookie") {
        if let Ok(c) = cookie.to_str() {
            if c.contains("peerid=") {
                return Ok(response);
            }
        }
    }

    let new_cookie = format!("peerid={}; SameSite=Strict; Secure", uuid::Uuid::new_v4());
    headers.append("Set-Cookie", new_cookie.parse().unwrap());

    Ok(response)
}

async fn accept_connection(stream: TcpStream) -> anyhow::Result<()> {
    let addr = stream.peer_addr()?;
    info!("Peer address: {}", addr);

    let ws_stream = tokio_tungstenite::accept_hdr_async(stream, header_callback).await?;

    info!("New WebSocket connection: {}", addr);

    let (write, read) = ws_stream.split();

    // We should not forward messages other than text or binary.
    read.try_filter(|msg| future::ready(msg.is_text() || msg.is_binary()))
        .forward(write)
        .await?;

    Ok(())
}
