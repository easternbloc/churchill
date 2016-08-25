var churchill = require('./index.js');

var sinon = require('sinon'),
    chai = require('chai'),
    should = chai.should(),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('Churchill', function(){

    var req, res, next;

    beforeEach(function () {
        req = {
            method: 'GET',
            originalUrl: 'http://imaurl.com/myroute?queryParam=queryParamValue&queryParam2=queryParamValue2',
            query: {
                queryParam: 'queryParamValue',
                queryParam2: 'queryParamValue2'
            }
        };
        res = {
            statusCode: 200,
            end: sinon.stub(),
            get: sinon.stub().returns('100')
        };
        next = sinon.stub();
    });

    it('logs request', function () {

        var logSpy = sinon.spy();

        churchill.add({
            log: logSpy
        })(req, res, next);

        res.end();

        var responseTime = logSpy.lastCall.args[1].response_time;

        logSpy.should.have.been.calledWith('info', {
            method: 'GET',
            status: 200,
            response_time: responseTime,
            url: 'http://imaurl.com/myroute?queryParam=queryParamValue&queryParam2=queryParamValue2',
            content_length: '100'
        });

    });

    it('logs request without the get params if configured to do so', function () {

        var logSpy = sinon.spy();

        churchill.options.logGetParams = false;
        churchill.add({
            log: logSpy
        })(req, res, next);

        res.end();

        var responseTime = logSpy.lastCall.args[1].response_time;

        logSpy.should.have.been.calledWith('info', {
            method: 'GET',
            status: 200,
            response_time: responseTime,
            url: 'http://imaurl.com/myroute',
            content_length: '100'
        });

    });

    describe('when the the url is not complete', function () {

      beforeEach(function () {
        req.originalUrl = '/myroute?queryParam=queryParamValue&queryParam2=queryParamValue2';
      });

      it('logs request without the get params if configured to do so', function () {

          var logSpy = sinon.spy();

          churchill.options.logGetParams = false;
          churchill.add({
              log: logSpy
          })(req, res, next);

          res.end();

          var responseTime = logSpy.lastCall.args[1].response_time;

          logSpy.should.have.been.calledWith('info', {
              method: 'GET',
              status: 200,
              response_time: responseTime,
              url: '/myroute',
              content_length: '100'
          });

      });

    });

});
