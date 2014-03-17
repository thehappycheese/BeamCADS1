///~ jslib/CADCanvas.js

CanvasPatterns = (function(){
	var exports = {};

	var slash2 = document.createElement("canvas");
	var slash2c = slash2.getContext('2d');
	var dim = 5;
	slash2.width = slash2.height = dim*2;
	//slash2c.fillStyle = "white";
	//slash2c.fillRect(0,0,slash2.width,slash2.height);
	//slash2c.sharpLine(0,0,slash2.width,slash2.height,0,0,0,255);
	slash2c.beginPath();
	slash2c.lineWidth = 1.1;
	var exten = 50;
	slash2c.moveTo(-exten-dim,-exten);
	slash2c.lineTo(slash2.width-dim+exten,slash2.height+exten);

	slash2c.moveTo(-exten+dim,-exten);
	slash2c.lineTo(slash2.width+dim+exten,slash2.height+exten);

	slash2c.stroke();

	document.body.appendChild(slash2);

	exports.slash2 = slash2;

	return exports;

})();