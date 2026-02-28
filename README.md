# 🕵️‍♂️ Stealth Pro v2.6

**Stealth Pro** is a lightweight, single-file web interface designed for secure, private interactions with LLMs via the OpenRouter API. It features a profile-based system, local encryption, and a mobile-first design optimized for Safari and iOS.

---

## ✨ Features

* **Multi-Profile System:** Create local "accounts" to keep history and API configurations separate.
* **Safari/iOS Optimized:** Built using `100dvh` (Dynamic Viewport Height) and Safe Area Insets to prevent layout glitches on mobile browsers and iPhones.
* **Obfuscated Security:** The default API key is Base64 encoded and injected at runtime to prevent simple plain-text scraping of your source code.
* **Session Logs:** Persistent chat history stored locally per user using `localStorage`.
* **Flexible Models:** Choose from curated free models or input any custom Model ID from the OpenRouter library.
* **Markdown Support:** Custom parser handles **bolding**, *italics*, and proper line breaks/spacing.

---

## 🚀 Getting Started

### 1. Installation
No installation or hosting is strictly required. This is a standalone **HTML5** file.
1.  Save the code as `index.html`.
2.  Open it in any modern web browser (Safari, Chrome, Firefox, Edge).

### 2. Configuration
1.  Launch the app and enter a **Username** to create or enter your profile.
2.  Navigate to the **Settings (⚙️)** tab.
3.  Enter your **OpenRouter API Key**. 
4.  (Optional) Change the **Model ID** (default is `openrouter/free`).
5.  Click **Apply Changes**.

---

## 🛠 Technical Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Flexbox/Grid) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **API** | Fetch API (OpenRouter) |
| **Storage** | `localStorage` API |
| **Viewport** | Dynamic Viewport Units (`dvh`) |

---

## 🔒 Security & Privacy

* **No Backend:** Your data never leaves your browser except to communicate with the AI API.
* **LocalStorage:** History and keys are stored in your browser's local cache. Clearing browser data will wipe all profiles.
* **API Security:** The app uses `HTTP-Referer` headers to ensure compatibility with OpenRouter's security requirements.

---

## 📜 Usage Tips

* **Keyboard:** Press `Enter` to send, and `Shift + Enter` for a new line.
* **Switching Profiles:** Use the **Logout** button in Settings to return to the Auth screen and switch users.
* **History Recall:** Click on any log in the **History (📜)** tab to instantly reload that specific conversation into the main chat window.

---

## ⚠️ Disclaimer
*This tool is provided for educational and personal productivity use. Ensure you handle your API keys responsibly. The developers are not responsible for API costs incurred through the use of this interface.*
