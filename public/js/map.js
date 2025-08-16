// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken; // mapToken recieved from a script in the starting of show.ejs
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/standard', // default to standard street style on mount
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const layerList = document.getElementById('menu');
    const inputs = layerList.getElementsByTagName('input');

    for (const input of inputs) {
        input.onclick = (layer) => {
            const layerId = layer.target.id;
            map.setStyle('mapbox://styles/mapbox/' + layerId);
        };
    }

// console.log("recieved coordinates: " , listing.geometry.coordinates);

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color : "red"})
    .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`))
    .addTo(map);