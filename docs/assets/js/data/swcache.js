const resource = [
    /* --- CSS --- */
    '/docs/assets/css/style.css',

    /* --- PWA --- */
    '/docs/app.js',
    '/docs/sw.js',

    /* --- HTML --- */
    '/docs/index.html',
    '/docs/404.html',

    
        '/docs/categories/',
    
        '/docs/tags/',
    
        '/docs/archives/',
    
        '/docs/about/',
    

    /* --- Favicons & compressed JS --- */
    
    
        '/docs/assets/img/favicons/android-chrome-192x192.png',
        '/docs/assets/img/favicons/android-chrome-512x512.png',
        '/docs/assets/img/favicons/apple-touch-icon.png',
        '/docs/assets/img/favicons/favicon-16x16.png',
        '/docs/assets/img/favicons/favicon-32x32.png',
        '/docs/assets/img/favicons/favicon.ico',
        '/docs/assets/img/favicons/mstile-150x150.png',
        '/docs/assets/js/dist/categories.min.js',
        '/docs/assets/js/dist/commons.min.js',
        '/docs/assets/js/dist/misc.min.js',
        '/docs/assets/js/dist/page.min.js',
        '/docs/assets/js/dist/post.min.js'
];

/* The request url with below domain will be cached */
const allowedDomains = [
    

    'localhost:4000',

    

    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net',
    'polyfill.io'
];

/* Requests that include the following path will be banned */
const denyUrls = [
    
];

