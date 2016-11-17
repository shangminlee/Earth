/**
 * Created by lishangmin on 2016/11/15.
 */

var config = require('./conf/config');
var path = require('path');
var util = require('util');
var Proxy = require('http-mitm-proxy');
var proxy = new Proxy();

proxy.onError(function(ctx, err, errorKind) {
    var url = (ctx && ctx.clientToProxyRequest) ? ctx.clientToProxyRequest.url : '';
    util.error(errorKind + ' on ' + url + ':', err);
});

proxy.onRequest(function(ctx, callback) {
    var options = ctx.proxyToServerRequestOptions;
    var url = options.agent.protocol + "//" + options.host + "" + options.path;
    util.log(url);
    return callback();
});

proxy.listen({port: config.port});
util.log('listening on ' + config.port);

process.on('uncaughtException', function (err) {
    util.error(err.stack);
});