/* global module, require, process */

module.exports = function basicAuth(callback, realm) {
  realm = realm || 'Authorization Required';

  function unauthorized(res) {
    res.writeHead(401, {'WWW-Authenticate': 'Basic realm=\"' + realm + '\"'});
    res.end();
  }

  return function(req, res, next) {
    var authorization = req.headers.authorization;

    if (!authorization) {
      unauthorized(res);
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