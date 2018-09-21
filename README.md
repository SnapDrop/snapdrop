# Snapdrop

[Snapdrop](https://snapdrop.net) is a Progressive Web App inspired by Apple's Airdrop.

#### Snapdrop is built with the following awesome technologies:
* Vanilla HTML / JS / CSS  
* [WebRTC](http://webrtc.org/)
* [WebSockets](http://www.websocket.org/) fallback (iDevices don't support WebRTC)
* [NodeJS](https://nodejs.org/en/)
* [Material Design](https://material.google.com/)


### Frequently Asked Questions

### Instructions
* [Video Instructions](https://www.youtube.com/watch?v=4XN02GkcHUM) (Big thanks to [TheiTeckHq](https://www.youtube.com/channel/UC_DUzWMb8gZZnAbISQjmAfQ))
* [idownloadblog](http://www.idownloadblog.com/2015/12/29/snapdrop/)
* [thenextweb](http://thenextweb.com/insider/2015/12/27/snapdrop-is-a-handy-web-based-replacement-for-apples-fiddly-airdrop-file-transfer-tool/)
* [winboard](http://www.winboard.org/artikel-ratgeber/6253-dateien-vom-desktop-pc-mit-anderen-plattformen-teilen-mit-snapdrop.html)
* [免費資源網路社群](https://free.com.tw/snapdrop/?utm_content=buffere6987&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer)

##### What about the connection? Is it a P2P-connection directly from device to device or is there any third-party-server?
It uses a P2P connection if WebRTC is supported by the browser. (WebRTC needs a Signaling Server, but it is only used to establish a connection and is not involved in the file transfer).

If WebRTC isn’t supported (Safari, IE) it uses a Web Sockets fallback for the file transfer. The server connects the clients with a stream.  


##### What about privacy? Will files be saved on third-party-servers?
None of your files are ever saved on any server. 
Snapdrop doesn't even use cookies or a database. If you are curious have a look [at the Server](https://github.com/RobinLinus/snapdrop/blob/master/server/ws-server.js).
But it does use Google Analytics. 

##### Is SnapDrop a fork of ShareDrop?
No. ShareDrop is built with Ember. Snapdrop is built with vanilla ES6. 
I wanted to play around with Progressive Web Apps and then I got the idea of a local file sharing app. By doing research on this idea I found and analysed ShareDrop. I liked it and thought about how to improve it.
ShareDrop uses WebRTC only and isn't compatible with Safari Browsers. Snapdrop uses a Websocket fallback and some hacks to make Snapdrop work due to the download restrictions on iDevices. 


### Snapdrop is awesome! How can I support it? 
* [File bugs, give feedback, submit suggestions](https://github.com/RobinLinus/snapdrop/issues)
* Share Snapdrop on your social media.
* [Buy me a cup of coffee](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R9C5E42UYEQCN)
* Fix bugs and make a Pull Request. This is my first open source project, so I am not very used to the common workflow, but we'll figure it out!
* Do Security Analysis and suggestions

## Local Development
```
    git clone git@github.com:RobinLinus/secret-snapdrop.git
    cd secret-snapdrop/server
    npm install
    node index.js
    cd ../client
    python -m http.server
```

Now point your browser to http://localhost:8000.
    
## Deployment Notes
The client expects the server at http(s)://your.domain/server.

When serving the node server behind a proxy the `X-Forwarded-For` header has to be set by the proxy. Otherwise all clients that are served by the proxy will be mutually visible.

By default the server listens on port 3000.

For an nginx configuration example see `nginx.conf.example`.

## Licences
* Thanks to [Mark DiAngelo]() for the [Blop Sound](http://soundbible.com/2067-Blop.html)
