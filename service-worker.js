importScripts('./js/cache-polyfill.js');

var CACHE_VERSION = 'app-v1';
var CACHE_FILES = [
    './',
    './images/background.jpeg',
    './userData.json',
    './js/app.js',
    './css/styles.css',
    'https://fonts.googleapis.com/css?family=Roboto:100'
];


self.addEventListener('install', function (event) {
	console.log('[install] Kicking off service worker registration!');
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(function (cache) {
                console.log('Opened cache');
				// Once the contents are loaded, convert the raw text to a JavaScript object
				return fetch('userData.json').then(function(response) {
				  // Once the contents are loaded, convert the raw text to a JavaScript object
				  return response.json();
				}).then(function(files) {
				  // Use cache.addAll just as you would a hardcoded array of items
				  console.log('[install] Adding files from JSON file: ', files);
				  
				  return cache.addAll(CACHE_FILES);
				});
            })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function(keys){
            return Promise.all(keys.map(function(key, i){
                if(key !== CACHE_VERSION){
                    return caches.delete(keys[i]);
                }
            }))
        })
    )
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function(res){
            if(res){
                return res;
            }
            requestBackend(event);
        })
    )
});

function requestBackend(event){
    var url = event.request.clone();
    return fetch(url).then(function(res){
        //if not a valid response send the error
        if(!res || res.status !== 200 || res.type !== 'basic'){
            return res;
        }

        var response = res.clone();

        caches.open(CACHE_VERSION).then(function(cache){
            cache.put(event.request, response);
        });

        return res;
    })
}
