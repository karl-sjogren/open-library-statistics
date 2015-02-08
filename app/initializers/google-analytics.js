import Ember from 'ember';
import { RouterMixin, EventTrackingMixin } from 'statistics/mixins/google-analytics';

export default {
  name: 'google-analytics',
  initialize: function(container) {
    // Code for the new Universal Analytics tracking
    /* jshint ignore:start */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    /* jshint ignore:end */
    
    window.ga('create', 'UA-76426-27', 'auto', {
      'cookieDomain': 'none'
    });
    
    var oldOnError = window.onerror;
    window.onerror = function(errorMsg, url, lineNumber) {
      if(!!oldOnError) {
        oldOnError(errorMsg, url, lineNumber);
      }
      window.ga('send', 'exception', {
        'exDescription': errorMsg,
        'exFatal': false,
        'appName': 'Open Access Statistics',
        'appVersion': '0.1'
      });
      
      return false;
    };
    
    Ember.Router.reopen(RouterMixin);
    Ember.Controller.reopen(EventTrackingMixin);
    Ember.ArrayController.reopen(EventTrackingMixin);
    Ember.ObjectController.reopen(EventTrackingMixin);
    Ember.Route.reopen(EventTrackingMixin);
    
    var router = container.lookup('router:main');
    router.on('didTransition', function() {
      this.trackPageView(this.get('url'));
    });
  }
};