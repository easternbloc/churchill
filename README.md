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
```js
var churchill = require('churchill');
app.use(require('churchill')(winston));
```

Specify a log level
```js
app.use(require('churchill')(winston, 'express'));
```

Using multiple loggers
```
var logger = new (winston.Logger).....
app.use(require('churchill').add(logger, 'express').add(logger, 'someOtherLogLevel'));
```

```req.logger```
The first logger will be automatically added to req.logger
This then gives you the facility to use the logger from req like so:
```js
req.logger.log('something in winston');
req.logger.error('Oh noe!');
```

```req.log```
Churchill will also add a `log` method to the request object, which will log to all mounted loggers:
```js
req.log('info', 'something in winston');
req.log('error', 'OH NO!');
```

To disable this set reqLogger to false in the options.

Formatting
```js
var logger = new (winston.Logger).....
app.use(require('churchill').add(logger, 'express').format(function (obj, req, res) {
  obj.somethingInteresting = req.params.moreData;
}));
```

Suppressing GET params from logs
```js
var churchill = require('churchill')
churchill.options.logGetParams = false
```

Output
------
In it's simplest form a console output looks like this:
```
info:  status=200, method=GET, url=/, response_time=4
info:  status=304, method=GET, url=/, response_time=1
info:  status=304, method=GET, url=/, response_time=0
```

Examples
--------
To run the examples go into the example dir and ```npm install``` then just ```node simple``` or ```node multiple``` to see them in action.