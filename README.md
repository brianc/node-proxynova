# proxynova

Read & parse list of free http proxies from http://proxynova.com

## api

### require('proxynova')([country], [country], callback);

Fetch & parse list of free proxies, optionally filtered by country codes.  __callback__ is called with an array of proxy ip-address & port comobos


## example

```js
var proxynova = require('proxynova');

//first 100 proxies
proxynova(function(err, proxies) {
  console.log(proxies[0]); //68.71.76.242:8082
});

//first 100 in US or France
proxynova('us', 'fr', function(err, proxies) {
  //...
});
```

## license

MIT
