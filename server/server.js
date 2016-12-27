import express from 'express';
import path from 'path';
import http from 'http';
import crypto from 'crypto';
import DiffMatchPatch from 'diff-match-patch';
const dmp = new DiffMatchPatch();

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
const port = process.env.PORT || 3000;
server.listen(port);
console.log(`=== Go to http://localhost:${port} ===`);
console.log(__dirname);

let roomData = {};

io.on('connection', (socket) => {
    const path = socket.handshake.query.path;
    
    if(!roomData[path]){
        roomData[path] = {};
        roomData[path].value = '';
        roomData[path].mode = 'javascript';
        setTimeout(() => delete roomData[path], 24 * 60 * 60 * 3 * 1000/*3 days*/);
    }
    
    console.log(`connect:${path}`);


    socket.join(path);
    
    socket.emit('init', roomData[path]);

    socket.on('editor onchange', (data) => {
        // console.log('send patch');
        roomData[path].value = dmp.patch_apply(data.patch, roomData[path].value)[0];
        socket.broadcast.to(path).emit('editor onchange', data);
    });
    
    socket.on('mode onchange', (mode) => {
        // console.log('send mode');
        roomData[path].mode = mode;
        socket.broadcast.to(path).emit('mode onchange', mode);
    });
});