'use strict';

var random = require('random-string');

var options = {
    logGetParams: true,
    reqLogger: true
};

var fn, loggers = [];
var url = require('url'),
    formatter = function () {},
    add = function (logger, level) {
        loggers.push([logger, level]);
        return fn;
    },
    format = function (func) {
        var _formatter = formatter;
        formatter = function (obj, req, res) {
            _formatter(obj, req, res);
            func(obj, req, res);
        };
        return fn;
    },
    log = function () {
        var args = arguments;
        loggers.forEach(logger => logger[0].log.apply(logger[0], args));
    },
    Churchill;

fn = function (req, res, next) {

    req._loggerToken = random();

    var urlToLog;
    if (Churchill.options.logGetParams) {
        urlToLog = req.originalUrl;
    } else {
        var oUrl = url.parse(req.originalUrl);
        urlToLog = oUrl.pathname;

        if (oUrl.host) {
          if (oUrl.port) {
            urlToLog = ':' + oUrl.port + urlToLog;
          }

          urlToLog = oUrl.host + urlToLog;

          if (oUrl.protocol) {
            urlToLog = oUrl.protocol + '//' + urlToLog;
          }
        }
    }
    var requestEnd = res.end,
        requestToLog = {
            status: null,
            method: req.method,
            url: urlToLog,
            id: req._loggerToken
        };

    //if we're using a connect middleware logger this will already exist
    req._startTime = req._startTime || new Date();

    // Use the end function
    res.end = function (chunk, encoding) {
        res.end = requestEnd;
        res.end(chunk, encoding);

        requestToLog.status = res.statusCode;
        requestToLog.response_time = (new Date() - req._startTime);
        if (res.get('Content-Length')) {
            requestToLog.content_length = res.get('Content-Length');
        }

        formatter(requestToLog, req, res);

        loggers.forEach(function (arr) {
            var logger = arr[0],
                level = arr[1];
            level = level || 'info';
            logger.log(level, requestToLog);
        });
    };

    if (Churchill.options.reqLogger) {
        req.log = function () {
            var args = [].concat(arguments).concat([{ id: req._loggerToken }]);
            log.apply(null, args);
        }
        if (loggers.length && req.logger === undefined) {
            req.logger = loggers[0][0];
        }
    }

    next();
};

fn.add = add;
fn.format = format;

Churchill = function (logger, level) {
    add(logger, level);
    return fn;
};

Churchill.add = add;
Churchill.format = format;
Churchill.options = options;

module.exports = Churchill;
