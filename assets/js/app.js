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
let listCountPlane = new Array();
let myChart = null;
let listTimePlane = new Array();
let selectValue = 0;

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
                currentTime();
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
            altitude: Math.round(state[7]),
            vitesse: Math.round(state[9] * 3.6),
            rotation: Math.round(state[10])
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
            "<b>Altitude : </b>" + e.target.options.altitude + " m <br/>" +
            "<b>Vitesse : </b>" + e.target.options.vitesse + " km/h <br/>" +
            "<b>Rotation : </b>" + e.target.options.rotation + "°")
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
            myChart.data.datasets.data.splice(0, 1);
            myChart.data.labels.splice(0, 1);
            flyingPlanes();
            currentTime();
            loadGraph();
            map.flyTo([47.115, 2.548828], 3);
            chrono = setInterval(deplacePlane, 16000);
        })
    }
}

function flyingPlanes() {
    countPlanesOnFly = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i][8] != true && monSelect.value == 'Tous les pays') {
            countPlanesOnFly++
        } else if (data[i][8] != true && data[i][2] === stateValue) {
            countPlanesOnFly++
        }
    }

    if (listCountPlane.length < 10) {
        listCountPlane.push(countPlanesOnFly);
    } else {
        listCountPlane.shift();
        listCountPlane.push(countPlanesOnFly);
    }

    loadGraph();

    // console.log(ArrayPlanesOnFly);
}


//Mise à jour graphiques
function currentTime() {
    date = new Date();
    let time = date.toLocaleTimeString();

    if (listTimePlane.length < 10) {
        listTimePlane.push(time);
    } else {
        listTimePlane.shift();
        listTimePlane.push(time);
    }

    loadGraph();
}

// fonctions pictograme et fenetre information

const picto = document.querySelector('.picto');
const myWindow = document.querySelector('#window');
const croix = document.querySelector('.croix');
const logo = document.querySelector('.logo');
const country = document.querySelector('#country');



picto.addEventListener('click', function () {


    if (selectValue == 0) {
        myWindow.style.display = 'block';
        monSelect.style.display = 'none';
        selectValue = 1;
    } else if (selectValue == 1) {
        myWindow.style.display = 'none';
        monSelect.style.display = 'block';
        selectValue = 0;
    }

    clearInterval(chrono);
    chrono = setInterval(updateData, 16000);

})


croix.addEventListener('click', function () {
    myWindow.style.display = 'none';
    monSelect.style.display = 'block';
    selectValue = 0;
    clearInterval(chrono);
})

//Refresh de la map en cliquant sur le logo
logo.addEventListener('click', function(){
    monSelect.value = 'Tous les pays';
    map.removeLayer(markersLayer);
    myChart.data.datasets.data.splice(0, 1);
    myChart.data.labels.splice(0, 1);
    flyingPlanes();
    currentTime();
    loadGraph();
})

function loadGraph() {
    if (myChart === null) {
        let ctx = document.getElementById("graphique1");
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: listTimePlane,
                datasets: [{
                    label: 'Nombre d\'avions',
                    data: listCountPlane,
                    backgroundColor: [
                        'rgba(0, 0, 0, 0)'
                    ],
                    borderColor: [
                        'rgba(9, 132, 227,1.0)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Heure (mis à jour toutes les 16 secondes)'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Nombre d\'avions'
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Nombre d\'avions en vol en temps réel (' + monSelect.value + ')'
                }
            }
        });
    } else {
        myChart.data.datasets.data = listCountPlane;
        myChart.data.labels = listTimePlane;
        myChart.options.title.text = 'Nombre d\'avions en vol en temps réel (' + monSelect.value + ')';
        myChart.update();
    }

}


// var test = new Date();

// var aujourdhui = Math.round(new Date().getTime()/1000);

// var hier = Math.round((new Date().setTime(new Date().getTime() - 86400000))/1000);

// console.log(test);
// console.log (aujourdhui);
// console.log(hier);