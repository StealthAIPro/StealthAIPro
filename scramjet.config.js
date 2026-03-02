self.__scramjet$config = {
    /**
     * The prefix for Scramjet's service worker.
     * This must match the 'scope' used in your p.html registration.
     */
    prefix: '/main/',

    /**
     * The codec used for URL encoding. 
     * 'xor' is the standard for bypassing basic filters.
     */
    codec: 'xor',

    /**
     * The Bare server endpoint. 
     * You can use your own or a public one.
     */
    bare: '/bare/',

    /**
     * Configuration for the service worker file location.
     */
    worker: '/sw.js',

    /**
     * Bundle location for the Scramjet engine.
     */
    bundle: '/scramjet/scramjet.codecs.js',
    
    /**
     * Whether to use global variable spoofing for better compatibility.
     */
    enhanced: true
};
