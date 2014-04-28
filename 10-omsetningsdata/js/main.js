//vi gjør "map" tilgjengelig i console
var map;

$(document).ready(function() {
    //starter kartmotoren og putter det i div med id="map"
    map = new WebatlasMap('map', {customer: 'NXTMedia_hackathon'});


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
    var boligpunkterMedOmsetning = [];

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

            //legg kun til boligomsetninger for bruk i eget heatmap
            if(feature.properties.anv_av_grunn === "B") {
                boligpunkterMedOmsetning.push([
                    feature.geometry.coordinates[1], 
                    feature.geometry.coordinates[0], 
                    feature.properties.omsetningsbelop
                ]);
            }

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
    var grunnkretsPolygon = L.geoJson(grunnkretsmedomsetningGeojson, {
        onEachFeature: function(feature, latlng) {
            visPopup(feature,latlng);
        },
        style: function(feature) {
            var flateStyle = {
                fillColor: "#ffffff",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            /**
            * OBS! Ikke den "riktige" måten å gjøre det på. Koropletkart (fargekart) må egentlig fargelegges relativt til areal (per km2 og lignende).
            * Visualisering kan bli feil, siden store arealer med lyse farger kan være mer fremtredende enn små arealer med sterke farger.
            */
            var colors = ['rgb(255,255,212)','rgb(254,217,142)','rgb(254,153,41)','rgb(217,95,14)','rgb(153,52,4)'];
            if(feature.properties.totalomsetningsbelop <= 5510000) {
                flateStyle.fillColor = colors[0];
            } else if (feature.properties.totalomsetningsbelop > 5510000 && feature.properties.totalomsetningsbelop <= 13800000) {                
                flateStyle.fillColor = colors[1];
            } else if (feature.properties.totalomsetningsbelop > 13800000 && feature.properties.totalomsetningsbelop <= 22670000) {
                flateStyle.fillColor = colors[2];
            } else if (feature.properties.totalomsetningsbelop > 22670000 && feature.properties.totalomsetningsbelop <= 43170000) {                
                flateStyle.fillColor = colors[3];
            } else if (feature.properties.totalomsetningsbelop > 43170000 && feature.properties.totalomsetningsbelop <= 21474836247) {                
                flateStyle.fillColor = colors[4];
            } else {
                flateStyle.fillColor = "#ffffff";
                //weight: 0;
                //fillOpacity: 0;
                //opacity: 0;
            }
            return flateStyle;   
        }
    }).addTo(map);
    //legg til eiendomspunktene til "layer control"
    map.LayerControl.addOverlay(grunnkretsPolygon, "Grunnkrets (f)");

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
        },
        /**
        * Filtrerer vekk alt unntatt boligomsetninger
        */
        filter: function(feature, layer) {
            if(feature.properties.anv_av_grunn === "B") {
                return true;
            } else {
                return false;
            }
        }
    }).addTo(map);
    //legg til eiendomspunktene til "layer control"
    map.LayerControl.addOverlay(eiendommerPolygon, "boligomsetninger (f)");

/** Mer avanserte visualiseringer av datasettene */

    //start opp heatmap-motoren - vi bruker punktlisten vi lagde ovenfor og setter parametere
    var heatmapLayer = L.heatLayer(eiendomspunkterMedOmsetning, {
        radius: 60,
        max: 0.8
    });
    //Legg til heatmap til layer control
    map.LayerControl.addOverlay(heatmapLayer, "Heatmap");

    //heatmap for kun boligomsetninger
    var heatmapLayer = L.heatLayer(boligpunkterMedOmsetning, {
        radius: 50,
        max: 0.5
    });
    //Legg til heatmap til layer control
    map.LayerControl.addOverlay(heatmapLayer, "Heatmap kun bolig");

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