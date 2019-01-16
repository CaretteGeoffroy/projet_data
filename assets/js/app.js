require('../scss/main.scss');

var mymap = L.map('mapid').setView([47.115, 2.548828], 6);


L.tileLayer('https://api.mapbox.com/styles/v1/geoffroycarette/cjqxkkqxb15fm2rlqvssrl8r6/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ2VvZmZyb3ljYXJldHRlIiwiYSI6ImNqcXh1c20ycTBiZm80M2tlMnBlazFsc3QifQ.Nj35s8pJZFDudfEJGWHpDA'
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
    
            }
            console.log('Coucou');
       

    })
    .catch((err) => {
        if (err) throw err
    })
}, 3000);