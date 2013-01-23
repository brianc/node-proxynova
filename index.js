var http = require('http');
var request = require('request');
var async = require('async');

var parse = function(text) {
  return text.split('\n').map(function(x) {
    return x.trim()
  }).filter(function(x) {
    return /^\d/.test(x)
  });
};

var proxynova = function(countries, timeout, cb) {
  //overloading...
  if(typeof countries == 'function') {
    cb = countries;
    countries = null;
    timeout = null;
  } else if(typeof countries == 'number') {
    cb = timeout;
    timeout = countries;
    countries = null;
  } else if(typeof countries == 'string') {
    countries = [countries];
  }
  if(typeof timeout == 'function') {
    cb = timeout;
    timeout = null;
  }

  var options = {
    host: 'www.proxynova.com',
    path: '/proxy_list.txt'
  };

  if(countries) {
    options.path += "?country=" + countries.join(',');
  }

  var req = http.get(options, function(res) {
    res.setEncoding('utf8');
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.once('end', function() {
      var proxies = parse(data);
      proxynova.filter(timeout, proxies, cb);
    });
    res.once('error', cb);
  }).once('error', cb);
};


//filters proxies which respond under a certain timeout
proxynova.filter = function(timeout, proxies, cb) {
  if(!timeout) return cb(null, proxies);
  var test = function(proxy, cb) {
    var options = {
      url: 'http://google.com',
      proxy: 'http://' + proxy,
      timeout: timeout
    };
    request.get(options, function(err) {
      return cb(!err);
    })
  };
  async.filter(proxies, test, function(proxies) {
    return cb(null, proxies);
  });
};


module.exports = proxynova;
