import Ember from "ember";

function htmlEncode(value){
  return Ember.$('<div/>').text(value).html();
}

export default Ember.Handlebars.makeBoundHelper(function(value, options) {
  return new Ember.Handlebars.SafeString('<span title="' + htmlEncode(value) + '">' + (value.length > options.hash.maxLength ? value.substr(0, options.hash.maxLength - 1) + '&hellip;' : value) + '</span>');
});