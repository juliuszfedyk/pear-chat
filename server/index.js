const express = require('express');
const app = express();
const path = require('path');
const { ExpressPeerServer } = require('peer');

app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../public/index.html'));
});

// =======

const server = app.listen(80);
const options = {
    debug: true,
    port: 80,
    path: '/api'
}

const peerserver = ExpressPeerServer(server, options);

app.use('/api', peerserver);