///* reoinput.js
///* EventDispatcher.js


function ReoManager(arg_body, arg_beam){
	
	EventDispatcher.call(this);
	
	this.beam = arg_beam;
	
	this.body = arg_body;
	this.rows = [];
	
	this.create = function(){
		var firstrow = this.createReoInput();
		firstrow.makeFirstRow();
		this.rows.push(firstrow);
		this.rows.push(this.createReoInput());
		this.rows.push(this.createReoInput());
		this.rows.push(this.createReoInput());
		
		// TODO: reversed row order. make things independat of row orderish.
		for(var i = this.rows.length - 1;i>=0;i--){
			this.rows[i].appendTo(this.body);
		}
		
		this.update();
	}.bind(this);
	
	
	
	
	

	
	
	
	this.getEnabledRows = function(){
		var result = [];
		for(var i = 0;i<this.rows.length;i++){
			if(this.rows[i].enabled){
				result.push(this.rows[i]);
			}
		}
		return result;
	}.bind(this);
	
	
	this.getRowIndex = function(row){
		for(var i=0; i<this.rows.length;i++){
			if(row === this.rows[i]){
				return i;
			}
		}
		return undefined
	}.bind(this);
	
	this.getEnabledRowIndex = function(row){
		var rs = this.getEnabledRows();
		for(var i=0; i<rs.length;i++){
			if(row === rs[i]){
				return i;
			}
		}
		return undefined
	}.bind(this);
	
	
	
	
	
	
	this.getTopmostTop = function(){
		var r = this.getEnabledRows();
		for(var i = r.length-1;i>=0;i--){
			if(r[i].from==="highest"){
				if(r[i].offset===0){
					return r[i];
				}
				break;
			}
		}
		return undefined;
	}.bind(this);
	
	this.getTopRow = function(){
		for(var i = r.length-1;i>=0;i--){
			if(r[i].from==="highest"){
				if(r[i].offset===0){
					return r[i];
				}
				break;
			}
		}
		return undefined;
	}.bind(this);
	
	
	
	
	
	
	this.getBottomRow = function(){
		var r = this.getEnabledRows();
		return r[0];
	}.bind(this);
	
	
	
	this.getDepthOfRow = function(row){
		// TODO: update
		var D = this.beam.D;
		var df = this.beam.df;
		var cover = this.beam.cover;
		
		var rs = this.getEnabledRows();
		var br = this.getBottomRow();
		
		var last_low_depth = D-cover-df;
		var last_high_depth = cover+df;
		
		
		// loop bottom to top
		for(var i = 0;i<rs.length;i++){
			if(rs[i].from === "lowest"){
				if(rs[i] === row){
					return last_low_depth - rs[i].offset - rs[i].diameter/2;
				}else{
					last_low_depth -= rs[i].offset + rs[i].diameter;
				}
			}
		}
		// loop top to bottom
		for(var i = rs.length-1; i>=0; i--){
			if(rs[i].from === "highest"){
				if(rs[i] === row){
					return last_high_depth + rs[i].offset + rs[i].diameter/2;
				}else{
					last_high_depth += rs[i].offset + rs[i].diameter;
				}
			}
		}
		throw new Error("Failed to get depth of row.")
	}.bind(this);
	
	
	
	
	
	
	
	
	
	this.createReoInput = function(){
		var nr = new ReoInput(this);
		nr.on("update",this.update);
		nr.on("change",this.change);
		return nr;
	}.bind(this);
	
	
	
	
	
	this.change = function(e){
		//console.log("reo-manager change");
		this.dispatch("change",this);
	}.bind(this);
	
	
	this.update = function(e){
		//console.log("reo-manager update");
		this.update_renumberRows();
		this.dispatch("update",this);
	}.bind(this);
	
	
	
	
	this.update_renumberRows = function(){
		for(var i=0; i<this.rows.length;i++){
			this.rows[i].layerNumberOutput.innerHTML = "";
			this.rows[i].layerDepthOutput.innerHTML = "";
			this.rows[i].layerDepthOutput.innerHTML = "";
		}
		var rs = this.getEnabledRows();
		for(var i=0; i<rs.length;i++){
			rs[i].layerNumberOutput.innerHTML = i;
			rs[i].layerDepthOutput.innerHTML = this.getDepthOfRow(rs[i]);
		}
	}.bind(this);
	
	
	
	
	
	
	Object.defineProperty(this,"value",{
		get:function(){
			var result = [];
			var rs = this.getEnabledRows(); 
			var rw;
			for(var i = 0;i<rs.length;i++){
				rw = {
					number:		rs[i].number,
					diameter:	rs[i].diameter,
					area:			rs[i].area,
					depth:		this.getDepthOfRow(rs[i])
				}
				result.push(rw);
			}
			return result;
			
		},
		set:function(newval){
			// TODO: DESERIELIZEEEE :|
		}
	});
	
	
	
	
	
	

	this.create();
};