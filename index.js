import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// RENDER REQUIREMENT: You MUST use process.env.PORT
const PORT = process.env.PORT || 3000;

// Serve all files in your folder (images, css, etc.)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    // We use a try/catch or check to prevent a crash if the file is missing
    const indexPath = path.join(__dirname, 'home.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(500).send("Server is running, but index.html was not found in the root folder.");
        }
    });
});

// Health check endpoint for Render
app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Stealth Server is live on port ${PORT}`);
});
