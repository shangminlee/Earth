/**
 * Created by lishangmin on 2016/11/10.
 */
var http = require('http');
var url  = require('url');
var port = 8899;

var proxy = http.createServer(function (req, res) {
    var url_obj = url.parse(req.url,true);
    console.log(req.url);
    var options = {
        host : url_obj.hostname,
        port : url_obj.port || 80,
        path : url_obj.path,
        method : req.method,
        headers : req.headers
    };
    var creq = http.request(options,function (cres) {
        res.writeHead(cres.statusCode,cres.headers);
        cres.pipe(res);
    }).on('error', function(e) {
        res.end();
    });
    req.pipe(creq);
});

proxy.listen(port);

console.log("server start at "+ port);
