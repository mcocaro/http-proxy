/**
 * HTTP Proxy with SSL
 * Author: Martin E. Cocaro
 * Email: martin.cocaro@gmail.com
 */

var fs = require('fs');
var https = require('https');
var httpProxy = require('http-proxy');
var url = require('url');

var options = {
        key: fs.readFileSync('./ssl/cert.key'),
        cert: fs.readFileSync('./ssl/cert.crt')
};

var proxy = httpProxy.createProxyServer();

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.removeHeader('x-target-endpoint');
  var targetUrl = url.parse(req.headers['x-target-endpoint'],true,true);
  var hostname = targetUrl.hostname + (targetUrl.port? ':' + targetUrl.port:'');
  proxyReq.setHeader('host',hostname);
});

var server = https.createServer(options,function (req, res) {
        var target = req.headers['x-target-endpoint'];
        if (target) {
                return proxy.web(req, res, { 'target': target });
        }
        res.send('Forbidden', 403);
});

server.listen(8000);

console.info('Proxy listening port 8000');