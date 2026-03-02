import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { scramjetPath } from '@titaniumnetwork-dev/scramjet';
import { createBareServer } from '@tomphttp/bare-server-node';
import { join } from 'node:path';

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');
const __dirname = process.cwd();

// 1. Serve Proxy Engine Assets
app.use('/uv/', express.static(uvPath));
app.use('/scramjet/', express.static(scramjetPath));

// 2. Static Files with Safari Service Worker Fix
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.sw.js') || path.endsWith('sw.js')) {
            res.setHeader('Service-Worker-Allowed', '/');
        }
    }
}));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'p.html'));
});

// 3. Handle Bare Server Requests
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

// 4. Handle WebSocket Upgrades (Crucial for Scramjet/UV)
server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Stealth Browser running at http://localhost:${PORT}`);
});
