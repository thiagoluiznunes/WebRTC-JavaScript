
//Get <div> placholder element from DOM
div = document.getElementById('scratchPad');
//Connect to server
var socket = io.connect('http://localhost:8181');

channel = prompt("Enter sgnaling channel name: ");

if(channel !== ""){
	console.log('Tentando criar ou executar canal: ', channel);
	socket.emit('criando ou executando', channel)	;
}

//Manipulador 'criando' mensagem
socket.on('criacão', function (channel){
	console.log('channel' + channel + 'foi criado!');
	console.log('Este ponto é o iniciado...');

	//Modificação dinamica na pagina HTML5
	div.insertAdjacentHTML('beforeEnd', '<p>Time: '+(performance.now()/1000).toFixed(3)+' --> Channel'
		+channel+ 'foi criado! </p>');

	div.insertAdjacentHTML('beforeEnd', '<p>Time: '+(performance.now()/1000).toFixed(3)+' --> Channel'
		+channel+ 'Este ponto é o iniciador! </p>');
});
