// Import the core Scramjet bundle
importScripts("/scramjet/scramjet.all.js");

// Use the proper loader function for Scramjet 2.0+
const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async () => {
            // Load the config (important for routes)
            await scramjet.loadConfig();
            
            // Check if this request belongs to Scramjet
            if (scramjet.route(event)) {
                return scramjet.fetch(event);
            }
            
            // Otherwise, let the browser handle it normally
            return fetch(event.request);
        })()
    );
});
