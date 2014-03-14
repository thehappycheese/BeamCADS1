///~ globaljs/Vector.js
///~ globaljs/CADCanvas.js

var pc = document.createElement("canvas")
document.body.appendChild(pc);
var pctx = pc.getContext('2d');
pc.width = 2;
pc.height = 2;
pctx.setPixel(0,0,0,0,0,255);
pctx.setPixel(1,1,0,0,0,255);

function drawBeam(ctx, b){
	
	
	var maxwidth = ctx.canvas.width*0.6;
	var maxheight = ctx.canvas.height*0.6;
	var minwidth = Math.max(35, ctx.canvas.width*0.2);
	var minheight = Math.max(35, ctx.canvas.height*0.2);
	
	
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	
	var patt = ctx.createPattern(pc, "repeat");
	ctx.translate(Math.floor(ctx.canvas.width/2), Math.floor(ctx.canvas.height/2));
	
		
		
		var scale = Math.min(maxwidth/b.B, maxheight/b.D);
		
		var w = Math.max(scale*b.B, minwidth);
		var h = Math.max(scale*b.D, minheight);
		
		ctx.strokeStyle = "#333333";
		ctx.lineWidth = 2;
		ctx.strokeRect(Math.round(-w/2), Math.round(-h/2), Math.round(w), Math.round(h));
		
		
		
		// TODO: draw cover and steel Layers
		
		
		
		var scaledcover = Math.max(b.cover*scale*2,10);
		var N12D = Math.max(1.5,12*scale);
		var tendonBendRadius = Math.max(2,4*12/2*scale); // AS3600 17.2.3 assuming N12 Bars


		// Breadth
		dim(ctx,-w/2,h/2,w/2,h/2, Math.PI/2, 12,b.B+" mm");
		// Depth
		dim(ctx,-w/2,-h/2,-w/2,h/2, 0, -12,b.D+" mm");
		//Cover
		dim(ctx,w/2,-h/2,w/2,-h/2+scaledcover-N12D/2, 0, 10,b.cover+" mm cover");
		
		
		ctx.lineCap = "round";
		ctx.strokeStyle = patt;
		ctx.lineWidth = N12D;
		drawFitment(ctx,-w/2+scaledcover,-h/2+scaledcover,w-2*scaledcover,h-2*scaledcover,tendonBendRadius*scale);
		ctx.strokeStyle = "white";
		ctx.lineWidth = N12D-2;
		drawFitment(ctx,-w/2+scaledcover,-h/2+scaledcover,w-2*scaledcover,h-2*scaledcover,tendonBendRadius*scale);



		// Draw required reinforcement


		ctx.fillStyle = "black";
		// Draw top two longitudinal reo bars.
		ctx.fillCircle(-w/2+scaledcover+N12D, -h/2+scaledcover+N12D, N12D/2);
		ctx.fillCircle( w/2-scaledcover-N12D, -h/2+scaledcover+N12D, N12D/2);
		
		
		ctx.sharpLine(Math.random()*40,Math.random()*40,Math.random()*40,Math.random()*40);
		
		
	ctx.restore();
	
	
}
function drawFitment(ctx,x,y,w,h,rad){
	ctx.beginPath();
		ctx.moveTo(x+w,y+h-rad);
		ctx.lineTo(x+w,y+rad);
		ctx.arc(x+w-rad,y+h-rad,rad,0,Math.PI/2)
		ctx.moveTo(x+w-rad,y+h);
		ctx.lineTo(x+rad,y+h);
		ctx.arc(x+rad,y+h-rad,rad,Math.PI/2,Math.PI)
		ctx.moveTo(x,y+h-rad);
		ctx.lineTo(x,y+rad);
		ctx.arc(x+rad,y+rad,rad,Math.PI,Math.PI*1.5)
		ctx.moveTo(x+rad,y);
		ctx.lineTo(x+w-rad,y);
	ctx.stroke();
	var fitmentlen = 8;
	ctx.beginPath();
		ctx.moveTo(x+w-rad-rad/Math.SQRT2-fitmentlen,y+rad-rad/Math.SQRT2+fitmentlen)
		//ctx.lineTo(x+w-rad-rad/Math.SQRT2,y+rad-rad/Math.SQRT2)
		ctx.arc(x+w-rad,y+rad, rad, Math.PI*1.5-Math.PI/4, Math.PI*2+Math.PI/4)
		//ctx.moveTo(x+w-rad+rad/Math.SQRT2,y+rad+rad/Math.SQRT2)
		ctx.lineTo(x+w-rad+rad/Math.SQRT2-fitmentlen,y+rad+rad/Math.SQRT2+fitmentlen)
	ctx.stroke();
	
}



