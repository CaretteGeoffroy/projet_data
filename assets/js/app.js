require('../scss/main.scss');

const map = L.map('mapid').setView([47.115, 2.548828], 6);
let a = 2;
// var marker = L.marker([48.8534, 2.3488]).addTo(mymap);
// var marker = L.marker([49.8534, 2.3488]).addTo(mymap); 
// var leafletId = marker._leaflet_id;

// for (let i = 0; i < 10; i++) {
// lat = Math.floor(Math.random() * 101);
// lng = Math.floor(Math.random() * 101);

// console.log(leafletId);
// }


L.tileLayer('https://api.mapbox.com/styles/v1/geoffroycarette/cjqxkkqxb15fm2rlqvssrl8r6/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ2VvZmZyb3ljYXJldHRlIiwiYSI6ImNqcXh1c20ycTBiZm80M2tlMnBlazFsc3QifQ.Nj35s8pJZFDudfEJGWHpDA'
<<<<<<< HEAD
}).addTo(mymap);

setInterval(() => {
fetch("https://opensky-network.org/api/states/all")
    .then((res) => {
        return res.json();
    })
    .then((res) => {

            for (let i = 0; i < res.states.length; i++) {
                if (res.states[i][2] == 'France') {
                    if (res.states[i][5] != null || res.states[i][6] != null) {
                        posA = res.states[i][5];
                        posB = res.states[i][6];
                        var marker = L.marker([posB, posA]).addTo(mymap);
                    }
                }
                // move console.log(res.states[i][2]);
            }

    })
    .catch((err) => {
        if (err) throw err
    })
}, 3000);
=======
}).addTo(map);

function fetchData() {
    return fetch("https://opensky-network.org/api/states/all")
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res.states.filter((state) => {
                return (state[2] === 'France') && (state[5]) && (state[6]);
            });
        })
        .catch((err) => {
            if (err) throw err
        });
}

function plotStates(map, markers) {
    fetchData().then(function(states) {
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
>>>>>>> 661b8555c700a84ffeff9da4048dfd11e1495765
