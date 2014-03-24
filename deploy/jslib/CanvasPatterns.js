///~ jslib/CADCanvas.js

CanvasPatterns = (function(){
	var exports = {};

	var fs_can	= document.createElement("canvas");
	var fs_ctx = fs_can.getContext('2d');
	var dim 	= 8;
	fs_can.width = fs_can.height = dim*2;
	//fs_ctx.fillStyle = "white";
	//fs_ctx.fillRect(0,0,fs_can.width,fs_can.height);
	fs_ctx.beginPath();
	fs_ctx.lineWidth = 1;
	var exten = 50;
	fs_ctx.moveTo(-exten-dim,-exten);
	fs_ctx.lineTo(fs_can.width-dim+exten,fs_can.height+exten);

	fs_ctx.moveTo(-exten+dim,-exten);
	fs_ctx.lineTo(fs_can.width+dim+exten,fs_can.height+exten);

	fs_ctx.stroke();



	// TODO: convert this next snippet into a backslash.

	var bs_can	= document.createElement("canvas");
	var bs_ctx = bs_can.getContext('2d');
	var dim 	= 5;
	bs_can.width = bs_can.height = dim*2;
	//bs_ctx.fillStyle = "white";
	//bs_ctx.fillRect(0,0,bs_can.width,bs_can.height);
	bs_ctx.beginPath();
	bs_ctx.lineWidth = 1;
	var exten = 50;
	bs_ctx.moveTo(-exten-dim,-exten);
	bs_ctx.lineTo(bs_can.width-dim+exten,bs_can.height+exten);

	bs_ctx.moveTo(-exten+dim,-exten);
	bs_ctx.lineTo(bs_can.width+dim+exten,bs_can.height+exten);

	bs_ctx.stroke();













	exports.fs_can = fs_can;

	return exports;

})();