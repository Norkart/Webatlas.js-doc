//vi gjør "map" tilgjengelig i console
var map;

$(document).ready(function() {
    //starter kartmotoren og putter det i div med id="map"
    map = new WebatlasMap('map', {customer: 'WA_JS_V3_Coursework'});

    //endrer senterpunkt til koordinatene og setter zoomnivå til 5
    map.setView(new L.LatLng(64.0107043, 11.4901134), 5);

    //definerer flere WMS'er og legger de til i "layer-control"
    var wmsbaerum = new L.TileLayer.WMS("http://clusterb.gisline.no/wms-baerum/?", {
        layers: 'RPL',
        format: 'image/png'
    });
    //legger til WMS'en i layer-control
    map.LayerControl.addOverlay(wmsbaerum, 'Bærum RPL');

    var wmsalta = new L.TileLayer.WMS("http://www.gisline.no/wms-alta/?", {
        layers: 'EIENDOMSKART',
        format: 'image/png'
    });
    map.LayerControl.addOverlay(wmsalta, 'Alta Eiendom');


    //lag en ny markør og legg til kartet
    var marker = L.marker([64.0107043, 11.4901134]).addTo(map);

    //legg markøren til som eget lag i "layer control"
    map.LayerControl.addOverlay(marker, 'marker');

    //Knytt en popup til markøren ved klikk.
<<<<<<< HEAD
<<<<<<< HEAD
    marker.bindPopup("Her kan det være HTML");
=======
    marker.bindPopup("Her kan det være <b>HTML</b>");
>>>>>>> FETCH_HEAD
=======
    marker.bindPopup("Her kan det være <b>HTML</b>");
>>>>>>> FETCH_HEAD

    

    //Lag en ny sirkel med radius og legg til kartet - merk at radius _ikke_ er geografisk
    var circle500 = L.circle([64.0107043, 11.4901134], 500, {
        color: 'green',
        fillColor: '#00FF00',
        fillOpacity: 0.5
    }).addTo(map);

    //legg sirkelen til som eget lag i "layer control"
    map.LayerControl.addOverlay(circle500, 'circle500');

    //knytt en hendelse til sirkelen når den blir klikket på
    circle500.on("click", function(evt) {
        //dette er "callback" funksjonen. Den kjører vanligvis i et eget "scope". Leaflet ordner dette for oss. JQuery gjør vanligvis ikke det
        console.log("callback");
        circleMarker.setRadius(300);
        map.removeLayer(this);
    });

    

    //Lag en sirkelmarkør (forenklet sirkel) og legg til kartet
    var circleMarker = L.circleMarker([64.0107043, 11.4901134], {
        color: 'red',
        fillColor: '#FF0000',
        fillOpacity: 0.5
    }).addTo(map);

    //legg sirkelmarkøren til som eget lag i "layer control"
    map.LayerControl.addOverlay(circleMarker, 'circleMarker');

    //Knytt en popup med en video til sirkelmarkøren
    circleMarker.bindPopup('<iframe width="200" height="200" src="http://www.youtube.com/embed/2JkwzHw6MxA" frameborder="0" allowfullscreen></iframe>');

});