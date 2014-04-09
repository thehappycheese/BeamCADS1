


addEventListener("widgetsloaded",function(){





	ReoManagerPrototype = Object.create(HTMLDivElement.prototype);
	ReoManagerPrototype.createdCallback = function(){

		this.rows = [];
		
		this.create = function(){
			var firstrow = this.createReoInput();
			firstrow.enabled = true;
			firstrow.enabledIn.disabled = true;
			firstrow.offsetIn.disabled = true;
			firstrow.fromIn.disabled = true;
			
			this.rows.push(this.createReoInput());
			this.rows.push(this.createReoInput());
			this.rows.push(this.createReoInput());
			this.rows.push(this.createReoInput());
			this.rows.push(firstrow);
			
			
			for(var i = 0;i<this.rows.length;i++){
				this.appendChild(this.rows[i]);
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
		
		
		
		
		
		
		this.getBottomRow = function(){
			return this.rows[this.rows.length-1];
		}.bind(this);
		
		
		
		this.getDepthOfRow = function(){
			var br = this.getBottomRow();
			var r = this.getEnabledRows();
			
			
			// TODO: get the depth of the bottom row
		}.bind(this);
		
		
		
		
		
		
		
		
		
		this.createReoInput = function(){
			var nr = new ReoInput();
			nr.addEventListener("change",this.update);
			return nr;
		}.bind(this);
		
		
		
		
		
		
		
		
		this.update = function(){
			
			
		}.bind(this);
		
		
		
		this.adjustLength = function(){
			if(this.rows.length==1){
				this.rows.unshift(this.createReoInput())
			}
			while(!this.rows[0].enabled && this.rows.length>2 && !this.rows[1].enabled){
				this.removeChild(this.rows.shift());
			}
			for(var i=0;i<this.rows.length;i++){
				if(i==0 && this.rows[i].enabled){
					this.rows.unshift(this.createReoInput())
				}
				// Insert inbetween behaviour
				if(this.rows[i+1] && this.rows[i+1].enabled && this.rows[i].enabled && this.rows[i].from!=this.rows[i+1].from){
					//this.rows.splice(i+1,0,this.createReoInput());
					//i++;
				}
				// remove double blanks
				if(this.rows[i+1] && !this.rows[i+1].enabled && !this.rows[i].enabled){
					//this.removeChild(this.rows[i]);
					//this.rows.splice(i,1);
					//i--;
				}
			}
		}.bind(this);
		
		

		this.create();
	};
	
	
	
	window.ReoManager = document.registerElement("reo-manager",{prototype:ReoManagerPrototype});








});