///~ globaljs/Vector.js

function drawBeam(ctx, b){
	
	
	
	var maxwidth = ctx.canvas.width*0.6;
	var maxheight = ctx.canvas.height*0.6;
	var minwidth = Math.max(40, ctx.canvas.width*0.2);
	var minheight = Math.max(40, ctx.canvas.height*0.2);
	
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.save();
	
	ctx.translate(Math.floor(ctx.canvas.width/2)+0.5, Math.floor(ctx.canvas.height/2)+0.5);
	
		
		
		var scale = Math.min(maxwidth/b.B, maxheight/b.D);
		
		var w = Math.max(scale*b.B, minwidth);
		var h = Math.max(scale*b.D, minheight);
		console.log(w,h);
		
		ctx.strokeStyle = "#333333";
		ctx.lineWidth = 3;
		ctx.strokeRect(-w/2, -h/2, w, h);
		
		
		
		// TODO: draw cover and steel Layers
		
		dim(ctx,-w/2,h/2,w/2,h/2, Math.PI/2, 10,b.B+" mm");
		dim(ctx,-w/2,-h/2,-w/2,h/2, 0, -10,b.D+" mm");
		
		
		var scaledcover = Math.max(b.cover*scale*2,10);
		dim(ctx,w/2,-h/2,w/2,-h/2+scaledcover, 0, 100,b.cover+" mm cover");
		
		
		drawFitment(ctx,-w/2+scaledcover,-h/2+scaledcover,w-2*scaledcover,h-2*scaledcover,5);
	
	
	ctx.restore();
	
	
}
function drawFitment(ctx,x,y,w,h,rad){
	ctx.strokeStyle = "red"
	ctx.lineWidth = 1;
	ctx.strokeRect(x,y,w,h)
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
	
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#555555";
	ctx.fillStyle = "#555555";
	// Draw line bodies
	ctx.beginPath();
	var vc = va.copy().minus(v1).unit().scalar(3).add(v1);
	var vd = va.copy().minus(v1).unit().scalar(3).add(va);
	ctx.moveTo(vc.x,vc.y);
	ctx.lineTo(vd.x,vd.y);
	
	var vc = vb.copy().minus(v2).unit().scalar(3).add(v2);
	var vd = vb.copy().minus(v2).unit().scalar(3).add(vb);
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
	var vt = va.copy().add(vb).scalar(0.5);
	
	ctx.clearRect(vt.x-metric.width/2-3,vt.y-fontpx/2-1,metric.width+6,fontpx+4);
	ctx.fillText(txt,vt.x,vt.y);
	
	ctx.restore();
	
}