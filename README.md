# proxynova


[![Build Status](https://secure.travis-ci.org/brianc/node-proxynova.png)](http://travis-ci.org/brianc/node-proxynova)

Retreive a list of free http proxy servers from http://www.proxynova.com because sometimes [it comes in handy](https://github.com/brianc/node-hacker-news-parser)

## api

### require('proxynova')([array of countries], [maximum latency], callback);

Retreive a list of free http proxies from http://www.proxynova.com.

Provide `[array of countries]` such as `['fr', 'us']` to filter by specific countries.

Provide `[maximum latency]` as a number to filter the list only to proxies which can retreive `https://google.com` within `[maximum latency]` milliseconds.

The `callback` is mandatory and accepts two arguments: `(error, [proxies])` where `[proxies]` is an array of strings.  See example.

## example

```js
var proxynova = require('proxynova');

//first 100 proxies
proxynova(function(err, proxies) {
  console.log(proxies[0]); //"68.71.76.242:8082"
});

//proxies in US or France which respond within 1 second
proxynova(['us', 'fr'], 1000, function(err, proxies) {
  //...
});
```

## notes

I am not affiliated with proxynova in any way.

Proxynova has a 100 request per day limit on their API.  This limit is enforced against this library, so you can only use this library 100 times per day per ip address.
I suggest you cache responses for 15 minutes or so, especially if you filter by maximum latency as this is a non-trivial filtering (requests google.com for each proxy) 

## license

MIT
