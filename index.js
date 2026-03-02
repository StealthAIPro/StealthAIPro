import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { scramjetPath } from '@titaniumnetwork-dev/scramjet'; // Add this
import { join } from 'node:path';

const app = express();
const __dirname = process.cwd();

// Serve Ultraviolet
app.use('/uv/', express.static(uvPath));

// Serve Scramjet
app.use('/scramjet/', express.static(scramjetPath));

// Serve static files with Safari fix headers
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

const server = createServer(app);
server.listen(3000, () => console.log('Server running on port 3000'));
