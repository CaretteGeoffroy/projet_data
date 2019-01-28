/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/js/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/js/app.js":
/*!**************************!*\
  !*** ./assets/js/app.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../scss/main.scss */ "./assets/scss/main.scss");
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
            chrono = setInterval( deplacePlane, 16000 );
        })
    }
}

// fonctions pictograme et fenetre informations

const picto = document.querySelector('.picto');
const myWindow = document.querySelector('#window');
const myCroix = document.querySelector('.croix');
const croix = document.querySelector('.croix');


picto.addEventListener('click', function(){
    myWindow.style.display = 'block';
})

croix.addEventListener('click', function(){
    myWindow.style.display = 'none';
})

// var test = new Date();

// var aujourdhui = Math.round(new Date().getTime()/1000);

// var hier = Math.round((new Date().setTime(new Date().getTime() - 86400000))/1000);

// console.log(test);
// console.log (aujourdhui);
// console.log(hier);

/***/ }),

/***/ "./assets/scss/main.scss":
/*!*******************************!*\
  !*** ./assets/scss/main.scss ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

/******/ });
//# sourceMappingURL=app.js.map