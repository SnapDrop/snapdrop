# Snapdrop

Snapdrop is inspired by Apple's Airdrop, but is a Progressive Web App built with Polymer and Web RTC.

#### Snapdrop is built with the following awesome technologies:
* [Polymer](https://www.polymer-project.org)
  * [Polymer Starter Kit](https://developers.google.com/web/tools/polymer-starter-kit/)
  * [Polymer Elements](https://elements.polymer-project.org/browse)
* [WebRTC](http://webrtc.org/)
  * [PeerJS](http://peerjs.com)
* [WebSockets](http://www.websocket.org/) fallback (iDevices don't support WebRTC)
  * [BinaryJs](http://binaryjs.com/)
* [NodeJS](https://nodejs.org/en/)
* [Material Design](http://www.google.com/design/spec/material-design/introduction.html)

### Frequently Asked Questions

##### What about the connection? Is it a P2P-connection directly from device to device or is there any third-party-server?
It uses a P2P connection if WebRTC is supported by the browser. (WebRTC needs a Signaling Server, but it is only used to establish a connection and is not involved in the file transfer).

If WebRTC isn’t supported (Safari, IE) it uses a Web Sockets fallback for the file transfer. The server connects the clients with a stream.  


##### What about privacy? Will files be saved on third-party-servers?
None of your files are ever saved on any server. 
Snapdrop doesn't even use cookies or a database. If you are curious have a look [at the Server](https://github.com/capira12/snapdrop/blob/master/server/ws-server.js)
It does use Google Analytics. 

##### Is SnapDrop a fork of ShareDrop?
No. ShareDrop is built with ember. Snapdrop is built with Polymer. 
I wanted to play around with Progressive Web Apps and then I got the idea to clone Apple’s Airdrop. By doing research on this idea I found and analysed ShareDrop. 
ShareDrop uses WebRTC only and isn't compatible with Safari Browsers. Snapdrop uses a Websocket fallback and some hacks to make Snapdrop work due to the download restrictions on iDevices. 


### Snapdrop is awesome! How can I support it? 
* [Buy me a cup of coffee](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FDAHZJH3228D6)
* Help me to scale the server! My server is going crazy in the last hour. If you know how to scale nodejs apps (maybe heroku expert?) please write me at robin@capira.de ! 
* Fix bugs and do a Pull Request. This is my first open source project, so I am not very used to the common workflow, but we'll figure it out!
)

