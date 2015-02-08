import Ember from 'ember';

export var RouterMixin = Ember.Mixin.create({
  hasAnalytics: function() {
    return window.ga && typeof window.ga === 'function';
  },
  trackPageView: function(page) {
    if (!this.hasAnalytics()) {
      return;
    }

    if (!page) {
      var loc = window.location;
      page = loc.hash ? loc.hash.substring(1) : loc.pathname + loc.search;
    }

    window.ga('send', 'pageview', {
      'page': page
    });
    
    console.log('Tracking pageview in router: ' + page);
  },

  trackEvent: function(category, action, label, value) {
    if (!this.hasAnalytics()) {
      return;
    }
    
    window.ga('send', 'event', category, action, label, value);
    console.log('Tracking event in router: ' + category + ' ' + action);
  }
});

export var EventTrackingMixin = Ember.Mixin.create({
  hasAnalytics: function() {
    return window.ga && typeof window.ga === 'function';
  },

  trackEvent: function(category, action, label, value) {
    if (!this.hasAnalytics()) {
      return;
    }
    
    window.ga('send', 'event', category, action, label, value);
    console.log('Tracking event: ' + category + ' ' + action);
  }
});