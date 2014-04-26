///* reoinput.js
///* EventDispatcher.js


function ReoManager(arg_body){
	
	EventDispatcher.call(this);
	
	
	this.body = arg_body;
	this.rows = [];
	
	this.create = function(){
		var firstrow = this.createReoInput();
		firstrow.makeFirstRow();
		this.rows.push(this.createReoInput());
		this.rows.push(this.createReoInput());
		this.rows.push(this.createReoInput());
		this.rows.push(firstrow);
		
		
		for(var i = 0;i<this.rows.length;i++){
			this.rows[i].appendTo(this.body);
		}
		
		this.update();
	}.bind(this);
	
	
	
	
	
	
	this.getEnabledSelectedRows = function(){
		var result = [];
		for(var i = 0;i<this.rows.length;i++){
			if(this.rows[i].enabled && this.rows[i].selected){
				result.push(this.rows[i]);
			}
		}
		return result;
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
	
	
	this.getTopmostTop = function(){
		var r = this.getEnabledRows();
		for(var i = 0;i<r.length;i++){
			// TODO: finish this and swim through the mire that is determining the order and fit of the bars.
			// LEFTOFF: 2014 04 16 23:25
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
		return r[r.length-1];
	}.bind(this);
	
	
	
	this.getDepthOfRow = function(row){
		
		var D = parseInt(vin.D.value);
		var df = parseInt(vin.df.value);
		var cover = parseInt(vin.cover.value);
		
		var rs = this.getEnabledRows();
		var br = this.getBottomRow();
		
		var last_low_depth = D-cover-df;
		var last_high_depth = cover+df;
		
		for(var i = rs.length-1;i>=0;i--){
			if(rs[i].from === "lowest"){
				if(rs[i] === row){
					return last_low_depth - rs[i].offset - rs[i].diameter/2;
				}else{
					last_low_depth -= rs[i].offset + rs[i].diameter;
				}
			}
		}
		for(var i = 0; i<rs.length-1; i--){
			if(rs[i].from === "highest"){
				if(rs[i] === row){
					return last_high_depth + rs[i].offset + rs[i].diameter/2;
				}else{
					last_high_depth += rs[i].offset + rs[i].diameter;
				}
			}
		}
		return "ERROR";
	}.bind(this);
	
	
	
	
	
	
	
	
	
	this.createReoInput = function(){
		var nr = new ReoInput();
		nr.manager = this;
		console.log("fix events")
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
		this.dispatch("update",this);
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
	
	Object.defineProperty(this,"selected_value",{
		get:function(){
			var result = [];
			var rs = this.getEnabledSelectedRows(); 
			var rw;
			for(var i = 0;i<rs.length;i++){
				rw = {
					number:		rs[i].number,
					diameter:	rs[i].diameter,
					area:			rs[i].area,
					depth:		this.getDepthOfRow(rs[i]),
					mass_per_meter:	rs[i].mass_per_meter,
					from:			rs[i].from,
					offset:			rs[i].offset,
					
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