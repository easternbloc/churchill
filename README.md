churchill
===============

A winston express logger called churchill

Installing
----------

```
npm install churchill
```

Running the tests
-----------------

```
npm test
```

Usage
----
```
var churchill = require('churchill');
app.use(require('churchill')(winston));
```

Specify a log level
```
app.use(require('churchill')(winston, 'express'));
```

Using multiple loggers
```
var logger = new (winston.Logger).....
app.use(require('churchill').add(logger, 'express').add(logger, 'someOtherLogLevel'));
```

Formatting
```
var logger = new (winston.Logger).....
app.use(require('churchill').add(logger, 'express').format(function (obj, req, res) {
  obj.somethingInteresting = req.params.moreData;
}));
```
