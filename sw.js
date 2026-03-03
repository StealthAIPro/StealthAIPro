try {
    // 1. Import the core Scramjet bundle
    // Make sure this file actually exists at your-site.com/scramjet/scramjet.all.js
    importScripts("/scramjet/scramjet.all.js");

    // 2. Safely initialize the worker
    if (typeof $scramjetLoadWorker === 'function') {
        const { ScramjetServiceWorker } = $scramjetLoadWorker();
        const scramjet = new ScramjetServiceWorker();

        self.addEventListener("fetch", (event) => {
            event.respondWith(
                (async () => {
                    await scramjet.loadConfig();
                    if (scramjet.route(event)) {
                        return scramjet.fetch(event);
                    }
                    return fetch(event.request);
                })()
            );
        });
    } else {
        console.error("Scramjet script loaded but $scramjetLoadWorker is missing!");
    }
} catch (e) {
    console.error("Service Worker evaluation failed:", e);
}
