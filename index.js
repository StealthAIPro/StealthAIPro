import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { createBareServer } from '@tomphttp/bare-server-node';
import Rammerhead from 'rammerhead/src/server/index.js'; // Ensure this is installed
import { join } from 'node:path';
import fs from 'node:fs';
import path from 'node:path';

// Fix for Rammerhead's missing cache folders on Render
const cacheFolders = [
    path.join(process.cwd(), 'node_modules/rammerhead/cache-js'),
    path.join(process.cwd(), 'node_modules/rammerhead/cache-asm')
];

cacheFolders.forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`Created missing folder: ${folder}`);
    }
});

// Create a dummy .env if it doesn't exist to stop dotenv-flow from complaining
if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', 'PORT=3000');
}

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

// Replace your existing server.on and server.listen with this:
app.get('/', (req, res) => {
    res.sendFile(join(process.cwd(), 'dashboard.html'));
});

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

// Port handling for cloud providers
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`StealthOS running on port ${PORT}`));
