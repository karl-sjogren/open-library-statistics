$(function() {
  $('.map-canvas').each(function() {
    var container = $(this);
    var zoom = container.data('maps-zoom');
    var lat = container.data('maps-latitude');
    var lng = container.data('maps-longitude');
    
    var mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: zoom
    };
    var map = new google.maps.Map(container[0], mapOptions);
    
    var centerMarker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: map
    });
    
    container.data('map', map);
  });
});