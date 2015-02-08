/* global module, require, process, console, Buffer */
/* jshint indent:2 */

module.exports = function basicAuth(realm) {
  realm = realm || 'Authorization Required';

  function unauthorized(res) {
    res.writeHead(401, {'WWW-Authenticate': 'Basic realm=\"' + realm + '\"'});
    res.end();
  }
  
  function callback(user, password) {
    return user === process.env.AUTH_USER && password == process.env.AUTH_PASSWORD;
  }

  return function(req, res, next) {
    // Disable auth for /statistics/ (we use client keys there instead)
    if(req.path.indexOf('/statistics/') === 0) {
      return next(); 
    }
    
    var authorization = req.headers.authorization;

    if (!authorization) {
      return unauthorized(res);
    }

    var parts = authorization.split(' ');
    var scheme = parts[0];

    var credentials = new Buffer(parts[1], 'base64').toString('ascii').split(':');

    if (scheme !== 'Basic') {
      res.send(400, 'Invalid authentication scheme');
      res.end();
    }

    if (callback(credentials[0], credentials[1]) === true) {
      req.headers.remote_user = credentials[0];
      next();
    } else {
      unauthorized(res);
    }
  };
};