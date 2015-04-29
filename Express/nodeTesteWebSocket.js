var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function (requisicao, resposta){
	console.log('Conectado!');
	var path = url.parse(requisicao.url).pathname;

	switch(path){
		case '/':
			resposta.writeHead(200, {'Content-Type': 'text/html'});
			resposta.write('hello word');
			break;
		case 'socket.html':
			fs.readFile(__dirname + path, function(error, data){
				if(error){
					resposta.writeHead(404);
					resposta.write("operação não existe - 404");
				}
				else{
					resposta.writeHead(200, {"Content-Type": "text/html"});
					resposta.write(data, "utf8");
				}
			});
		default: 
			resposta.writeHead(404);
			resposta.write("operação não existe - 404");
			break;
	}
});

server.listen(8001);

