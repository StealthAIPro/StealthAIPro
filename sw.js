// 1. Import the engine
importScripts("/scramjet/scramjet.all.js");

// 2. Initialize the variable IMMEDIATELY (using 'var' to avoid TDZ issues in SW)
var scramjet;

try {
    const { ScramjetServiceWorker } = $scramjetLoadWorker();
    scramjet = new ScramjetServiceWorker();
} catch (e) {
    console.error("Scramjet Worker failed to initialize:", e);
}

self.addEventListener("fetch", (event) => {
    // 3. Safety Check: If initialization failed, don't try to route
    if (!scramjet) return;

    event.respondWith(
        (async () => {
            try {
                await scramjet.loadConfig();
                
                if (scramjet.route(event)) {
                    return await scramjet.fetch(event);
                }
            } catch (err) {
                console.error("Scramjet Fetch Error:", err);
            }

            // Fallback to normal fetch if not a proxy request
            return fetch(event.request);
        })()
    );
});
