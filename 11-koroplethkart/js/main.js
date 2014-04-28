//vi gjør "map" tilgjengelig i console
var map;

$(document).ready(function() {
    //starter kartmotoren og putter det i div med id="map"
    map = new WebatlasMap('map', {customer: 'NXTMedia_hackathon'});

    //endrer senterpunkt til koordinatene og setter zoomnivå til 5
    map.setView(new L.LatLng(63.5107043, 10.4901134), 5)

    
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

    //Start "geoJson"-motoren til Leaflet. Den tar inn et JSON-objekt i en variabel. Denne har vi definert i JSON-filen i index.html
    fylker = L.geoJson(fylkerGeojson, {
        onEachFeature: function(feature, latlng) {
            visPopup(feature,latlng);
        },
        style: function(feature) {
            var colorscale = colorbrewer.RdBu[5];
            var flateStyle = {
                fillColor: colorscale[2],//center of diverging scale
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5
            };

            var variabel = feature.properties.fylkesnr;//kommunenummer. Bør være verdi relativt til areal
            var variabelGrenser = [4,8,12,16,20];//tilfeldig satt

            if(variabel <= variabelGrenser[0]) {
                flateStyle.fillColor = colorscale[4];//reverse color scale
            } else if (variabel > variabelGrenser[0] && variabel <= variabelGrenser[1]) {                
                flateStyle.fillColor = colorscale[3];
            } else if (variabel > variabelGrenser[1] && variabel <= variabelGrenser[2]) {                
                flateStyle.fillColor = colorscale[2];
            } else if (variabel > variabelGrenser[2] && variabel <= variabelGrenser[3]) {                
                flateStyle.fillColor = colorscale[1];
            } else if (variabel > variabelGrenser[3] && variabel <= variabelGrenser[4]) {                
                flateStyle.fillColor = colorscale[0];
            }
            return flateStyle;   
        },
        /**
        * Filtrerer vekk alt unntatt boligomsetninger
        */
        filter: function(feature, layer) {
            return true;
            //not in use
        }
    }).addTo(map);
    //legg til eiendomspunktene til "layer control"
    map.LayerControl.addOverlay(fylker, "fylker");

    //Start "geoJson"-motoren til Leaflet. Den tar inn et JSON-objekt i en variabel. Denne har vi definert i JSON-filen i index.html
    var kommuner = L.geoJson(kommunerGeojson, {
        onEachFeature: function(feature, latlng) {
            visPopup(feature,latlng);
        },
        style: function(feature) {
            var colorscale = colorbrewer.RdBu[5];
            var flateStyle = {
                fillColor: colorscale[2],//center of diverging scale
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5
            };

            var variabel = feature.properties.komm;//kommunenummer. Bør være verdi relativt til areal
            var variabelGrenser = [500,750,1000,1500,2500];//tilfeldig satt

            if(variabel <= variabelGrenser[0]) {
                flateStyle.fillColor = colorscale[4];//reverse color scale
            } else if (variabel > variabelGrenser[0] && variabel <= variabelGrenser[1]) {                
                flateStyle.fillColor = colorscale[3];
            } else if (variabel > variabelGrenser[1] && variabel <= variabelGrenser[2]) {                
                flateStyle.fillColor = colorscale[2];
            } else if (variabel > variabelGrenser[2] && variabel <= variabelGrenser[3]) {                
                flateStyle.fillColor = colorscale[1];
            } else if (variabel > variabelGrenser[3] && variabel <= variabelGrenser[4]) {                
                flateStyle.fillColor = colorscale[0];
            }
            return flateStyle;   
        },
        /**
        * Filtrerer vekk alt unntatt boligomsetninger
        */
        filter: function(feature, layer) {
            return true;
            //not in use
        }
    });
    //legg til eiendomspunktene til "layer control"
    map.LayerControl.addOverlay(kommuner, "kommuner");


    /**
    DEMO: Loop through features in layer after added
    */
    fylker.eachLayer(function(a){
        console.log(a.feature.properties);
        //possible to join with other data sets, or alter features based on external selection etc
        if(a.feature.properties.fylkesnr === 16) {
            a.setStyle({
                fillColor: "green"
            })
            //alert(a.feature.properties.navn);
        }
    })
});