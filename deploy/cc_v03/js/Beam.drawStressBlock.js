
///* Vector.js
///* CADCanvas.js
///* CADCanvas.Patterns.js
///* Beam.js

Beam.prototype.drawStressBlock = function(ctx){

	var b = null;
	var b_dn = this.dn;
	var d = this.Ts_centroid_depth_from_dn(b_dn);
	
	
	
	var canvas = ctx.canvas;
	

	
	var padding_left = 10;
	var padding_top = 10;
	var padding_bottom = 10;
	var padding_right = 10;
	
	var max_height = canvas.height - (padding_top+padding_bottom);
	var max_width = canvas.width - (padding_left+padding_right);
	// Set te beam width at 100;
	var b_b = 100;
	var b_D = Math.max(100,Math.min(max_height,this.D/this.b*b_b));
	
	
	var scaleX = function(n){
		return n*(b_b/this.b);
	}.bind(this);
	
	var scaleY = function(n){
		return n*(b_D/this.D);
	}.bind(this);
	
	
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.save()
		ctx.translate(
			padding_left,
			padding_top
		);
		
		// Draw compressive zone
		CanvasPatterns.set2x2Hatch(ctx,"limegreen");
		ctx.fillRect(0,0,b_b,b_dn*this.gamma);

		// draw basic section
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.strokeRect(0,0,b_b,b_D);

		

		// draw section with reo bars
		for(var i = 0;i<this.reo.length;i++){
			var layer = this.reo[i];
			console.log(layer, scaleY(layer.depth),b_D,this.D)
			var x = b_b*0.1;
			var spacing = b_b*0.8/(layer.number-1);

			var f = this.layer_strain_from_layer_dn(layer, b_dn);
			if(f>0){
				ctx.fillStyle = "red";
			}else{
				ctx.fillStyle = "blue";
			}
			var rad = Math.min(scaleX(10),scaleY(10));
			var sid = rad*Math.SQRT2;
			for(var j = 0; j<layer.number;j++){
				if(f>0){
					ctx.fillCircle(x+spacing*j,scaleY(layer.depth),rad);
				}else{
					ctx.fillRect(x+spacing*j-sid/2,scaleY(layer.depth)-sid/2,sid,sid);
				}
			}
		}
		
		
		
	ctx.restore()
	
	
	
	return "ended draw normally";
}