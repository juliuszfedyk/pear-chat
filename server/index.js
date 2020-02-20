const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const http = require('http');
const { ExpressPeerServer } = require('peer');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));



app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../public/index.html'));
});

const { peerConfig } = config;

const serverOptions = {};
const peerOptions = {
    debug: config.debugMode,
    port: peerConfig.port,
    path: peerConfig.path,
}

let server;
if (config.ssl) {
    const privateKey = fs.readFileSync(config.sslPaths.key);
    const certificate = fs.readFileSync(config.sslPaths.certificate);
    serverOptions.key = privateKey;
    serverOptions.cert = certificate
    peerOptions.ssl = {
        cert: certificate,
        key: privateKey
    }
    server = https.createServer(serverOptions, app).listen(peerConfig.port);
    httpApp = express();
    httpApp.use((req, res) => {
        return res.redirect(302, 'https://' + req.get('host') + req.url);
    });
    httpApp.listen(80);
} else {
    server = http.createServer({}, app).listen(peerConfig.port);
}

const peerserver = ExpressPeerServer(server, peerOptions);

app.use('/api', peerserver);