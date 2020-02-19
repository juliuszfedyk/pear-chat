const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const { ExpressPeerServer } = require('peer');
const fs = require('fs');

app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../public/index.html'));
});

const privateKey = fs.readFileSync( '/certs/privkey.pem' );
const certificate = fs.readFileSync( '/certs/fullchain.pem' );

const server = https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(443);

const options = {
    debug: true,
    port: 443,
    path: '/api',
    ssl: {
        cert: certificate,
        key: privateKey
    }
}

const peerserver = ExpressPeerServer(server, options);

app.use('/api', peerserver);