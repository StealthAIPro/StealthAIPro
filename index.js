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

app.use(express.json()); // This allows the server to read the message you sent

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openrouter/auto", // Or your preferred model
                "messages": [
                    { "role": "user", "content": message }
                ]
            })
        });

        const data = await response.json();
        const aiReply = data.choices[0].message.content;
        res.json({ reply: aiReply });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "The AI is sleepy. Check your API key!" });
    }
});

app.get('/api/stats', (req, res) => {
    const usage = process.memoryUsage();
    res.json({
        ram: Math.round(usage.rss / 1024 / 1024) + ' MB',
        cpu: (Math.random() * 5).toFixed(1) + '%', // Simulation of load
        uptime: Math.round(process.uptime()) + 's'
    });
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
