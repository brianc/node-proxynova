var assert = require('assert');

var proxynova = require(__dirname + '/../');

describe('integration', function() {
  return;
  it('works', function(done) {
    proxynova(function(err, proxies) {
      assert.equal(err, null);
      assert.ok(proxies.length > 0);
      done();
    });
  });

  describe('timeout', function() {
    it('filters', function(done) {
      this.timeout(5000);
      proxynova(function(err, proxies) {
        proxynova(1000, function(err, fastProxies) {
          assert.ok(fastProxies.length > 0, "should have some fast proxies");
          assert.ok(proxies.length > fastProxies.length, "should have less fast proxies than all proxies");
          done();
        });
      });
    });

    describe('with countries', function() {
      it('filters', function(done) {
        this.timeout(5000);
        proxynova('us', function(err, proxies) {
          proxynova('us', 1000, function(err, fastProxies) {
            assert.ok(fastProxies.length > 0, "should have some fast proxies");
            assert.ok(proxies.length > fastProxies.length, "should have less fast proxies than all proxies");
            done();
          });
        });
      });
    });
  });
});

describe('proxynova', function() {
  var http = require('http');
  var actualGet = http.get;
  before(function() {
    http.get = function(options, callback) {
      this.lastOptions = options;
      var res = new (require('events').EventEmitter)();
      res.setEncoding = function() { };
      callback(res);
      if(http.responseText) {
        res.emit('data', http.responseText);
      }
      res.emit('end');
      http.responseText = '';
      return process.stdin;
    };
  });

  after(function() {
    http.get = actualGet;
  });

  it('calls correct url', function(done) {
    proxynova(function(err, proxies) {
      assert.equal(http.lastOptions.host, 'www.proxynova.com');
      assert.equal(http.lastOptions.path, '/proxy_list.txt');
      assert.equal(proxies.length, 0);
      done();
    });
  });

  it('parses correctly', function(done) {
    http.responseText = require('fs').readFileSync(__dirname + '/example.txt', 'utf8');
    proxynova(function(err, proxies) {
      assert.equal(proxies.length, 21);
      assert.equal(proxies[0], "178.18.17.211:3128");
      assert.equal(proxies[20], "198.154.114.118:8080");
      done();
    });
  });

  it('filters by timeout', function(done) {
    this.timeout(5000);
    var request = require('request');
    var count = 0;
    request.get = function(options, cb) {
      cb(count++ > 10 ? new Error("timeout") : null);
    };
    http.responseText = require('fs').readFileSync(__dirname + '/example.txt', 'utf8');
    proxynova(1000, function(err, proxies) {
      assert.equal(err, null, "error should be null");
      assert.equal(proxies.length, 11);
      done();
    });
  });


  describe('language filter', function() {
    it('appends single country to url', function(done) {
      proxynova('en', function(err, proxies) {
        assert.equal(http.lastOptions.path, '/proxy_list.txt?country=en');
        done();
      });
    });

    it('appends multiple countries to url', function(done) {
      proxynova(['en', 'fr'], function(err, proxies) {
        assert.equal(http.lastOptions.path, '/proxy_list.txt?country=en,fr');
        done();
      });
    });

    it('works with timeout parameter', function(done) {
      proxynova(['en'], 1000, function(err, proxies) {
        assert.equal(http.lastOptions.path, '/proxy_list.txt?country=en');
        done();
      });
    });
  });

});
