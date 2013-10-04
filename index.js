var url = require('url'),
    add = function (logger, level) {
        loggers.push([logger, level]);
        return fn;
    },
    loggers = [],
    fn,
    Churchill;

fn = function (req, res, next) {
    var requestEnd = res.end,
        requestToLog = {
            status: null,
            method: req.method,
            url: req.originalUrl
        };

    //if we're using a connect middleware logger this will already exist
    req._startTime = req._startTime || new Date();

    // Use the end function
    res.end = function (chunk, encoding) {
        res.end = requestEnd;
        res.end(chunk, encoding);

        requestToLog.status = res.statusCode;
        requestToLog.response_time = (new Date() - req._startTime) + 'ms';

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

Churchill = function (logger, level) {
    add(logger, level);
    return fn;
};

Churchill.add = add;

module.exports = Churchill;