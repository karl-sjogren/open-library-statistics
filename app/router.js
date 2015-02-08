import Ember from 'ember';

var Router = Ember.Router.extend({
  location: StatisticsENV.locationType
});

Router.map(function() {
  
  this.resource('instances', function() {
    this.route('new');
  });
  
  this.resource('instance', function() {
    this.route('edit', { path: ':instance_id' });
  });

  this.route('map-visualization');
  this.route('not-found', {path: '/*wildcard'});
});

export default Router;
