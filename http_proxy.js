/**
 * Created by lishangmin on 2016/11/10.
 */

var http = require("http");
var httpProxy = require("http-proxy");
var net = require("net");
var url = require("url");
var util = require('util');
var clrs = require('colors');
var https = require('https');

var conf = require('./conf/config.js')

var fs = require('fs');
var path = require('path');
var fixturesDir = path.join(__dirname, 'cert');
var httpsOpts = {
    key: fs.readFileSync(path.join(fixturesDir, 'agent2-key.pem'), 'utf8'),
    cert: fs.readFileSync(path.join(fixturesDir, 'agent2-cert.pem'), 'utf8')
};


var proxy = httpProxy.createServer();

var server = http.createServer(function (req, res) {
    util.log('http : ' + req.url);
    proxy.web(req, res, {target: req.url, secure: false});
});

process.on('uncaughtException', function (err) {
    util.error(err.stack);
});

server.listen(conf.port);

server.on("connect",function (req, socket) {
    util.log('https : '.red + req.url);
    var serverUrl = url.parse('https://' + req.url);
    var srvSocket = net.connect(serverUrl.port, serverUrl.hostname, function () {
        socket.write('HTTP/1.1 200 Connection Established\r\n' +
            'Proxy-agent: Node-Proxy\r\n' +
            '\r\n');
        srvSocket.pipe(socket);
        socket.pipe(srvSocket);
    });
});

server.on('request',function (req,res) {
    console.log("-------------------------------------------------------");
    console.log(req);
    console.log("-------------------------------------------------------")
});









