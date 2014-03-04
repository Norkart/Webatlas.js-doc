/**
* RASK DEMONSTRASJON PÅ HVORDAN LEGGE MARKØRER I FORSKJELLIGE LAG BASERT PÅ 
* VERDIER I HVER FEATURE FRA GEOJSON
* MERK: IKKE OPTIMAL LØSNING, MEN FUNGERENDE OG ENKEL FOR OPPLÆRING
*/
//vi gjør "map" tilgjengelig i console
var map;

$(document).ready(function() {
    //starter kartmotoren og putter det i div med id="map"
    map = new WebatlasMap('map');

    //endrer senterpunkt til koordinatene og setter zoomnivå til 9
    map.setView(new L.LatLng(64.0107043, 11.4901134), 9)

    
    //Sett opp default stil til de nye sirkelmarkørene
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //definer en funksjon som vi skal kalle for hver feature som leses i L.geoJson()
    function visPopup(feature, layer) {
        
        //midlertidig variabel for å bygge strengen til popup'en
        var string = "";
        //looper igjennom alle _egenskapene_ til JSON-objektet
        for (var k in feature.properties) {
            //bygger strengen basert på egenskapsnavnet (k) og verdien til egenskapen feature.properties[k]
            string += k + " : " + feature.properties[k] + "<br>"
        }
        /*
        MERK dette gjelder "eiendommer"-laget
        */
        //knytter en popup til hver feature med strengen vi nettopp bygde
        layer.bindPopup(string);
        
        /*
        LAGER NYE LAG OG LEGGER TIL EGNE LAYERGROUPS BASERT PÅ ATTRIBUTTER I HVER FEATURE
        */
        console.log(feature);
        console.log(feature.properties);
        console.log(feature.properties.OBJTYPE);

        var circleMarker;
        var latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);

        if(feature.properties.OBJTYPE === "Bolig") {
            //endre på stilen - merk denne må resettes etterpå.
            geojsonMarkerOptions.fillColor = "#00ff00";
            //lag ny sirkelmarkør
            circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
            //bind en popup til markøren
            circleMarker.bindPopup(string);
            //legg til boligLayer-laget
            boligLayer.addLayer(circleMarker);
        } else if (feature.properties.OBJTYPE === "Landbruk") {
            geojsonMarkerOptions.fillColor = "#ff0000";
            circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
            
            circleMarker.bindPopup(string);

            landbrukLayer.addLayer(circleMarker);
        } else {
            //default, don't change the styling
        }
        //reset default value
        geojsonMarkerOptions.fillColor = "#ff7800";
    };

    var boligLayer = new L.LayerGroup().addTo(map);
    map.LayerControl.addOverlay(boligLayer, "Bolig");

    var landbrukLayer = new L.LayerGroup().addTo(map);
    map.LayerControl.addOverlay(landbrukLayer, "Landbruk");

    //Start "geoJson"-motoren til Leaflet. Den tar inn et JSON-objekt i en variabel. Denne har vi definert i JSON-filen i index.html
    var eiendommer = L.geoJson(eiendomGeoJSON, {
        onEachFeature: visPopup,//vi refererer til funksjonen vi skal kalle. Husk at funksjonen også er et objekt
        pointToLayer: function(feature, latlng) {
            circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
            //add to "eiendommer" layer. 
            return circleMarker;
        }
    });

    //legg til eiendomspunktene til "layer control"
    map.LayerControl.addOverlay(eiendommer, "Eiendommer (p)");

});