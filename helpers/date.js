/* global module */

var nextFiveMinute = function(date) {
  var minutes = nextStep(date.getMinutes(), 5);
  date.setMinutes(minutes);
  return date;
};

var nextStep = function(num, step, max) {
  max = max || 1000;
  while(num % step !== 0 && num++ && num < max) { }
  return num;
};

var removeSeconds = function(date) {
  date.setSeconds(0);
  return date;
};

module.exports.nextFiveMinute = nextFiveMinute;
module.exports.removeSeconds = removeSeconds;