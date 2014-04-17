var express   = require('express'),
    winston   = require('winston'),
    app = express();

var logger = new (winston.Logger)({
    transports: [new (winston.transports.Console)({
        json: false,
        timestamp: true,
        colorize: true
    })],
    levels: {
        info: 0,
        express: 1
    },
    exitOnError: true
});

winston.addColors({express: 'blue'});

//multiple loggers
app.use(require('churchill').add(logger, 'express').add({
    log: function (level, requestToLog) {
        //hook for logging to somthing else...graphite etc.
        console.log(level, requestToLog);
    }
}, 'graphite-logger'));

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000);