/**
* RASK DEMONSTRASJON PÅ HVORDAN FARGELEKKE MARKØRER I FORSKJELLIGE FARGER BASERT PÅ 
* VERDIER I HVER FEATURE FRA GEOJSON
* MERK: IKKE OPTIMAL LØSNING, MEN FUNGERENDE OG ENKEL FOR OPPLÆRING
*/
//vi gjør "map" tilgjengelig i console
var map;

$(document).ready(function() {
    //starter kartmotoren og putter det i div med id="map"
    map = new WebatlasMap('map');

    //endrer senterpunkt til koordinatene og setter zoomnivå til 9
    map.setView(new L.LatLng(63.5107043, 10.4901134), 9)

    
    //definer en funksjon som vi skal kalle for hver feature som leses i L.geoJson()
    function visPopup(feature, layer) {
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

    //Sett opp stil til de nye sirkelmarkørene
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //liste som skal holde punktdata til bruk i heatmap og dekningskart
    var eiendomspunkter = [];
    var eiendomspunkterMedOmsetning = [];

    //Start "geoJson"-motoren til Leaflet. Den tar inn et JSON-objekt i en variabel. Denne har vi definert i JSON-filen i index.html
    var eiendommer = L.geoJson(eiendompktGeoJSON, {
        onEachFeature: visPopup,//vi refererer til funksjonen vi skal kalle. Husk at funksjonen også er et objekt
        pointToLayer: function(feature, latlng) {
            //legg til et punkt i punktlisten. Punktet er en liste med "lat, lng"
            eiendomspunkter.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
            eiendomspunkterMedOmsetning.push([
                feature.geometry.coordinates[1], 
                feature.geometry.coordinates[0], 
                feature.properties.omsetningsbelop
            ]);
            //endre stilen for dette objektet
            if(feature.properties.omsetningsbelop <= 1000000) {
                geojsonMarkerOptions.fillColor = "#00ff00";
            } else if (feature.properties.omsetningsbelop > 1000000 && feature.properties.omsetningsbelop <= 5000000) {
                geojsonMarkerOptions.fillColor = "#ff0000";
            } else {
                //default
                geojsonMarkerOptions.fillColor = "#0000ff";
            }
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });

    //legg til eiendomspunktene til "layer control"
    map.LayerControl.addOverlay(eiendommer, "Eiendommer (p)");

    //Start "geoJson"-motoren til Leaflet. Den tar inn et JSON-objekt i en variabel. Denne har vi definert i JSON-filen i index.html
    var eiendommerPolygon = L.geoJson(eiendompolygonGeoJSON, {
        onEachFeature: function(feature, latlng) {
            visPopup(feature,latlng);
        },
        style: function(feature) {
            var flateStyle = {
                fillColor: "#0000ff",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5
            };
            if(feature.properties.omsetningsbelop <= 1000000) {
                flateStyle.fillColor = "#00ff00";
            } else if (feature.properties.omsetningsbelop > 1000000 && feature.properties.omsetningsbelop <= 5000000) {                
                flateStyle.fillColor = "#ff0000";
            } else {
                flateStyle.fillColor = "#0000ff";
            }
            return flateStyle;            
        }
    }).addTo(map);

    //legg til eiendomspunktene til "layer control"
    map.LayerControl.addOverlay(eiendommerPolygon, "Eiendommer (f)");    

/** Mer avanserte visualiseringer av datasettene */

    //start opp heatmap-motoren - vi bruker punktlisten vi lagde ovenfor og setter parametere
    var heatmapLayer = L.heatLayer(eiendomspunkterMedOmsetning, {
        radius: 60,
        max: 0.8
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
    coverageLayer.setData(eiendomspunkter);
    //legg til maskering som eget lag i layer control
    map.LayerControl.addOverlay(coverageLayer, "Dekning");

    //start clustermotoren
    var clusterMarkers = new L.MarkerClusterGroup();

    //legg til eiendommer-laget til clustermotoren og legg til kartet
    clusterMarkers.addLayer(eiendommer);
    //legg også til som eget lag i layer control
    map.LayerControl.addOverlay(clusterMarkers, "Eiendommer (cluster)");    



});