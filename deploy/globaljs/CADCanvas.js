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