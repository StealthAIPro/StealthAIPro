importScripts('/scramjet/scramjet.codecs.js');
importScripts('/scramjet/scramjet.config.js');
importScripts('/scramjet/scramjet.worker.js');

const sw = new ScramjetServiceWorker();

self.addEventListener('fetch', (event) => {
    event.respondWith(sw.fetch(event));
});
