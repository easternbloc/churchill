var url = require('url');

module.exports = function (logger, level) {

    return function (req, res, next) {
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

            level = level || 'info';

            logger.log(level, requestToLog);
        };

        next();
    };
};