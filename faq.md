# Frequently Asked Questions

### What about the connection? It's a P2P-connection directly from device to device or is there any third-party-server?
It uses a P2P connection when WebRTC is supported by the browser. (WebRTC needs a Signaling Server, but it is only used to establish a connection and is not involved in the file transfer).

If WebRTC isn’t supported (Safari, IE) it uses a Web Sockets fallback for the file transfer. The server connects the clients with a stream.  


### What about privacy? Will send files be saved on third-party-servers?
None of your files are ever saved on any server. If you are curious have a look [at the Server](https://github.com/capira12/snapdrop/blob/master/server/ws-server.js)
Snapdrop doesn't even use cookies or a database.
It does use Google Analytics. 

### Is SnapDrop a fork of ShareDrop?
No. ShareDrop is built with ember. Snapdrop is built with Polymer. 
I wanted to play around with Progressive Web Apps and then I got the idea to clone Apple’s Airdrop. By doing research on this idea I found and analysed ShareDrop. 
ShareDrop uses WebRTC only and isn't compatible with Safari Browsers. Snapdrop uses a Websocket fallback and some hacks to make Snapdrop work due to the download restrictions on iDevices. 


### Where can I see the source? 
[Github](https://github.com/capira12/snapdrop)

### Snapdrop is awesome! How can I support it? 
* [Buy me a cup of coffee](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FDAHZJH3228D6)
* Help me to scale the server! My server is going crazy in the last hour. If you know how to scale nodejs apps (maybe heroku expert?) please write me at robin@capira.de ! 
* Fix bugs and do a Pull Request. This is my first open source project, so I am not very used to the common workflow, but we'll figure it out!
