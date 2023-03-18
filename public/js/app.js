import { OpenStreetMapProvider } from 'leaflet-geosearch';

const lat = -33.4525756;;
const lng = -70.6184675; 

const map = L.map('mapa').setView([lat, lng], 15);

let markers = new L.FeatureGroup().addTo(map);
let marker;

document.addEventListener('DOMContentLoaded', () => {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // buscar la dirección
    const buscador = document.querySelector('#formbuscador');
    buscador.addEventListener('input', buscarDireccion);

})


function buscarDireccion(e) {
    if(e.target.value.length > 8) {

        // si existe un pin anterior limpiarlo
        if(marker){
            map.removeLayer(marker)
        }


        // Utilizar el provider y GeoCoder
        const geocodeService = L.esri.Geocoding.geocodeService();        
        const provider = new OpenStreetMapProvider();

        provider.search({query: e.target.value}).then((resultado) =>{

            // mostrar el mapa
            map.setView(resultado[0].bounds[0], 15);

            // agregar el pin
            marker = L.marker(resultado[0].bounds[0],{
                draggable:true,
                autoPan:true
            })
            .addTo(map)
            .bindPopup(resultado[0].label)
            .openPopup()    

            // detectar movimiento del marker
            marker.on('moveend', function(e) {
                marker = e.target;
                const posicion = marker.getLatLng();
                map.panTo(new L.LatLng(posicion.lat, posicion.lng) );
            })            

        
           
        })


    }
}