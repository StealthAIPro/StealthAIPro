// Load pre-existing settings
let settings = JSON.parse(localStorage.getItem('stealth_settings')) || {
    apiKey: "",
    model: "openrouter/free",
    theme: "Stealth Purple"
};

let history = JSON.parse(localStorage.getItem('stealth_history')) || [];

// Apply settings on load
window.onload = () => {
    document.getElementById('api-key').value = settings.apiKey;
    document.getElementById('model-select').value = settings.model;
    document.getElementById('theme-select').value = settings.theme;
    changeTheme(settings.theme);
    renderHistory();
};

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabId}-tab`).classList.remove('hidden');
    document.getElementById(`btn-${tabId}`).classList.add('active');
}

function changeTheme(themeName) {
    // Replace space with hyphen for CSS class names (Stealth Purple -> Stealth-Purple)
    const className = themeName.replace(" ", "-");
    document.body.className = className;
}

function saveSettings() {
    settings.apiKey = document.getElementById('api-key').value;
    settings.model = document.getElementById('model-select').value;
    settings.theme = document.getElementById('theme-select').value;
    
    localStorage.setItem('stealth_settings', JSON.stringify(settings));
    alert("SYSTEM UPDATED");
}

function clearHistory() {
    if(confirm("Wipe all session data?")) {
        history = [];
        localStorage.removeItem('stealth_history');
        renderHistory();
    }
}

// Update the existing sendMessage to include the model from settings
async function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim();
    if (!msg || !settings.apiKey) return;

    // ... (Your existing UI update code) ...

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${settings.apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: settings.model, // Uses the model from settings tab
            messages: [{ role: "user", content: msg }]
        })
    });
    
    // Save to history array
    const data = await response.json();
    const aiMsg = data.choices[0].message.content;
    history.push({ time: new Date().toLocaleTimeString(), text: msg, response: aiMsg });
    localStorage.setItem('stealth_history', JSON.stringify(history));
}
