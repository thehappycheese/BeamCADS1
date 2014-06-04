

///* Beam.js

Beam.prototype.drawSection = function(ctx){
	var b = null;
	var dn = this.dn;
	var d = this.Ts_centroid_depth_from_dn(dn);
	
	// unpack the canvas
	
	var canvas = ctx.canvas;
	
	// Ok so let's establish the space we have to work in
	// We will let HTML define our margin and shit. For here, we are only interested in not hitting the edge of the bmp
	
	// We need to first position the beam as big as possible in the frame. We are going to align it left
	//	leaving 30px on sides with dimention lines so that they fit comfortably
	
	var padding_left = 60;
	var padding_top = 40;
	var padding_bottom = 40;
	var padding_right = 100;
	
	var max_height = canvas.height - (padding_top+padding_bottom);
	var max_width = canvas.width - (padding_left+padding_right);
	
	var scale = Math.min(max_width/this.b, max_height/this.D);
	
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.save()
		ctx.translate(
			padding_left+this.b/2*scale,
			padding_top+this.D/2*scale+((canvas.height-padding_top-padding_bottom)-this.D*scale)/2
		);
		
		// Draw beam body
		ctx.strokeStyle = "#333333";
		ctx.lineWidth = 2;
		ctx.strokeRect(
			-this.b/2*scale,
			-this.D/2*scale,
			this.b*scale,
			this.D*scale);
		
		dim(
			ctx,
			-this.b/2*scale, -this.D/2*scale,
			-this.b/2*scale,  this.D/2*scale,
			Math.PI,
			32,
			this.D+" mm"
		);
		
		dim(
			ctx,
			-this.b/2*scale, -this.D/2*scale,
			this.b/2*scale,  -this.D/2*scale,
			-Math.PI/2,
			20,
			this.b+" mm"
		);
		
		dim(
			ctx,
			-this.b/2*scale							, this.D/2*scale,
			-this.b/2*scale + this.cover*scale	,  this.D/2*scale,
			Math.PI/2,
			20,
			""
		);
		
		ctx.strokeStyle="red"
		ctx.lineWidth = 2;
		ctx.beginPath()
			ctx.moveTo(
				-this.b/2*scale-30,
				-this.D/2*scale+d*scale
			)
			ctx.lineTo(
				this.b/2*scale+80,
				-this.D/2*scale+d*scale
			)
		ctx.stroke()
		ctx.fillText(
			"d_n",
			this.b/2*scale+80,
			-this.D/2*scale+d*scale
		)

		dim(
			ctx,
			this.b/2*scale + 5	, -this.D/2*scale,
			this.b/2*scale + 5	, -this.D/2*scale+dn*scale,
			0,
			80,
			"d = "+dn.toFixed(1)+" mm"
		);
		
		
		
		
		
		ctx.fillStyle = "black";
		ctx.font = "15px serif";
		ctx.textBaseline="middle"
		ctx.textAlign="left"
		ctx.fillText(
			"Cover = "+this.cover+" mm",
			-this.b/2*scale + this.cover*scale+3,
			this.D/2*scale + 20
		);
		
		
		
		
		// AS3600 17.2.3 assuming N12 Bars
		drawFitment(ctx,
						(-this.b/2 + this.cover + this.df/2)*scale,
						(-this.D/2 + this.cover + this.df/2)*scale,
						(this.b - 2*this.cover - this.df)	*scale,
						(this.D - 2*this.cover - this.df)	*scale,
						(this.df*3/2)*scale,
						30*scale,
						this.df*scale);
						
						
		
		
		
		
		var creo = this.reo.concat([]);
		for(var i = 0;i<creo.length;i++){
			creo[i].index = i;
		}
		creo.sort(function(a,b){
			return a.depth - b.depth;
		})
		
		// Draw reo
		var LABLESPACING = 15;
		var lastDepth = -Infinity;
		
		ctx.fillStyle = "black";
		for(var i = 0; i< creo.length; i++){
			var layer = creo[i];
			
			var spacing = (this.b-(this.cover+this.df)*2 - layer.diameter)/(layer.number-1)
			for(var j = 0; j<layer.number; j++){
				ctx.fillCircle(
					(-this.b/2+this.cover+this.df+layer.diameter/2+j*spacing)	*scale,
					(-this.D/2 + layer.depth)			*scale,
					layer.diameter/2 * scale
				);
			}
			var lableDepth = -this.D/2*scale + layer.depth*scale
			if(lastDepth >= lableDepth-LABLESPACING){
				lableDepth = lastDepth+LABLESPACING;
			}
			lastDepth = lableDepth;
			ctx.font = "15px sans-serif"
			ctx.fillText(
				"layer"+layer.index,
				this.b/2*scale+30,
				lableDepth
			)
			ctx.strokeStyle = "#AAAAAA";
			ctx.lineWidth = 1;
			ctx.beginPath();
				ctx.moveTo(
					this.b/2*scale+3,
					(-this.D/2 + layer.depth)*scale
				)
				ctx.bezierCurveTo(
					this.b/2*scale+15,
					(-this.D/2 + layer.depth)*scale,
					this.b/2*scale+15,
					lableDepth,
					this.b/2*scale+27,
					lableDepth
				)
			ctx.stroke();
		}
		
		
		// construct crack control reo
		
		//First, we need a way to sort reo by depth since this is not how it is present in the data structure.
		// here we make a copy.
		

		// lets look at the depth of the first element shall we. it should be within say  50mm of the top position
		var crackreo = [];
		if(creo[0].depth<(this.cover+this.df+50) ){
			// Good. A top layer of reinforcement exists
			last_depth = creo[0].depth;
		}else{
			// nope! lets add one!
			// if the beam is particularly wide, do we need crack control reo accross the top? Dunno. lets put it there
			// we will use N10s. It is only symbolic anyways.
			crackreo.push({
				number: Math.floor((this.b-2*this.cover-2*this.df)/300)+2,
				diameter: 10 ,
				depth:this.cover+this.df+5
			});
			last_depth = crackreo[crackreo.length-1].depth;
		}
		// now we go down from last_depth to the bottom of creo and add missing layers where nessisary
		
		for(var i = 0; i<creo.length;i++){
			var ddif = creo[i].depth-last_depth;
			if(ddif<300){
				last_depth = creo[i].depth;
			}else{
				// TODO evenly space stuff
				while(ddif>300){
					last_depth += 300;
					ddif -= 300;
					crackreo.push({
						number: 2,
						diameter: 10 ,
						depth:last_depth
					});
				}
			}
		}
		
		
		
		
		
		// Draw reo
		
		for(var i = 0; i< crackreo.length; i++){
			var layer = crackreo[i];
			
			var spacing = (this.b-(this.cover+this.df)*2 - layer.diameter)/(layer.number-1)
			for(var j = 0; j<layer.number; j++){
				ctx.fillStyle = "grey";
				ctx.fillCircle(
					(-this.b/2+this.cover+this.df+layer.diameter/2+j*spacing)	*scale,
					(-this.D/2 + layer.depth)			*scale,
					layer.diameter/2 * scale
				);
				ctx.fillStyle = "lightgrey";
				ctx.fillCircle(
					(-this.b/2+this.cover+this.df+layer.diameter/2+j*spacing)	*scale,
					(-this.D/2 + layer.depth)			*scale,
					layer.diameter/2 * scale - 1
				);
			}
		}
		
		
		
		
	ctx.restore()
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	return "ended draw normally";
}