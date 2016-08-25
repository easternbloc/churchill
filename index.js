var options = {
    logGetParams: true
};

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
    loggers = [],
    fn,
    Churchill;

fn = function (req, res, next) {
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
            url: urlToLog
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
