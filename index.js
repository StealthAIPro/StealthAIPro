import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { createBareServer } from '@tomphttp/bare-server-node';
import Rammerhead from 'rammerhead/src/server/index.js'; // Ensure this is installed
import { join } from 'node:path';

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');
const rh = new Rammerhead();

app.use('/uv/', express.static(uvPath));
app.use(express.static(process.cwd()));

// Rammerhead Middleware
app.use('/rh/', (req, res) => {
    rh.handler(req, res);
});

// Routing Logic
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen(3000);
