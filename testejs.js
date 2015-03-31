
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var contrains = {audio:false, video:true}
var video = document.querySelector("video");

function sucessCallBack(stream){
	window.stream = stream;
	if(window.URL){
		video.src = window.URL.createObjectURL(stream);
	}
	else{
		video.src = stream;
	}
	video.play();
}

function erroCallBack(erroCallBack){
	console.log("navigator.getUserMedia erro: ", erroCallBack);
}

navigator.getUserMedia(contrains, sucessCallBack, erroCallBack);

							