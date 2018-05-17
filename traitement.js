//enregistrer le worker si c'est pas deja fait

	if ( 'serviceWorker' in navigator ) {
		navigator.serviceWorker.register('/test/serviceWorker.js', {scope: '/test/'}).then(function(registration) {
		// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}).catch(function(err) {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err);
		});
	}
refreshGPS();
var destEmail=localStorage.getItem('destEmail');
var destSMS=localStorage.getItem('destSMS');
var latitude,longitude,precision,miseAjour;//variables globales pour ne pas avoir à les récupèrer à chaque fois dans la DOM
var sujet;
var message;
var connection=(window.navigator.onLine?'online':'offline');
console.log('connection:'+connection);
document.getElementById('connection').innerHTML=connection;
document.getElementById('destEmail').value=destEmail;
document.getElementById('destSMS').value=destSMS;

function refreshGPS(){
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(success, error, options);
	} else {
	  window.alert('Votre navigateur ne supporte pas la géolocalisation');
	}
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
	//mise à jour de l'état de connection
	connection=(window.navigator.onLine?'online':'offline');
	console.log('connection:'+connection);
	document.getElementById('connection').innerHTML=connection;
	//mise à jour des coordonnées
	var coord = pos.coords;
	latitude=coord.latitude.toPrecision(6);
	longitude=coord.longitude.toPrecision(6);
	precision=coord.accuracy.toPrecision(6);
	var d=new Date();
	miseAjour=d.getHours()+"h"+d.getMinutes()+":"+d.getSeconds();
	document.getElementById("latitude").innerHTML=latitude;
	document.getElementById("longitude").innerHTML=longitude;
	document.getElementById("precision").innerHTML=precision;
	document.getElementById("miseAjour").innerHTML=miseAjour;
	console.log("Coordonnées mises à jour");
	//mise à jour des variables globales
	sujet='Geolocalisation '+d.getHours()+"h"+d.getMinutes();
	message="Mes coordonnées mesurées par l'appli Web Progressive\r\nLatitude: "+latitude+'\r\nLongitude: '+longitude+'\r\nPrécision: '+precision+'\r\nDernière mise à jour: '+miseAjour;
	console.log("Variables globales mises à jour");
	//mise à jour du fichier téléchargeable
	var d=new Date();
	var blob = new Blob([message], {type: 'text/plain',charset:'utf-8'});
	var url=window.URL.createObjectURL(blob);
	console.log('Blob '+blob+' créee');
	var lien=document.getElementById("telecharger");
	lien.setAttribute('href',url);
	lien.setAttribute('download',sujet+".txt");
	console.log('Lien de téléchargement mis à jour');
}

function error(err) {
  console.warn('ERROR(${err.code}): ${err.message}');
}

function email(){
	if(document.getElementById('destEmail').value!=destEmail){
		destEmail=document.getElementById('destEmail').value;
		localStorage.setItem('destEmail',destEmail);
		console.log("Destinataire Email enregistré");
	}
	var subject='mes coordonnees';
	var ecMessage=encodeURIComponent(message);
	var email='mailto:'+destEmail+'?subject='+subject+'&body='+ecMessage;
	// confirmation=window.confirm(email);
	// if(confirmation==true){
	window.location.href=email;
	console.log("Email ouvert dans l'application de messagerie");
}

function sms(){
	if(document.getElementById('destSMS').value!=destSMS){
		console.log("Destinataire SMS enregistré");
		destSMS=document.getElementById('destSMS').value;
		localStorage.setItem('destSMS',destSMS);
	}
	var ecMessage=encodeURIComponent(message);
	console.info(message);
	console.info(ecMessage);
	var d=new Date();
	miseAjour=d.getHours()+"h"+d.getMinutes()+":"+d.getSeconds();
	document.getElementById("latitude").innerHTML=latitude;
	document.getElementById("longitude").innerHTML=longitude;
	document.getElementById("precision").innerHTML=precision;
	document.getElementById("miseAjour").innerHTML=miseAjour;
	console.log("Coordonnées mises à jour");
	//mise à jour des variables globales
	message="Mes coordonnées mesurées par l'appli Web Progressive\r\nLatitude: "+latitude+'\r\nLongitude: '+longitude+'\r\nPrécision: '+precision+'\r\nDernière mise à jour: '+miseAjour;
	console.info(message);
	var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;//android
        var isiOS = u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios
	console.log("SMS ouvert dans l'application SMS");
	if(isiOS){
		console.log('ios');
       		window.location.href="sms://"+destSMS+"&body="+ecMessage;
	}
	else{
       		window.location.href.href="sms://"+destSMS+"?body="+ecMessage;
	}

    	}

