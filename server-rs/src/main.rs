//! A simple echo server.
//!
//! You can test this out by running:
//!
//!     cargo run --example server 127.0.0.1:12345
//!
//! And then in another window run:
//!
//!     cargo run --example client ws://127.0.0.1:12345/

use std::{env, io::Error};

use futures_util::{future, StreamExt, TryStreamExt};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::tungstenite::{
    handshake::{client::Request, server::Response},
    http::Response as HttpResponse,
};
use tracing::info;

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