function dim(ctx,x1,y1,x2,y2,angle,dist,txt){
	var fontpx = 15;
	ctx.save();
	ctx.font = fontpx+"px serif";
	ctx.textBaseline="middle"
	ctx.textAlign="center"
	
	var metric = ctx.measureText(txt);
	
	
	var v1 = new Vector(x1,y1);
	var v2 = new Vector(x2,y2);
	var offset = (new Vector()).fromAngLen(angle,Math.max(10,Math.abs(dist),metric.width/2*Math.cos(angle)+5)*dist/Math.abs(dist));
	var va = v1.copy().add(offset);
	var dimlen = (new Vector()).fromAngLen(angle+Math.PI/2,1).dot(v2.copy().minus(v1))
	var vb = va.copy().add((new Vector()).fromAngLen(angle+Math.PI/2,1).scalar(dimlen));
	var vt = va.copy().add(vb).scalar(0.5);
	if(va.copy().minus(vb).len<30){
		offset = (new Vector()).fromAngLen(angle, Math.max(10, Math.abs(dist))*dist/Math.abs(dist));
		va = v1.copy().add(offset);
		dimlen = (new Vector()).fromAngLen(angle+Math.PI/2,1).dot(v2.copy().minus(v1))
		vb = va.copy().add((new Vector()).fromAngLen(angle+Math.PI/2,1).scalar(dimlen));
		vt = va.copy().add(vb).scalar(0.5).add(offset.unit().scalar(metric.width/2+5));
	}
	
	
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#555555";
	ctx.fillStyle = "#555555";
	
	// Draw line bodies
	ctx.beginPath();
	var vc = va.copy().minus(v1).unit().scalar(4).add(v1);
	var vd = va.copy().minus(v1).unit().scalar(4).add(va);
	//ctx.moveTo(vc.x,vc.y);
	//ctx.lineTo(vd.x,vd.y);
	ctx.sharpLineV(vc,vd,0,0,0,255);
	
	
	var vc = vb.copy().minus(v2).unit().scalar(4).add(v2);
	var vd = vb.copy().minus(v2).unit().scalar(4).add(vb);
	ctx.moveTo(vc.x,vc.y);
	ctx.lineTo(vd.x,vd.y);
	
	ctx.moveTo(va.x,va.y);
	ctx.lineTo(vb.x,vb.y);
	ctx.stroke();
	
	// Arrowhead A
	ctx.save()
	ctx.translate(va.x,va.y);
	ctx.rotate(-angle*dist/Math.abs(dist));
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(2,3);
	ctx.lineTo(-2,3);
	ctx.fill();
	ctx.restore();
	
	// Arrowhead B
	ctx.save()
	ctx.translate(vb.x,vb.y);
	ctx.rotate(-angle*dist/Math.abs(dist)+Math.PI);
	ctx.moveTo(0,0);
	ctx.lineTo(2,3);
	ctx.lineTo(-2,3);
	ctx.fill();
	ctx.restore();
	
	// Draw text
	ctx.fillStyle = "#000000";

	ctx.clearRect(vt.x-metric.width/2-3,vt.y-fontpx/2-1,metric.width+6,fontpx+4);
	ctx.fillText(txt,vt.x,vt.y);
	
	ctx.restore();
	
}