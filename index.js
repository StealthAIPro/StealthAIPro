import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { createBareServer } from '@tomphttp/bare-server-node';
import Rammerhead from 'rammerhead/src/server/index.js'; // The engine
import { join } from 'node:path';

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');
const __dirname = process.cwd();

// 1. Initialize Rammerhead
const rh = new Rammerhead();

// 2. Serve Ultraviolet
app.use('/uv/', express.static(uvPath));

// 3. Static Files (p.html, etc.)
app.use(express.static(__dirname));

// 4. Route Rammerhead Requests
app.use('/rh/', (req, res) => {
    rh.handler(req, res);
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'p.html'));
});

// 5. Combined Routing (Bare + Rammerhead + Express)
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else if (req.url.startsWith('/rh/')) {
        // Rammerhead handles its own routing here
    } else {
        app(req, res);
    }
});

// 6. WebSocket Upgrades (Crucial for both)
server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen(3000, () => console.log('Multi-Proxy running on port 3000'));
