import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { createBareServer } from '@tomphttp/bare-server-node';
import { join } from 'node:path';

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');

// Serve UV static files
app.use('/uv/', express.static(uvPath));
// Serve your Windows Dashboard files
app.use(express.static(process.cwd()));

app.get('/', (req, res) => {
    res.sendFile(join(process.cwd(), 'dashboard.html'));
});

// Koyeb Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
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

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`StealthOS (UV Only) running on port ${PORT}`);
});
