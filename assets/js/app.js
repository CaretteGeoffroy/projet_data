require('../scss/main.scss');

const map = L.map('mapid').setView([47.115, 2.548828], 6);

let unixDateAjd = Math.round((new Date()).getTime() / 1000);
let unixDateHier = Math.round(((new Date()).getTime() / 1000) - 1);


let d = new Date();
Math.round(d.setDate(d.getDate() - 1) / 1000);


console.log(unixDateAjd);
console.log(d);



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
                return (state[2] === 'France') && (state[5]) && (state[6]);
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
                markers[icao24].addTo(map);
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
plotStates(map, markers);