
//Get <div> placholder element from DOM
div = document.getElementById('scratchPad');
//Connect to server
var socket = io.connect('http://localhost:8181');

channel = prompt("Enter sgnaling channel name: ");
