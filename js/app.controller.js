import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onPanToMyLoc = onPanToMyLoc;
window.onSearchLoc = onSearchLoc;
window.onCreateLocation = onCreateLocation;
window.onCloseModal = onCloseModal;
window.onDeleteLoc = onDeleteLoc;
window.onCopyLoc = onCopyLoc;

var gPos;



function onInit() {
    mapService.initMap()
        .then((map) => {
            map.addListener("click", (mapsMouseEvent) => {
                const position = (mapsMouseEvent.latLng.toJSON())
                document.querySelector('.modal').classList.add('open')
                onPanTo(position.lat, position.lng)
                onAddMarker(position.lat, position.lng)
                gPos = position
            })
        })
        .catch(() => console.log('Error: cannot init map'));

    document.querySelector('input[type=search]').addEventListener('change', onSearchLoc);
    onGetLocs()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(lat, lng) {
    console.log('Adding a marker');
    mapService.addMarker({ lat, lng });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            if (locs.length) {
                renderLocs(locs)
            } else {
                document.querySelector('.loc-container').innerText = 'No Saved Locations Yet!'
            }
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
            onAddMarker(latitude, longitude)
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
    onAddMarker(lat, lng)
}

function onCreateLocation() {
    const elInp = document.querySelector('.place-name')
    onCloseModal()
    const name = elInp.value
    if (!name || name === ' ') return
    locService.createLocation(name, gPos)
    onGetLocs()
    elInp.value = ''
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function renderLocs(locs) {
    const strHtmls = locs.map(loc => {
        return `
        <div class="place">
        <h2> Place-Name : ${loc.name}</h2>
        <h4>Created : ${new Date(loc.createdAt)} </h4>
        <div class="place-btns">
        <button class="go-btn" onclick="onPanTo(${loc.lat},${loc.lng})">Go</button>
        <button class="delete-btn" onclick="onDeleteLoc('${loc.id}')">Delete</button>
        </div>
        </div>
        `
    })
    document.querySelector('.loc-container').innerHTML = strHtmls.join('')
}

function onDeleteLoc(locId) {
    console.log(locId);
    locService.deleteLoc(locId)
    onGetLocs()
}


function onCopyLoc(ev) {
    const { lat, lng } = mapService.copyLoc();
    // let copyLink = `https://itamaravady.github.io/travelTip/index.html?lat=${lat}&lng=${lng}`;
    let copyLink = `http://127.0.0.1:5501/index.html?lat=${lat}&lng=${lng}`;
    navigator.clipboard.writeText(copyLink);
    console.log(ev);
    showNotification('Location copied!', ev.clientX, ev.clientY);
}

function showNotification(msg, x, y) {
    const elNotification = document.querySelector('.notification');
    elNotification.style.left = `${x}px`;
    elNotification.style.top = `${y}px`;
    elNotification.innerText = msg;
    console.log(x, y);
    elNotification.style.display = 'block';
    setTimeout(() => {
        elNotification.style.display = 'none';
    }, 800)
}

