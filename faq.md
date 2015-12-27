# Frequently Asked Questions

### What about the connection? It's a P2P-connection directly from device to device or is there any third-party-server?
It uses a P2P connection when WebRTC is supported by the browser. (WebRTC needs a Signaling Server, but it is only used to establish a connection and is not involved in the file transfer).

If WebRTC isn’t supported (Safari, IE) it uses a Web Sockets fallback for the file transfer. The server connects the clients with a stream.  


### What about privacy? Will send files be saved on third-party-servers?
No files are saved on a third-party-server.

### Is SnapDrop a fork of ShareDrop?
No. ShareDrop is built with ember. Snapdrop is built with Polymer. 
I wanted to play around with Progressive Web Apps and then I got the idea to clone Apple’s Airdrop. By doing research on this idea I found and analysed ShareDrop.  


### Where can I see the source? 
[Github](https://github.com/capira12/snapdrop)
