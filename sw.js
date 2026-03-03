importScripts("/scramjet/scramjet.all.js");

const scramjet = new $scramjet.ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
    if (event.request.url.startsWith(location.origin + "/scramjet/")) {
        event.respondWith(scramjet.fetch(event));
    }
});
