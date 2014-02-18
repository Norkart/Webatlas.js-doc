//vi gjør "map" tilgjengelig i console
var map;

$(document).ready(function() {
    //starter kartmotoren og putter det i div med id="map"
    map = new WebatlasMap('map');

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

});