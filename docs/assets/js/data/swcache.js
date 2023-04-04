const resource = [
    /* --- CSS --- */
    '/cubeapm/assets/css/style.css',

    /* --- PWA --- */
    '/cubeapm/app.js',
    '/cubeapm/sw.js',

    /* --- HTML --- */
    '/cubeapm/index.html',
    '/cubeapm/404.html',

    
        '/cubeapm/categories/',
    
        '/cubeapm/tags/',
    
        '/cubeapm/archives/',
    
        '/cubeapm/about/',
    

    /* --- Favicons & compressed JS --- */
    
    
        '/cubeapm/assets/img/favicons/android-chrome-192x192.png',
        '/cubeapm/assets/img/favicons/android-chrome-512x512.png',
        '/cubeapm/assets/img/favicons/apple-touch-icon.png',
        '/cubeapm/assets/img/favicons/favicon-16x16.png',
        '/cubeapm/assets/img/favicons/favicon-32x32.png',
        '/cubeapm/assets/img/favicons/favicon.ico',
        '/cubeapm/assets/img/favicons/mstile-150x150.png',
        '/cubeapm/assets/js/dist/categories.min.js',
        '/cubeapm/assets/js/dist/commons.min.js',
        '/cubeapm/assets/js/dist/misc.min.js',
        '/cubeapm/assets/js/dist/page.min.js',
        '/cubeapm/assets/js/dist/post.min.js'
];

/* The request url with below domain will be cached */
const allowedDomains = [
    

    '',

    

    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net',
    'polyfill.io'
];

/* Requests that include the following path will be banned */
const denyUrls = [
    
];

