import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onPanToMyLoc = onPanToMyLoc;
window.onSearchLoc = onSearchLoc;
window.onSaveLoc = onSaveLoc;

function onInit() {
    mapService.initMap()
        .then((map) => {
            map.addListener("click", (mapsMouseEvent) => {
                const position = (mapsMouseEvent.latLng.toJSON())
                console.log(mapsMouseEvent);
                const placeName = prompt('name?')
                locService.createLocation(placeName, position)
                onPanTo(position.lat, position.lng)
            })
        })
        .catch(() => console.log('Error: cannot init map'));

    document.querySelector('input[type=search]').addEventListener('change', onSearchLoc);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanToMyLoc() {
    getPosition()
        .then(pos => {
            const { latitude, longitude } = pos.coords;
            mapService.panTo(latitude, longitude);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onSearchLoc(ev) {
    const searchVal = ev.target.value
    mapService.getGeolocate(searchVal);
}

function onPanTo(lat = 31, lng = 31) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}

function onSaveLoc() {
    const { lat, lng } = mapService.saveLoc();
    let copyLink = `https://itamaravady.github.io/travelTip/index.html?lat=${lat}&lng=${lng}`;
    navigator.clipboard.writeText(copyLink);
}

