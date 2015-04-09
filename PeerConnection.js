var localstream;
var localPeerConnection;
var remotePeerConnection;

var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var startButton = document.getElementById("startButton");
var callButton = document.getElementById("callButton");
var hangupButton = document.getElementById("hangupButton");

startButton.disable = false;
callButton.disable = true;
hangupButton.disable = true;

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

function log(text){
	 console.log("At time: " + (performance.now() / 1000).toFixed(3) + " --> " + text); 
}

/*var constraints(){
	audio:true,
	video:{
		mandatory:{
			maxWidth : 640,
			maxHeight: 360
		}
	}
};*/

function erroCallBack(erro){
	console.log("navigaor.getUserMedia:", error);
}

function sucessCallBack(stream){
	log('Recebido local stream');

	if(window.URL){
		localVideo.src = URL.createObjectURL(stream);
	}
	else{
		localVideo.src = stream;
	}

	localstream = stream;
	//Abilitando botão chamada
	callButton.disable = false;
}

function start() {
	log('Requisitando stream local')
	//Desabilitando botão start
	startButton = true;
	//Preparando-se para lidar com diferentes navegadores
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	//Agora, usando getUserMedia()
	//navigator.getUserMedia(constraints, sucessCallBack, erroCallBack);
	navigator.getUserMedia({audio:false, video:true}, sucessCallBack, erroCallBack);
}
//Função associada com o click do butão CALL
function call () {
	//Primeiro desabilitando botão CALL
	callButton.disable = true;
	//... abilitando botão hangup
	hangupButton.disable = false;
	log('Stating call');

	//Note que o getVideoTracks() e getAudioTracks() não são atualmente suportadas no FireFox
	// apenas no Chrome
	if(navigator.webkitGetUserMedia){ //Chrome
		//Informação no log sobre o dispositivo video e audio.
		if(localstream.getVideoTracks().length > 0){
			log('Usando dispositivo de video: ' + localstream.getVideoTracks()[0].label);
		}
		if(localstream.getAudioTracks().length > 0){
			log('Usando dispositivo de audio: ' + localstream.getAudioTracks()[0].label);
		}

		RTCPeerConnection = webkitRTCPeerConnection;
	}
	//FireFox
	else if (navigator.mozGetUserMedia){
		RTCPeerConnection = mozRTCPeerConnection;
		RTCSessionDescription = mozRTCSessionDescription;
		RTCIceCandidate = mozRTCIceCandidate;
	}
	log('RTCPeerConnection: ' + RTCPeerConnection);
	
	//Isto é uma configuração opicional, associada com a NAT traversal instalação
	var servers = null;
	
	//Criando o objeto PeerConnection local
	localPeerConnection = new RTCPeerConnection(servers);
	//console.log("Criando objeto RTCPeerConnection local");
	log('Criando objeto RTCPeerConnection  local');

	//O manipulador onicecandidate é acionado sempre que um novo candidato é colocado 
	//à disposição do mesmo nível local pela máquina protocolo ICE dentro do browser.
	
	//Adicionar um manipulador associado com o protocolo de eventos ICE
	localPeerConnection.onicecandidate = gotLocalIceCandidate;

	//Criando o objeto PeerConnection remoto
	remotePeerConnection = new RTCPeerConnection(servers);
	log('Criando objeto RTCPeerConnection remoto');

	//Adicionando manipulador associado com o protocolo de eventos ICE
	remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
	//... e um segundo manipulador a ser ativado logo que o fluxo remoto se torna disponivel 
	remotePeerConnection.onaddstream = gotRemoteStream;

	//O onaddstream e manipuladores onremovestream são chamados sempre que um MediaStream 
	//é respectivamente adicionado ou removido pelo peer remoto. Ambos será desencadeado 
	//apenas como um resultado da execução do método SetRemote Descrição ().
	
	//Adicionando o local stream (como retorno getUserMedia()) para o local PeerConnection
	localPeerConnection.addStream(localstream);
	log('Add localStream para o localPeerConnection');

	//Criamos um Offer(Oferta) para ser enviada ao receptor rapidamente 
	//assim que o SDP local estiver pronto
	localPeerConnection.createOffer(gotLocalDescription, onSignalingError);
	log('Criando Oferta');

}

function onSignalingError(error){
	log('Falha para criar sinalização de mensagem : ' + error.name);
}

//Manipulador a ser chamado quando o SDP 'local' torna-se disponivel

function gotLocalDescription(description){
	//Adicionando 	
	localPeerConnection.setRemoteDescription(description);
	log('Oferta do localPeerConnection: \n' + description.sdp);
	//Defina a descrição remota como a descrição local do PeerConnection remoto
	remotePeerConnection.setRemoteDescription(description);
	log('Resposta do remotePeerConnection: \n' + description.sdp); 
	//Por outro lado, definir a descrição remota como a descrição remoto do PeerConnection locais
	localPeerConnection.setRemoteDescription(description); 
	//remotePeerConnection.createAnswer(gotRemoteDescription);
}

function gotRemoteDescription(description) {
  remotePeerConnection.setLocalDescription(description);
  log('Answer from remotePeerConnection: \n' + description.sdp);
  localPeerConnection.setRemoteDescription(description);
}

function hangup(){
	log('Ending call');
	// Close PeerConnection(s) 
	localPeerConnection.close();
	remotePeerConnection.close();
	// Reset local variables
	localPeerConnection = null;
	remotePeerConnection = null;
	// Disable Hangup button
	hangupButton.disabled = true;
	// Enable Call button to allow for new calls to be established
	callButton.disabled = false;
}

//Manipulador de ser chamado assim que o fluxo de controle remoto torna-se disponível
function gotRemoteStream(event){
	// Associe o elemento de vídeo remoto com o fluxo recuperado
	if(window.URL){
		//Chrome
		remoteVideo.src = window.URL.createObjectURL(event.stream);
	}
	else{
		//FireFox
		remoteVideo.src = event.stream;
	}
	log('Recebido stream remoto');
}
// Manipulador a ser chamado sempre que um novo candidato ICE local torna-se disponível
function gotLocalIceCandidate(event){
	if(event.candidate){
		//Adicinando candidato para a remota PeerConnection
		//O método addIceCandidate () fornece um candidato remoto para o Agente ICE. 
		//Além de ser incluída na descrição remoto,as verificações de conectividade 
		//será enviado para os novos candidatos, desde que a restrição IceTransports não está definido como "nenhum".
		remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
		log('Local candidato ICE: \n' + event.candidate.candidate);
	}
}
//// Manipulador a ser chamado sempre que um novo candidato ICE remoto torna-se disponível
function gotRemoteIceCandidate(event){
	if(event.candidate){
		//Adicinando candidato para a remota PeerConnection
		remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
		log('Remoto candidato ICE: \n' + event.candidate.candidate);
	}
}

