/* global L */

import Ember from 'ember';

export default Ember.Component.extend({
  map: null,
  
  _initialize: function() {
    var $this = Ember.$('#' + this.get('elementId'));
    $this.height(this.get('height'));
    $this.css({ marginBottom: '20px' });
    
    L.Icon.Default.imagePath = '/assets/leaflet-images/';
    
    var map = L.map(this.get('elementId')).setView([63.154, 16.436], 4);
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/lorddaimos.jgin3ppc/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(map);
    
    L.marker([63.154, 16.436], { title: 'Center of the map!', riseOnHover: true}).addTo(map);
    
    this.set('map', map);
  }.on('didInsertElement'),
  _destroy: function() {
    this.get('map').remove();
  }.on('willDestroyElement')
});