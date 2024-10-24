
/*
--------------------- Kart ------------------
*/

// Initialiser kartet
var mymap = L.map('mapid').setView([65, 13], 5); // Sentrerer over Norge

// Legg til kartlag (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(mymap);

/*
--------------------- Ikon ------------------
*/

// Tilpasset ikon for figuren
var figurIcon = L.icon({
    iconUrl: 'Images/figur.png',
    iconSize: [50, 50], // Juster størrelsen
    iconAnchor: [25, 50], // Punktet i ikonet som tilsvarer posisjonen
    popupAnchor: [0, -50] // Hvor popuppen vises i forhold til ikonet
});

// Legg til figuren som en drabar marker
var figurMarker = L.marker([65, 13], {icon: figurIcon, draggable: true}).addTo(mymap);

// Når figuren beveger seg
figurMarker.on('move', function(e) {
    var posisjon = e.target.getLatLng();
    console.log('Icon moved to:', posisjon.lat, posisjon.lng);
    hentVaerData(posisjon.lat, posisjon.lng);
        sjekkNærhet();
});

// Variabel for å holde oversikt over siste viste sted
var sistVisteSted = null;

// Load the sound files
var pickUpSound = new Audio('sounds/pickup.mp3'); // Sound for picking up the icon
var dropSound = new Audio('sounds/drop.mp3'); // Sound for dropping the icon

// Play the sound when the user picks up the icon (drag start)
figurMarker.on('dragstart', function() {
    pickUpSound.play();
});

pickUpSound.play().catch(function(error) {
    console.log('Error playing pick-up sound:', error);
});

// Play the sound when the user drops the icon (drag end)
figurMarker.on('dragend', function() {
    dropSound.play();
});

dropSound.play().catch(function(error) {
    console.log('Error playing drop sound:', error);
});


/*
--------------------- markører ------------------
*/

// Legg til markører for Oslo, Narvik og Tromsø
var steder = [
    {
        navn: 'Oslo',
        koordinater: [59.9139, 10.7522],
        beskrivelse: 'I Oslo fullførte jeg videregående skole og begynte på universitetet.'
    },
    {
        navn: 'Narvik',
        koordinater: [68.4385, 17.4272],
        beskrivelse: 'I Narvik tilbrakte jeg en del av barndommen min.'
    },
    {
        navn: 'Tromsø',
        koordinater: [69.6492, 18.9553],
        beskrivelse: 'Tromsø er et sted som har hatt en spesiell plass i livet mitt. Jeg bodde her som liten før familien min flyttet tilbake til Oslo.'
    },
    {
        navn: 'Vestby',
        koordinater: [59.60511, 10.75233],
        beskrivelse: 'I Tromsø utviklet jeg min interesse for teknologi fra ung alder.'
    },
    {
        navn: 'Vestby',
        koordinater: [59.58290, 11.16490],
        beskrivelse: 'I Tromsø utviklet jeg min interesse for teknologi fra ung alder.'
    },
];

// Legg til markørene på kartet
steder.forEach(function(sted) {
    L.marker(sted.koordinater).addTo(mymap)
        .bindPopup(sted.navn);
});

/*
--------------------- Sted informasjon ------------------
*/

// Funksjon for å sjekke nærhet til steder
function sjekkNærhet() {
    var lyd = new Audio('./sounds/pop-up.mp3'); // Legg til din egen lydfil
    var figurPosisjon = figurMarker.getLatLng();
    var stedFunnet = false;

    steder.forEach(function(sted) {
        var stedPosisjon = L.latLng(sted.koordinater);
        var avstand = figurPosisjon.distanceTo(stedPosisjon);

        if (avstand < 10000) { // Terskel i meter
            stedFunnet = true;
            if (sistVisteSted !== sted.navn) {
                visStedInformasjon(sted);
                lyd.play(); // Spill av lyd når informasjon vises
                sistVisteSted = sted.navn;
            }
        }
    });

    if (!stedFunnet) {
        sistVisteSted = null;
        skjulStedInformasjon();
    }
}

// Funksjon for å vise stedsinformasjon
function visStedInformasjon(sted) {
    // Vis informasjonen i `sted-informasjon`-diven
    const infoDiv = document.getElementById('sted-informasjon');
    infoDiv.innerHTML = `
        <h2>${sted.navn}</h2>
        <p>${sted.beskrivelse}</p>
        <button id="lukk-knapp">Lukk</button>
    `;
    infoDiv.style.display = 'block';

    document.getElementById('lukk-knapp').addEventListener('click', function() {
        infoDiv.style.display = 'none';
    });
}

// Funksjon for å skjule stedsinformasjon
function skjulStedInformasjon() {
    const infoDiv = document.getElementById('sted-informasjon');
    infoDiv.style.display = 'none';
}

/*
--------------------- Værets informasjon api ------------------
*/

// Funksjon for å hente værdata fra Yr API
function hentVaerData(lat, lon) {
    var url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

    fetch(url, {
        headers: {
            'User-Agent': 'værinformasjon/1.0' // Husk å endre til ditt appnavn
        }
    })
    .then(response => response.json())
    .then(data => {
        // Call the visVaerInformasjon function with the new data
        visVaerInformasjon(data);
    })
    .catch(error => console.error('Feil ved henting av værdata:', error));
}



function getCustomWeatherIcon(symbolCode) {
    const iconMap = {
        'clearsky_day': './icons/sunny.png',
        'clearsky_night': './icons/clear_night.png',
        'partlycloudy_day': './icons/partly_cloudy.png',
        'partlycloudy_night': './icons/partly_cloudy_night.png',
        'cloudy': './icons/cloudy.png',
        'rain': './icons/rain.png',
        'heavyrain': './icons/heavy_rain.png',
        'snow': './icons/snow.png',
        'fog': './icons/fog.png'
        // Add more as needed
    };

    return iconMap[symbolCode] || './icons/cloudy.png'; // Default icon
}


function visVaerInformasjon(data) {

    var temperatur = data.properties.timeseries[0].data.instant.details.air_temperature;
    var vindhastighet = data.properties.timeseries[0].data.instant.details.wind_speed;
    var nedbør = data.properties.timeseries[0].data.next_1_hours?.details?.precipitation_amount || 0;
    var utcTime = data.properties.timeseries[0].time;

    // Convert the UTC time into a more readable format
    var dateObject = new Date(utcTime); // Convert to Date object
    var formattedUTCDate = dateObject.toUTCString().replace(/ \d{2}:\d{2}:\d{2} GMT$/, '');

    var symbolCode = data.properties.timeseries[0].data.next_1_hours?.summary?.symbol_code || 'clearsky_day';
    var weatherIconUrl = getCustomWeatherIcon(symbolCode);

    // Update the DOM to show weather information, icon, and formatted UTC time
    const vaerDiv = document.getElementById('vaer-informasjon');
    vaerDiv.innerHTML = `
        <h2>Værinformasjon</h2>
        <img src="${weatherIconUrl}" alt="Vær ikon" style="width: 50px; height: 50px;">
        <p>Temperatur: ${temperatur}°C</p>
        <p>Vindhastighet: ${vindhastighet} m/s</p>
        <p>Nedbør (neste time): ${nedbør} mm</p>
        <p>Date: ${formattedUTCDate}</p>
    `;
    vaerDiv.style.display = 'block';
}

// Når dragging av figuren stopper
figurMarker.on('dragend', function(e) {
    var posisjon = e.target.getLatLng();
    hentVaerData(posisjon.lat, posisjon.lng);
});


