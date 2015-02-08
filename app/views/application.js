import Ember from 'ember';

export default Ember.View.extend({
  initializeMenu: function() {
    var that = this;
    Ember.run.schedule('afterRender',function(){
      that.$('#side-menu').metisMenu();
    });
  }.on('didInsertElement')
});
