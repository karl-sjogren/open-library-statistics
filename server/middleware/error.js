/* global module, require, process, console, Buffer */

module.exports = function(err, req, res, next){
  if (req.xhr) {
    res.send(500, { error: err });
  } else {
    console.log(err);
    next(err);
  }
};