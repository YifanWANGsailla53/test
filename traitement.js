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
document.getElementById('destEmail').innerHTML=destEmail;
document.getElementById('destSMS').innerHTML=destSMS;

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
	console.log("table actualisée");
}

function error(err) {
  console.warn('ERROR(${err.code}): ${err.message}');
}

function email(){
	window.alert(document.getElementById('destEmail').innerHTML);
	if(document.getElementById('destEmail').innerHTML!=destEmail){
		console.log("actualisation du destinataire Email");
		destEmail=document.getElementById('destEmail').innerHTML;
		localStorage.setItem('destEmail',destEmail);
	}
	var subject='mes coordonnees';
	var message="Mes coordonnées mesurées par l'appli Web Progressive<br>"
	+'Latitude: '+latitude+'<br>Longitude: '+longitude+'<br>Précision: '+precision+'<br>Dernière mise à jour: '+miseAjour;
	console.log("envoi d'un Email");
	var email='mailto:'+destEmail+'?subject='+subject+'?body='+body;
	confirmation=window.confirm(email);
	if(confirmation==true){window.location.href=email;}
}
function sms(){
	console.log("envoi d'un SMS");
	navigator.mozSms.send(number, message);
}
function facebook(){
	console.log("envoi d'une alerte Facebook");
}
