///* Vector.js
///* CADCanvas.js




function drawElevation(ctx, b){

	var maxwidth = ctx.canvas.width-200;
	var maxheight = ctx.canvas.height-10;
	var minwidth = 0;
	var minheight = 0;

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	ctx.save();
		ctx.translate(Math.floor(ctx.canvas.width/2), Math.floor(ctx.canvas.height/2));
		var scale = Math.min(maxwidth/b.Ln, maxheight/b.D);

		var w = b.Ln*scale;
		var h = b.D*scale;

		ctx.strokeStyle = "#333333";
		ctx.lineWidth = 2;
		ctx.strokeRect(-w/2,-h/2,w,h);

		dim(ctx,w/2,-h/2,w/2,h/2,0,10,"D = "+b.D+"mm");

		dim(ctx,-w/2,0 ,w/2,0,Math.PI/2,(h>40)?0.01:30,"L_n = "+b.Ln+"mm");


	ctx.restore();

}

function drawCrossSection(ctx, b){
	
	
	var maxwidth	= ctx.canvas.width-190;
	var maxheight	= ctx.canvas.height-80;	
	var scale = Math.min(maxwidth/b.b, maxheight/b.D);
	
	var w = scale*b.b;
	var h = scale*b.D;
	var scaled_cover = b.cover*scale;
	var scaled_dfitments = b.dfitments*scale;
	// TODO: update this with correct bend radii
	// AS3600 17.2.3 assuming N12 Bars
	var fitments_BendRadius = 6*b.df/2*scale; 
	
	
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.save();
	try{
		ctx.translate(Math.floor(ctx.canvas.width/2), Math.floor(ctx.canvas.height/2));
		
		
		

		// Draw beam crossection outline
		ctx.strokeStyle = "#333333";
		ctx.lineWidth = 2;
		ctx.strokeRect(Math.round(-w/2), Math.round(-h/2), Math.round(w), Math.round(h));

		// Breadth
		dim(ctx,-w/2,h/2,w/2,h/2, Math.PI/2, 12,b.b+" mm");
		// Depth
		dim(ctx,-w/2,-h/2,-w/2,h/2, 0, -12,b.D+" mm");
		//Cover
		dim(ctx,w/2,-h/2,w/2,-h/2+b.cover*scale, 0, 10,b.cover+" mm cover");
		
		

		// HIGH PRECISION MODE
		// TODO: find the reference for this:
		// AS3600 

		//ctx.rotate(Math.sin((new Date()).getTime()/7000)*Math.PI/180*1);
		//ctx.translate(
		//var placementtollerance = 10*scale;
		//	Math.sin((new Date()).getTime()/5000)*placementtollerance/2,
		//	Math.sin((new Date()).getTime()/3000)*placementtollerance/2
		//);
		


		// Draw Fitments
		
			


		


		// TODO: Draw in top two reo bars if not included in the prescribed reo.

		//ctx.fillStyle = "#777777";
		// Draw top two longitudinal reo bars.
		//ctx.fillCircle(-w/2+scaled_cover+scaled_dfitments, -h/2+scaled_cover+scaled_dfitments, scaled_dfitments/2);
		//ctx.fillCircle( w/2-scaled_cover-scaled_dfitments, -h/2+scaled_cover+scaled_dfitments, scaled_dfitments/2);
		
		
		drawFitment(ctx,
						(-b.b/2 + b.cover + b.df/2)	*scale,
						(-b.D/2 + b.cover + b.df/2)	*scale,
						(b.b - 2*b.cover - b.df)		*scale,
						(b.D - 2*b.cover - b.df)	*scale,
						fitments_BendRadius*scale,
						30*scale,
						b.df*scale);
		

		// Draw other reo bars
		for(var i = 0; i<b.reo.length; i++){
			var layer = b.reo[i];

			var scaled_dtendons = layer.diameter*scale;

			var offsety = layer.depth*scale;
			var offsetx = (b.cover + b.df + layer.diameter/2)*scale;
			var spacing = (b.b - 2*(b.cover + b.df) - layer.diameter)*scale/(layer.number-1);

			// TODO: hover highlight
			ctx.fillStyle = "black";
			for(j=0;j<layer.number;j++){
				ctx.fillCircle( offsetx+j*spacing-w/2, offsety-h/2, scaled_dtendons/2);
			}


				
			ctx.font = "13px sans-serif";
			ctx.fillStyle = "black";
			ctx.textAlign = "start";
			ctx.textBaseline = "middle";
			ctx.fillText(i+": "+layer.number+"N"+layer.diameter+"  d="+layer.depth+"mm",w/2+10,  offsety-h/2);
		}	
	}catch(e){
		
		throw e
	}finally{
		ctx.restore();
	}
	
	
	
}
function drawFitment(ctx,x,y,w,h,rad,fitmentlen,scaled_dfitments){
	if(scaled_dfitments>=3){
		ctx.lineCap = "square";
		ctx.strokeStyle = "black";
		ctx.lineWidth = Math.ceil(scaled_dfitments);
		do_draw();
		ctx.lineCap = "square";
		ctx.strokeStyle = "white";
		ctx.lineWidth = Math.ceil(scaled_dfitments)-2;
		do_draw();

	}else{
		ctx.lineCap = "square";
		ctx.strokeStyle = "black";
		ctx.lineWidth = scaled_dfitments;
		do_draw();
	}

	function do_draw(){
		ctx.beginPath();
			ctx.moveTo(x+w-rad-rad/Math.SQRT2-fitmentlen,y+rad-rad/Math.SQRT2+fitmentlen);
			ctx.arc(x+w-rad,y+rad, rad, Math.PI*1.5-Math.PI/4, Math.PI*2);
			ctx.moveTo(x+w,y+h-rad);
			ctx.lineTo(x+w,y+rad);
			ctx.arc(x+w-rad,y+h-rad,rad,0,Math.PI/2)
			ctx.lineTo(x+w-rad*3,y+h)
			ctx.moveTo(x+w-rad,y+h);
			ctx.lineTo(x+rad,y+h);
			ctx.arc(x+rad,y+h-rad,rad,Math.PI/2,Math.PI)
			ctx.moveTo(x,y+h-rad);
			ctx.lineTo(x,y+rad);
			ctx.arc(x+rad,y+rad,rad,Math.PI,Math.PI*1.5)
			ctx.moveTo(x+rad,y);
			ctx.lineTo(x+w-rad,y);
			
			ctx.arc(x+w-rad,y+rad, rad, -Math.PI/2, Math.PI/4);
			ctx.lineTo(x+w-rad+rad/Math.SQRT2-fitmentlen,y+rad+rad/Math.SQRT2+fitmentlen);
		ctx.stroke();
	}
}

			//ctx.arc(x+rad,y+h-rad,rad,Math.PI/2,Math.PI)
			//ctx.moveTo(x,y+h-rad);
			//ctx.lineTo(x,y+rad);
			//ctx.arc(x+rad,y+rad,rad,Math.PI,Math.PI*1.5)
			//ctx.moveTo(x+rad,y);
			//ctx.lineTo(x+w-rad,y);



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
	
	var angAtoB = vb.copy().minus(va).ang;
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#555555";
	ctx.fillStyle = "#555555";
	
	// Draw line bodies
	ctx.beginPath();
		var vc = va.copy().minus(v1).unit().scalar(4).add(v1);
		var vd = va.copy().minus(v1).unit().scalar(4).add(va);
		ctx.moveTo(vc.x,vc.y);
		ctx.lineTo(vd.x,vd.y);
		//ctx.sharpLineV(vc,vd,0,0,0,255);
		
		
		var vc = vb.copy().minus(v2).unit().scalar(4).add(v2);
		var vd = vb.copy().minus(v2).unit().scalar(4).add(vb);
		ctx.moveTo(vc.x,vc.y);
		ctx.lineTo(vd.x,vd.y);
		//ctx.sharpLineV(vc,vd,0,0,0,255);
		
		ctx.moveTo(va.x,va.y);
		ctx.lineTo(vb.x,vb.y);
		//ctx.sharpLineV(va,vb,0,0,0,255);
	ctx.stroke();
	
	// Arrowhead A
	ctx.save()
		ctx.translate(va.x,va.y);
		ctx.rotate(angAtoB-Math.PI/2);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(2,5);
		ctx.lineTo(-2,5);
		ctx.fill();
		
		//ctx.sharpLine(0,0,2,5,0,0,0,255);
		//ctx.sharpLine(0,0,-2,5,0,0,0,255);
	ctx.restore();
	
	// Arrowhead B
	ctx.save()
		ctx.translate(vb.x, vb.y);
		ctx.rotate(angAtoB+Math.PI/2);
		ctx.moveTo(0,0);
		ctx.lineTo(2,5);
		ctx.lineTo(-2,5);
		//ctx.sharpLine(0,0,2,5,0,0,0,255);
		//ctx.sharpLine(0,0,-2,5,0,0,0,255);
		ctx.fill();
	ctx.restore();
	
	if(txt && txt !== "") {
		// Draw text
		ctx.fillStyle = "#000000";

		ctx.clearRect(vt.x-metric.width/2-3,vt.y-fontpx/2-1,metric.width+6,fontpx+4);
		ctx.fillText(txt,vt.x,vt.y);
	}
	ctx.restore();
	
}