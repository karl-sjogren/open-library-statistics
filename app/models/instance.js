import DS from 'ember-data';

export default DS.Model.extend({
    clientKey: DS.attr('string'),
    name: DS.attr('string'),
    latitude: DS.attr('number'),
    longitude: DS.attr('number')
});