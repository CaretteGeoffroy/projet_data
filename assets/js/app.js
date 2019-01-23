require('../scss/main.scss');
//Variables globale
const map = L.map('mapid').setView([47.115, 2.548828], 6);
let markers = {};
let allCountry = [];
let markersLayer;
const monSelect = document.querySelector('#country');
let stateValue;
let data;
let selectedCountry;
let chrono;
L.tileLayer('https://api.mapbox.com/styles/v1/geoffroycarette/cjqxkkqxb15fm2rlqvssrl8r6/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ2VvZmZyb3ljYXJldHRlIiwiYSI6ImNqcXh1c20ycTBiZm80M2tlMnBlazFsc3QifQ.Nj35s8pJZFDudfEJGWHpDA'
}).addTo(map);






function updateData(){
    fetch("/json")
    .then( (response) => response.json()
        .then( ( json ) => {
            console.log(json);
            data = json.states;
            listCountry();
        } )  
    );
}


function listCountry(){
    if ( allCountry.length === 0) {
        data.forEach((element) => {
            if (element[2].length > 0) {
                allCountry.push(element[2]);
            }
        });
        createListDeroulante(allCountry);
        displaySelect();  
    }
        
}

function createListDeroulante(allCountry) {
    let uniq = [...new Set(allCountry)];
    allCountry = uniq;
    allCountry.sort();
    let select = document.querySelector('#country');
    allCountry.forEach((element) => {
        select.options[select.options.length] = new Option(element, element);
    });
}

function displaySelect() {
    monSelect.style.opacity = '1';
}


function filtreCountry(){
    return data.filter((state) => {
        return (state[2] === stateValue) && (state[5]) && (state[6]);
    });
}


function showMarker(){
    
    markersLayer = new L.LayerGroup();
    
    selectedCountry.forEach( ( state ) => {
        markers[state[0]] = L.marker([state[6], state[5]], {
            lat: state[6],
            lng: state[5],
            icao24: state[0],
            numAvion: state[1],
            pays: state[2],
            altitude: state[7],
            vitesse: state[9]
        });
        
        markers[state[0]].addTo(markersLayer).on('click', markerOnClick);
    });

    
    map.addLayer(markersLayer);
}


function deplacePlane(){
    updateData();
    drawMap();
}


function drawMap(){
    if( typeof(markersLayer) === "object"){
        map.removeLayer(markersLayer);
    }
    map.closePopup();
    selectedCountry = filtreCountry();
    showMarker();
   
}

function markerOnClick(e) {
    var popup = L.popup()
        .setLatLng([e.target.options.lat, e.target.options.lng])
        .setContent("<b>Numéro d'avion : </b>" + e.target.options.numAvion + "<br/>" +
            "<b>Pays d'origine : </b>" + e.target.options.pays + "<br/>" +
            "<b>Latitude : </b>" + e.target.options.lat + "<b> Longitude : </b>" + e.target.options.lng + "<br/>" +
            "<b>Altitude : </b>" + e.target.options.altitude + "<br/>" +
            "<b>Vitesse : </b>" + e.target.options.vitesse + " m/s <br/>")
        .openOn(map);
};


function initApplication(){
    updateData();
    
}


/******* Apres chargement page  */
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        initApplication();

        monSelect.addEventListener('change', () =>{
            clearInterval( chrono );
            stateValue = monSelect.value;
            drawMap();
            map.flyTo([47.115, 2.548828], 3);
            chrono = setInterval( deplacePlane, 16000 );
        })
    }
}




// var test = new Date();

// var aujourdhui = Math.round(new Date().getTime()/1000);

// var hier = Math.round((new Date().setTime(new Date().getTime() - 86400000))/1000);

// console.log(test);
// console.log (aujourdhui);
// console.log(hier);
