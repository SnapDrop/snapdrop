# Local Development
## Install

First, [Install docker with docker-compose.](https://docs.docker.com/compose/install/)

Then, clone the repository:
```
    git clone https://github.com/RobinLinus/snapdrop.git
    cd snapdrop
    docker-compose up -d
```
Now point your browser to `http://localhost:8080`.

- To restart the containers run `docker-compose restart`.
- To stop the containers run `docker-compose stop`.
- To debug the NodeJS server run `docker logs snapdrop_node_1`.


## Run locally by pulling image from Docker Hub

Have docker installed, then use the command:
```
    docker pull linuxserver/snapdrop
```

To run the image, type (if port 8080 is occupied by host use another random port <random port>:80):
```
    docker run -d -p 8080:80 linuxserver/snapdrop
```






## Testing PWA related features
PWAs require that the app is served under a correctly set up and trusted TLS endpoint.

The nginx container creates a CA certificate and a website certificate for you. To correctly set the common name of the certificate, you need to change the FQDN environment variable in `docker/fqdn.env` to the fully qualified domain name of your workstation.

If you want to test PWA features, you need to trust the CA of the certificate for your local deployment. For your convenience, you can download the crt file from `http://<Your FQDN>:8080/ca.crt`. Install that certificate to the trust store of your operating system.
- On Windows, make sure to install it to the `Trusted Root Certification Authorities` store.
- On MacOS, double click the installed CA certificate in `Keychain Access`, expand `Trust`, and select `Always Trust` for SSL.
- Firefox uses its own trust store. To install the CA, point Firefox at `http://<Your FQDN>:8080/ca.crt`. When prompted, select `Trust this CA to identify websites` and click OK.
- When using Chrome, you need to restart Chrome so it reloads the trust store (`chrome://restart`). Additionally, after installing a new cert, you need to clear the Storage (DevTools -> Application -> Clear storage -> Clear site data).

Please note that the certificates (CA and webserver cert) expire after a day.
Also, whenever you restart the nginx docker, container new certificates are created.

The site is served on `https://<Your FQDN>:443`.
    
## Deployment Notes
The client expects the server at http(s)://your.domain/server.

When serving the node server behind a proxy, the `X-Forwarded-For` header has to be set by the proxy. Otherwise, all clients that are served by the proxy will be mutually visible.

By default, the server listens on port 3000.

For an nginx configuration example, see `docker/nginx/default.conf`.

[< Back](/README.md)
