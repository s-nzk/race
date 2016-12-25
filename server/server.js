import express from 'express';
import path from 'path';
import http from 'http';
import crypto from 'crypto';

import socketio from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socketio(server);

import webpackDevHelper from './devhelper';

if (process.env.NODE_ENV !== 'production') {
    console.log('DEVOLOPMENT ENVIRONMENT: Turning on WebPack Middleware...');
    webpackDevHelper.useWebpackMiddleware(app);
} else {
    console.log('PRODUCTION ENVIRONMENT');
    app.use('/built', express.static(path.resolve(__dirname, 'client')));
}

app.get('/:id', (req, res) => res.sendFile(path.resolve(__dirname, 'static', 'index.html')));
app.get('/', (req, res) => {
    let hash = crypto.randomBytes(5).toString('hex');
    res.redirect(`/${hash}`);
});
server.listen(3000);
console.log('=== Go to http://localhost:3000 ===');
console.log(__dirname);


io.on('connection', (socket) => {
    const path = socket.handshake.query.path;

    socket.join(path);

    socket.on('editor onchange', (newData) => {
        socket.broadcast.to(path).emit('editor onchange', newData);
    });
});