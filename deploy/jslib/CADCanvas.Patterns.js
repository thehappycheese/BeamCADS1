///~ jslib/CADCanvas.js

CanvasPatterns = (function(){
	var exports = {};

	var slash2 = document.createElement("canvas");
	var slash2c = slash2.getContext('2d');
	slash2.width = slash2.height = 8;
	//slash2c.fillStyle = "white";
	//slash2c.fillRect(0,0,slash2.width,slash2.height);
	slash2c.sharpLine(0,0,slash2.width,slash2.height,0,0,0,255);

	document.body.appendChild(slash2);

	exports.slash2 = slash2;

	return exports;

})();