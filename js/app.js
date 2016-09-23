if (navigator.serviceWorker) {
     navigator.serviceWorker.register('./service-worker.js', {scope: './'})
        .then(function (registration) {
            console.log('[AppJS] Registration Successful');
           // console.log(registration);
        })
        .catch(function (e) {
            console.error(e);
        })
} else {
    console.log('[AppJS] Service Worker is not supported in this browser.')
}
