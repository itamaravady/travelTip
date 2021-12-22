

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getGeolocate,
    copyLoc: copyLoc,
}


var gMap;
const API_KEY = 'AIzaSyCtnGiT2v1yGGn1vOvSjjAxBJQPURW-lao';
var gMarker;

function initMap() {
    const pos = getCoordsFromQueryParams();
    const { lat, lng } = (Object.keys(pos).length) ? pos : { lat: 31, lng: 31 };
    console.log(pos);
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15

            })
            // console.log('Map!', gMap);
            return getMap()
        })


}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });

    if (gMarker) {
        gMarker.visible = false
    }
    gMarker = marker
    return gMarker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getGeolocate(searchVal) {
    console.log("searching...");
    const addressTrimmed = searchVal.trim();
    const address = addressTrimmed.replace(' ', '+');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
    // console.log(url);
    let pos;
    fetch(url).then(res => res.json())
        .then(res => {
            const { lat, lng } = res.results[0].geometry.location;
            panTo(lat, lng);
        })
        .catch(err => console.log('place not found'));


}

function getMap() {
    return gMap
}

function copyLoc() {
    return gMap.center.toJSON();
}

function getCoordsFromQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
}

