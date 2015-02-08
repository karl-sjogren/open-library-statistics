/* global moment */
import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value, options) {
  return moment(value).format(options.hash.format || 'HH:mm:ss');
});