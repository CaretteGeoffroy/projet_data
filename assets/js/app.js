require('../scss/main.scss');

const map = L.map('mapid').setView([47.115, 2.548828], 6);

const markers = {};
var allCountry = [];
var markersLayer = new L.LayerGroup();

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
        states.forEach((state) => {
            const lat = state[6],
                lng = state[5],
                icao24 = state[0],
                numAvion = state[1],
                pays = state[2],
                altitude = state[7],
                vitesse = state[9];

            if (markers[icao24]) {
                markers[icao24].on('click', markerOnClick).setLatLng([lat, lng]);

                let popup = L.popup();

                function markerOnClick(e) {
                    popup
                        .setLatLng(e.latlng)
                        .setContent(
                            "<b>Numéro d'avion : </b>" + numAvion + "<br/>" +
                            "<b>Pays d'origine : </b>" + pays + "<br/>" +
                            "<b>Latitude : </b>" + lat + "<b> Longitude : </b>" + lng + "<br/>" +
                            "<b>Altitude : </b>" + altitude + "<br/>" +
                            "<b>Vitesse : </b>" + vitesse + "<br/>" )
                        .openOn(map);
                };
            } else {
                markers[icao24] = L.marker([lat, lng]);
                markers[icao24].addTo(markersLayer);
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

// var test = new Date();

// var aujourdhui = Math.round(new Date().getTime()/1000);

// var hier = Math.round((new Date().setTime(new Date().getTime() - 86400000))/1000);

// console.log(test);
// console.log (aujourdhui);
// console.log(hier);