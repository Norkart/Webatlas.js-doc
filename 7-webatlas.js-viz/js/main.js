//vi gjør "map" tilgjengelig i console
var map;

$(document).ready(function() {
    //starter kartmotoren og putter det i div med id="map"
    map = new WebatlasMap('map', {
        customer: 'WA_JS_V3_Coursework'
    });

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
    var marker = L.marker([64.0107043, 11.4901134]);

    //legg markøren til som eget lag i "layer control"
    map.LayerControl.addOverlay(marker, 'marker');

    //Knytt en popup til markøren ved klikk.
    marker.bindPopup("Her kan det være <b>HTML</b>");



    //Lag en ny sirkel med radius og legg til kartet - merk at radius _ikke_ er geografisk
    var circle500 = L.circle([64.0107043, 11.4901134], 500, {
        color: 'green',
        fillColor: '#00FF00',
        fillOpacity: 0.5
    });

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
    });

    //legg sirkelmarkøren til som eget lag i "layer control"
    map.LayerControl.addOverlay(circleMarker, 'circleMarker');

    //Knytt en popup med en video til sirkelmarkøren
    circleMarker.bindPopup('<iframe width="200" height="200" src="http://www.youtube.com/embed/2JkwzHw6MxA" frameborder="0" allowfullscreen></iframe>');

    //definerer en liste vi skal samle punktene våre i
    var pointList = [];

    //definer en funksjon som vi skal kalle for hver feature som leses i L.geoJson()
    function visPopup(feature, layer) {
        //legg til et punkt i punktlisten. Punktet er en liste med "lat, lng"
        pointList.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);

        //midlertidig variabel for å bygge strengen til popup'en
        var string = "";
        //looper igjennom alle _egenskapene_ til JSON-objektet
        for (var k in feature.properties) {
            //bygger strengen basert på egenskapsnavnet (k) og verdien til egenskapen feature.properties[k]
            string += k + " : " + feature.properties[k] + "<br>"
        }
        //knytter en popup til hver feature med strengen vi nettopp bygde
        layer.bindPopup(string);
    };

    /**
    Bedre måte å hente inn data på. Henter inn asynkront. Pass på context! (fungerer ikke for localhost)
    */
    var dataLayer;
    $.getJSON("datakilder/pubs_restaurant_norway.geojson", function(data) {
        //Start "geoJson"-motoren til Leaflet. Den tar inn et JSON-objekt i en variabel. Denne har vi definert i JSON-filen i index.html
        dataLayer = L.geoJson(data, {
            onEachFeature: visPopup, //vi refererer til funksjonen vi skal kalle. Husk at funksjonen også er et objekt
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);
        //legg til punktene til "layer control"
        map.LayerControl.addOverlay(dataLayer, "Datalag (geojson)");

        //start opp heatmap-motoren - vi bruker punktlisten vi lagde ovenfor og setter parametere
        var heatmapLayer = L.heatLayer(pointList, {
            radius: 80
        });

        //Legg til heatmap til layer control
        map.LayerControl.addOverlay(heatmapLayer, "Heatmap");

        //start opp maskeringsmotoren og sett nødvendige parametere
        var coverageLayer = new L.TileLayer.MaskCanvas({
            'opacity': 0.8,
            radius: 500,
            useAbsoluteRadius: true,
            'attribution': ''
        });

        //knytt punktlisten vår til maskeringsmotoren
        coverageLayer.setData(pointList);
        //legg til maskering som eget lag i layer control
        map.LayerControl.addOverlay(coverageLayer, "Dekning");

        //start clustermotoren
        var markers = new L.MarkerClusterGroup();

        //legg til eiendommer-laget til clustermotoren og legg til kartet
        markers.addLayer(dataLayer);//.addTo(map);
        //legg også til som eget lag i layer control
        map.LayerControl.addOverlay(markers, "Datalag (cluster)");
    });


    //Sett opp stil til de nye sirkelmarkørene
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    /*Alternativ metode for localhost og synkron lasting*
    //Start "geoJson"-motoren til Leaflet. Den tar inn et JSON-objekt i en variabel. Denne har vi definert i JSON-filen i index.html
    var dataLayer = L.geoJson(pubsGeoJSON, {
        onEachFeature: visPopup, //vi refererer til funksjonen vi skal kalle. Husk at funksjonen også er et objekt
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });
    */

    //legg til punktene til "layer control"
    //map.LayerControl.addOverlay(dataLayer, "Datalag (geojson)");

    //Legg inn minimap i hjørnet
    var WA_vector = new L.TileLayer.WA();
    var miniMap = new L.Control.MiniMap(WA_vector, {
        toggleDisplay: true,
        autoToggleDisplay: true
    }).addTo(map);
});