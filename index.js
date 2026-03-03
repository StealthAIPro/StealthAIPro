import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { scramjetPath } from '@mercuryworkshop/scramjet';
import { createBareServer } from '@tomphttp/bare-server-node';
import { join } from 'node:path';

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');

// --- Static File Routing ---

// Serve Ultraviolet engine
app.use('/uv/', express.static(uvPath));

// Serve Scramjet engine
app.use('/scramjet/', express.static(scramjetPath));

// Serve your Windows Desktop (p.html and assets)
app.use(express.static(process.cwd()));

app.get('/', (req, res) => {
    res.sendFile(join(process.cwd(), 'p.html'));
});

// --- API Routes ---

app.use(express.json());

// AI Assistant Route (OpenRouter)
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://stealth-os.internal", 
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI is currently offline." });
    }
});

// System Stats for Taskbar
app.get('/api/stats', (req, res) => {
    const usage = process.memoryUsage();
    res.json({
        ram: Math.round(usage.rss / 1024 / 1024) + ' MB',
        uptime: Math.round(process.uptime()) + 's'
    });
});

// --- Server & Proxy Logic ---

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
    console.log(`📡 StealthOS Online | Port: ${PORT}`);
    console.log(`✅ Ultraviolet & Scramjet engines loaded.`);
});
