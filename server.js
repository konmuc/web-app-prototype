var http = require('http');
var fs = require('fs');
var path = require('path');
var os = require('os');

const port = 8080

function getIpAddress(ipVersion='IPv4') {
    let ifaces = os.networkInterfaces();
    let ips    = Object.keys(ifaces)
        .map(ifname => {
            return ifaces[ifname]
                .filter(iface => iface.family === ipVersion && iface.address !== '127.0.0.1' && iface.address !== '::1' && iface.scopeid != 0)
        })
        .filter(iface => iface.length > 0)
        .reduce((acc, val) => acc.concat(val), [])
        .map(iface => iface.address)

    return ips.length > 0 ? ips[0] : 'localhost'

    // return Object.keys(ifaces)
    //     .map((ifname) => {
    //         var alias = 0;

    //         console.log(ifaces)

    //         return ifaces[ifname]
    //             .map((iface) => {
    //                 if ('IPv4' !== iface.family || iface.internal !== false) {
    //                     // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
    //                     return;
    //                 }

    //                 if (alias >= 1) {
    //                     // this single interface has multiple ipv4 addresses
    //                     return { name: ifname, alias, ip: iface.address }
    //                 } else {
    //                     // this interface has only one ipv4 adress
    //                     return { name: ifname, ip: iface.address }
    //                 }
    //                 ++alias;
    //             })
    //             .filter(ifname => ifname != undefined)
    //     })
    //     .filter(ifname => ifname != undefined)
}

http.createServer(function (request, response) {
    console.log('request starting...\n');

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    // Website you wish to allow to connect
    response.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); /* OPTIONS,*/

    // Request headers you wish to allow
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    response.setHeader('Access-Control-Allow-Credentials', true);

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(port, getIpAddress());

console.log(`Server running at http://[${getIpAddress()}]:${port} ...`);