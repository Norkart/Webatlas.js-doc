//vi gjør "map" tilgjengelig i console
var map;

$(document).ready(function() {
	//starter kartmotoren og putter det i div med id="map"
    map = new WebatlasMap('map');

    //endrer senterpunkt til koordinatene
    map.setView(new L.LatLng(64.0107043, 11.4901134));

});