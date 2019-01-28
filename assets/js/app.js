require('../scss/main.scss');
// import Chart from 'chart.js';

//Variables globale
const map = L.map('mapid').setView([47.115, 2.548828], 6);
const monSelect = document.querySelector('#country');

let markers = {};
let allCountry = [];
let markersLayer;
let stateValue;
let data;
let selectedCountry;
let chrono;
let countPlanesOnFly = 0;

L.tileLayer('https://api.mapbox.com/styles/v1/geoffroycarette/cjqxkkqxb15fm2rlqvssrl8r6/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ2VvZmZyb3ljYXJldHRlIiwiYSI6ImNqcXh1c20ycTBiZm80M2tlMnBlazFsc3QifQ.Nj35s8pJZFDudfEJGWHpDA'
}).addTo(map);

function updateData() {
    fetch("/json")
        .then((response) => response.json()
            .then((json) => {
                // console.log(json);
                data = json.states;
                listCountry();
                flyingPlanes();
            })
        );
}


function listCountry() {
    if (allCountry.length === 0) {
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


function filtreCountry() {
    return data.filter((state) => {
        return (state[2] === stateValue) && (state[5]) && (state[6]);
    });
}


function showMarker() {

    markersLayer = new L.LayerGroup();

    selectedCountry.forEach((state) => {
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


function deplacePlane() {
    updateData();
    drawMap();
    currentTime();
}


function drawMap() {
    if (typeof (markersLayer) === "object") {
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


function initApplication() {
    updateData();
}


/******* Apres chargement page  */
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        initApplication();

        monSelect.addEventListener('change', () => {
            clearInterval(chrono);
            stateValue = monSelect.value;
            drawMap();
            map.flyTo([47.115, 2.548828], 3);
            chrono = setInterval(deplacePlane, 16000);
        })
    }
}

function flyingPlanes() {
    countPlanesOnFly = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i][8] != true) {
            countPlanesOnFly++
        }
    }
    console.log(countPlanesOnFly);
}

function currentTime() {
    date = new Date();
    let time = date.toLocaleTimeString();

    console.log(time);
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

var ctx = document.getElementById('graphique1').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
        }]
    },

    // Configuration options go here
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    userCallback: function (label, index, labels) {
                        // when the floored value is the same as the value we have a whole number
                        if (Math.floor(label) === label) {
                            return label;
                        }
                    },
                }
            }],
        },
    }
});

var ctx2 = document.getElementById("graphique2").getContext('2d');
var myLineChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: ' vols',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var ctx3 = document.getElementById("graphique3").getContext('2d');
var myPieChart3 = new Chart(ctx3, {
    type: 'pie',
    data: {
        labels: ["France", "Suisse", "Espagne", "Allemagne", "Angleterre", "Portugal"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

// fonctions pictograme et fenetre information
const picto = document.querySelector('.picto');
const myWindow = document.querySelector('#window');
const croix = document.querySelector('.croix');

picto.addEventListener('click', function () {
    myWindow.style.display = 'block';
})

croix.addEventListener('click', function () {
    myWindow.style.display = 'none';
})

// var test = new Date();

// var aujourdhui = Math.round(new Date().getTime()/1000);

// var hier = Math.round((new Date().setTime(new Date().getTime() - 86400000))/1000);

// console.log(test);
// console.log (aujourdhui);
// console.log(hier);