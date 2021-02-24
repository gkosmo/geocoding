import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
const initMapbox = () => {
  const mapElement = document.getElementById('map');
  console.log("init map box called")
  if (mapElement) { // only build a map if there's a div#map to inject into
    mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
    setMap(mapElement)
  const locationButton = document.getElementById('center-on-user');
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
      console.log(pos)
      let map = setMap(mapElement, pos)

    })
    }
    });
  }
};

const fitMapToMarkers = (map, markers) => {
  const bounds = new mapboxgl.LngLatBounds();
  markers.forEach(marker => bounds.extend([ marker.lng, marker.lat ]));
  map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
};


const setMap = (mapElement, pos = null ) => {

  const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/gkosmo/cjswyidcz1sd41frs6k1hq8ot'
    });
    const markers = JSON.parse(mapElement.dataset.markers);
    console.log(pos)
    if(pos){markers.push(pos); }
    markers.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.infoWindow); // add this
      new mapboxgl.Marker()
        .setLngLat([ marker.lng, marker.lat ])
        .setPopup(popup)
        .addTo(map);
    });
    fitMapToMarkers(map, markers)
    map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken,
                                      mapboxgl: mapboxgl }));
    return map
}
export { initMapbox };
