///* sylvester.src.js
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



////////////////////////////////////////////////////////////////////////////////////////
//		TRACK TRANSFORMATIONS
////////////////////////////////////////////////////////////////////////////////////////
Array.prototype.last = function(){
	return this[this.length-1];
}

function OOP_override(obj, func, newfunc){
	obj["super_"+func] = obj[func];
	obj[func] = newfunc;
}

CanvasRenderingContext2D.prototype.matStack = [slvstr.Matrix.create([[1,0,0], [0,1,0], [0,0,1]])];

OOP_override(CanvasRenderingContext2D.prototype,"save",function(){
	this.matStack.push(this.matStack.last().dup());
	this.super_save();
});

OOP_override(CanvasRenderingContext2D.prototype,"restore",function(){
	this.matStack.pop();
	this.super_restore();
});


OOP_override(CanvasRenderingContext2D.prototype,"translate",function(x,y){
	this.matStack.last().elements[0][2]+=x;
	this.matStack.last().elements[1][2]+=y;
	this.super_translate(x,y);
});
OOP_override(CanvasRenderingContext2D.prototype,"rotate",function(ang){
	var rmat = slvstr.Matrix.create(
		[[ Math.cos(-ang), Math.sin(-ang) , 0 ],
		 [-Math.sin(-ang), Math.cos(-ang) , 0 ],
		 [0				, 0				, 1 ]]
	);

	//console.log("============ ROTATION: before, rmat, after =====================")
	//console.log(this.matStack.last().elements);
	//console.log(rmat.elements);
	//this.matStack.push(this.matStack.pop().x(rmat));
	var res = this.matStack.last().x(rmat);
	this.matStack.last().setElements(res.elements);
	// the above line doesnt have any effect :(
	this.super_rotate(ang);
	//console.log(this.matStack.last().elements);
});
OOP_override(CanvasRenderingContext2D.prototype,"scale",function(factor){
	this.matStack.last().multiply(factor)
	this.super_scale(factor);
	// untested?
});
CanvasRenderingContext2D.prototype.getTransformed = function(v){
	var vec = slvstr.Vector.create([v.x,v.y,1]);
	vec = this.matStack.last().multiply(vec);
	return {x:vec.elements[0],y:vec.elements[1]};
}




////////////////////////////////////////////////////////////////////////////////////////
//		SHARP LINE
////////////////////////////////////////////////////////////////////////////////////////
CanvasRenderingContext2D.prototype.sharpLine = function (aa, bb, cc, dd, r,g,b,a) {

	
	var v1 = this.getTransformed({x:aa,y:bb});
	var v2 = this.getTransformed({x:cc,y:dd});
	
	var x0 = Math.round(v1.x);
	var y0 = Math.round(v1.y);
	var x1 = Math.round(v2.x);
	var y1 = Math.round(v2.y);
	
	var imd = this.getImageData(0,0,this.canvas.width,this.canvas.height);
	var index;
	
	
	var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
	var err = (dx>dy ? dx : -dy)/2;
	//var out = 0;
	while (true) {
		index = 4*x0 + (4*this.canvas.width)*y0;
		imd.data[index+0]	= r;
		imd.data[index+1]	= g;
		imd.data[index+2]	= b;
		imd.data[index+3]	= a;
		//this.setPixel(x0,y0,0,0,0,255);
		
		if (x0 === x1 && y0 === y1) break;
		var e2 = err;
		if (e2 > -dx) { err -= dy; x0 += sx; }
		if (e2 < dy) { err += dx; y0 += sy; }
	}
	//console.log(out);
  this.putImageData(imd,0,0);
}
CanvasRenderingContext2D.prototype.sharpLineV = function(v1,v2,r,g,b,a){
	this.sharpLine(v1.x,v1.y,v2.x,v2.y,r,g,b,a);
}
////////////////////////////////////////////////////////////////////////////////////////
//		SET PIXEL
////////////////////////////////////////////////////////////////////////////////////////
CanvasRenderingContext2D.prototype.setPixel = function (x,y, r,g,b,a) {
	var imd = this.getImageData(0,0,this.canvas.width,this.canvas.height);
	var index = 4*x + (4*this.canvas.width)*y;

	imd.data[index+0]	= r;
	imd.data[index+1]	= g;
	imd.data[index+2]	= b;
	imd.data[index+3]	= a;
	this.putImageData(imd,0,0);
}