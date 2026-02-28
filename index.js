import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// This tells the server to serve all your HTML files
app.use(express.static(__dirname));

// This makes sure your index.html is the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(PORT, () => {
    console.log(`Stealth Server is live on port ${PORT}`);
});
