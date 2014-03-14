///* Vector.js

CanvasRenderingContext2D.prototype.moveToV = function(v){
	this.moveTo(v.x,v.y)
}
CanvasRenderingContext2D.prototype.lineToV = function(v){
	this.lineTo(v.x,v.y)
}
CanvasRenderingContext2D.prototype.arrow = function(from,to,size){
	this.beginPath();
	this.moveTo(from.x,from.y);
	this.lineTo(to.x,to.y);
	this.stroke();
	var ang = Math.atan2(to.y-from.y,to.x-from.x);
	this.save();
		this.translate(to.x,to.y);
		this.rotate(ang-Math.PI/2);
		this.beginPath();
		this.moveTo(-0.3*size,-1*size);
		this.lineTo( 0, 0  );
		this.lineTo( 0.3*size,-1*size);
		this.stroke();
	this.restore();
}
///////////////////////////////////////////////////////////////////
//		Circle drawing Functions
///////////////////////////////////////////////////////////////////
CanvasRenderingContext2D.prototype.circle = function(x,y,radius){
	this.arc(x,y,radius,0,Math.PI*2);
}
CanvasRenderingContext2D.prototype.fillCircle = function(x,y,radius){
	this.beginPath();
	this.circle(x,y,radius);
	this.fill();
}
CanvasRenderingContext2D.prototype.strokeCircle = function (x,y,radius) {
	this.beginPath();
	this.circle(x,y,radius);
	this.stroke();
}

CanvasRenderingContext2D.prototype.fillStrokeCircle = function(x,y,radius){
	this.beginPath();
	this.circle(x,y,radius);
	this.fill();
	this.stroke();
}

CanvasRenderingContext2D.prototype.setPixel = function (x,y,r,g,b,a) {
	var imd = this.getImageData(0,0,this.canvas.width,this.canvas.height);
	var index = 4*x + (4*this.canvas.width)*y;

	imd.data[index+0]	= r;
	imd.data[index+1]	= g;
	imd.data[index+2]	= b;
	imd.data[index+3]	= a;
	console.log(imd)
	this.putImageData(imd,0,0);
}


CanvasRenderingContext2D.sharpLineTo


