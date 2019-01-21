require('../scss/main.scss');





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

            console.log(stateValue);
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
                icao24 = state[0];

            if (markers[icao24]) {
                markers[icao24].setLatLng([lat, lng]);
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

const markers = {};
var allCountry = [];
const map = L.map('mapid').setView([47.115, 2.548828], 6);
var markersLayer = new L.LayerGroup();
let stateValue;
L.tileLayer('https://api.mapbox.com/styles/v1/geoffroycarette/cjqxkkqxb15fm2rlqvssrl8r6/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ2VvZmZyb3ljYXJldHRlIiwiYSI6ImNqcXh1c20ycTBiZm80M2tlMnBlazFsc3QifQ.Nj35s8pJZFDudfEJGWHpDA'
}).addTo(map);



plotStates(map, markers);

document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('select[name="country"]').onchange=changeEventHandler;
},false);

function changeEventHandler(event) {
    map.removeLayer(markersLayer);
    markersLayer = new L.LayerGroup();
    stateValue = event.target.value;
}
