var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});
// proxy.on(function (err, req, res) {
//     res.writeHead(500, {
//         'Content-Type': 'text/plain'
//     });
// });
var server = require('http').createServer(function (req, res) {
    console.log(req.headers)
    var host = req.headers.host;
    switch (host) {
        case 'www.5shishang.com':
        case '5shishang.com':
            proxy.web(req, res, { target: 'http://localhost:8080' });
            break;
        case 'shop.5shishang.com':
            proxy.web(req, res, {
                target: 'http://127.0.0.1:3019'
            });
            break;
        case 'jk.5shishang.com'://jenkins
            proxy.web(req, res, {
                target: 'http://127.0.0.1:8081'
            });
            break;
        default:
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Welcome to my server!');
    }
});
// console.log("listening on port 80");
server.listen(80);
