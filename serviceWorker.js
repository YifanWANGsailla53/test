var toCache=['/index.html','/styles.css','/serviceWorker.js','/treatment.js'];

self.addEventListener('install', event => {//lors du chargement de index.html
  console.log("ServiceWorker en cours d'installation…");
	event.waitUntil(
    caches.open('geoLocCaching').then(function(cache) {
      return cache.addAll([
        '/test/',
        '/test/traitement.js',
        '/test/index.html'     
      ]);
    })
  );
});

self.addEventListener('activate', event => {
	//chargement anticipé des pages puisqu'on vise un fonctionnement offline
	//application experimentale, on ne gère pas les versions de cache
	event.waitUntil(caches.open('geoLocCaching')
	.then(cache=>{return cache.addAll( toCache );})
	.then(self.clients.claim())
	.catch(e=>{console.log('Error handling cache', e);}))
	console.log('ServiceWorker activé!');
});

//ServiceListener standard qui met en cache tout ce qui passe
//prévoit un chargement online avec mise en cache si quelquechose manque
self.addEventListener('fetch', event => {
  console.log('Redirection de', event.request.url);
  event.respondWith(
    // Opens Cache objects that start with 'font'.
    caches.open(geoLocCaching).then(function(cache) {
      return cache.match(event.request).then(function(response) {
	      
        if (response) {
          console.log('Réponse trouvée dans le cache:', response);
          return response;
        }
	      
        console.log('Réponse à charger sur le serveur');
	      
        return fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
	  document.getElementById("connection").innerHTML="Online";//on vient d'utiliser la connection
          return networkResponse; });
	      
      }).catch(function(error) {
        // Handles exceptions that arise from match() or fetch().
		document.getElementById("connection").innerHTML="Offline";//il n'y a plus de connection fiable
        console.error('Erreur dans le chargement:', error);
        throw error;
      });
	    
    });
  );)
});
