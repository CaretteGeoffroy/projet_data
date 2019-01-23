require('../scss/main.scss');

const map = L.map('mapid').setView([47.115, 2.548828], 6);

let markers = {};
var allCountry = [];
var markersLayer = new L.LayerGroup();

let allCountry = [];
let markersLayer = new L.LayerGroup();
let stateValue;

L.tileLayer('https://api.mapbox.com/styles/v1/geoffroycarette/cjqxkkqxb15fm2rlqvssrl8r6/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ2VvZmZyb3ljYXJldHRlIiwiYSI6ImNqcXh1c20ycTBiZm80M2tlMnBlazFsc3QifQ.Nj35s8pJZFDudfEJGWHpDA'
}).addTo(map);

function fetchData() {
    return fetch("https://opensky-network.org/api/states/all")
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            if( allCountry.length === 0 ){
                res['states'].forEach( (element)=>{
                    if( element[2].length >  0 ){
                        allCountry.push(element[2]);
                    }
                });

                displaySelect();
                createListDeroulante( allCountry );
            }

            return res.states.filter((state) => {
                return (state[2] === stateValue) && (state[5]) && (state[6]);
            });
        })
        .catch((err) => {
            if (err) throw err
        });
}

function plotStates(map, markers) {
    fetchData().then(function (states) {
        console.log(markersLayer);
        states.forEach((state) => {
            
            if (markers[state[0]]) {
                
                markers[state[0]].on('click', markerOnClick).setLatLng([state[6], state[5]]);
                markers[state[0]].options.lat = state[6];
                markers[state[0]].options.lng = state[5];
                markers[state[0]].options.icao24 = state[0];
                markers[state[0]].options.numAvion = state[1];  
                markers[state[0]].options.pays = state[2];
                markers[state[0]].options.altitude = state[7];
                markers[state[0]].options.vitesse = state[9];
            } else {
                
                markers[state[0]] = L.marker([state[6], state[5]], {lat: state[6], lng: state[5], icao24 : state[0], numAvion : state[1], pays : state[2], altitude : state[7], vitesse : state[9] });
                markers[state[0]].addTo(markersLayer).on('click', markerOnClick);
                map.addLayer(markersLayer);
                
            }

        });
        setTimeout(() => plotStates(map, markers), 15000);
    });
}

function createListDeroulante(allCountry){
    let uniq = [...new Set(allCountry)];
    allCountry = uniq;
    allCountry.sort();
    let select = document.querySelector('#country');
    allCountry.forEach( (element) =>{
        select.options[select.options.length] = new Option(element, element);
    });   
}

plotStates(map, markers);

document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('select[name="country"]').onchange=changeEventHandler;
},false);

function changeEventHandler(event) {
    
    map.removeLayer(markersLayer);
    markersLayer = new L.LayerGroup();
    stateValue = event.target.value;
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

function displaySelect() {
    monSelect.style.opacity = '1';
}





// var test = new Date();

// var aujourdhui = Math.round(new Date().getTime()/1000);

// var hier = Math.round((new Date().setTime(new Date().getTime() - 86400000))/1000);

// console.log(test);
// console.log (aujourdhui);
// console.log(hier);