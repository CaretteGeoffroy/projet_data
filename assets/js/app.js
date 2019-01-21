require('../scss/main.scss');

const map = L.map('mapid').setView([47.115, 2.548828], 6);


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
            for (let i = 0; i < res.states.length; i++) {
                let allCountry = res.states[i][2];

                // let unique = [...new Set(allCountry)];
                // console.log(unique);

                let select = document.querySelector('#country');
                select.options[select.options.length] = new Option(allCountry, 'value_' + i);
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

const markers = {};
plotStates(map, markers);


var test = new Date();

var aujourdhui = Math.round(new Date().getTime()/1000);

var hier = Math.round((new Date().setTime(new Date().getTime() - 86400000))/1000);

console.log(test);
console.log (aujourdhui);
console.log(hier);