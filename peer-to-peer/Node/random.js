/*var http = require("http");
var url = require("url");

console.log("Server on-line");
http.createServer(function(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	var params = url.parse(request.url, true).query;
    var input = param.number;

    var numInput = new Number(input);
    var numOutput = new Number(Math.random() * numInput).toFixed(0);

    response.write(numOutput);
    response.end();

}).listen(8080);

console.log("Random Number Generator Running...");*/

var http = require('http');

http.createServer(function(req, res){
	res.end("hello word");
}).listen(10000);
console.log("ouvindo em http://localhost:10000");