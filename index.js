import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Serve all static files (CSS, JS, Images)
app.use(express.static(__dirname));

// Route Logic
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Map your shortened names for easy access
app.get('/a', (req, res) => res.sendFile(path.join(__dirname, 'a.html'))); // AI
app.get('/m', (req, res) => res.sendFile(path.join(__dirname, 'm.html'))); // Music
app.get('/p', (req, res) => res.sendFile(path.join(__dirname, 'p.html'))); // Proxy
app.get('/s', (req, res) => res.sendFile(path.join(__dirname, 's.html'))); // Settings

// Error handling to keep the server from crashing
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'dashboard.html'));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Stealth System Live on Port ${PORT}`);
});
