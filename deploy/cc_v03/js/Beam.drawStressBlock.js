
///* Vector.js
///* CADCanvas.js
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
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.strokeRect(0,0,b_b,b_D);
		
		for(var i = 0;i<this.reo.length;i++){
			var layer = this.reo[i];
			console.log(layer, scaleY(layer.depth),b_D,this.D)
			var x = b_b*0.1;
			var spacing = b_b*0.8/(layer.number-1);
			for(var j = 0; j<layer.number;j++){
				ctx.fillCircle(x+spacing*j,scaleY(layer.depth),Math.min(scaleX(10),scaleY(10)))
			}
		}
		
		
		
	ctx.restore()
	
	
	
	return "ended draw normally";
}