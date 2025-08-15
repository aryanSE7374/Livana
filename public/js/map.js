// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken; // mapToken recieved from a script in the starting of show.ejs
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [77.2088, 28.6139], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
