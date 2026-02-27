let apiKey = localStorage.getItem('stealth_api_key') || "";
if (apiKey) document.getElementById('api-key').value = apiKey;

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const status = document.getElementById('status');
    const message = inputField.value.trim();

    if (!message || !apiKey) {
        alert("Please enter a message and ensure your API Key is saved.");
        return;
    }

    // Add User Message to UI
    appendMessage('user', message);
    inputField.value = "";
    status.innerText = "Processing...";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin, // Required for OpenRouter
                "X-Title": "Stealth Chat Web"
            },
            body: JSON.stringify({
                model: "openrouter/free", // Or use any model from your ai_handler.py
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        appendMessage('ai', aiResponse);
    } catch (error) {
        appendMessage('system', "Error connecting to AI. Check console.");
        console.error(error);
    } finally {
        status.innerText = "Ready";
    }
}

function appendMessage(sender, text) {
    const chatWindow = document.getElementById('chat-window');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function saveSettings() {
    apiKey = document.getElementById('api-key').value;
    localStorage.setItem('stealth_api_key', apiKey);
    alert("API Key Saved Locally.");
}

// Allow "Enter" to send (but Shift+Enter for new line)
document.getElementById('user-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
