import BaseHTTPServer, SimpleHTTPServer
import ssl

httpd = BaseHTTPServer.HTTPServer(('0.0.0.0', 4443), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket (httpd.socket, certfile='../devserver/server.pem', server_side=True)
print('Server running on https://localhost:4443 \n(Cert is self-signed. Your browser will warn you)')
httpd.serve_forever()