
function VarInput(arg_id,arg_notation,arg_type,arg_value,arg_unit,arg_href,arg_target){

	this._options = [];
	this._notation = "";
	
	this.validate = function(v){return v;};
	
	
	// ##########################################################################################
	// 			BUILD INTERFACE
	// ##########################################################################################
	this.buildInterface = function(){
		this.body = document.createElement("table");
		this.row = document.createElement("tr");
		this.body.className = "varinput";
		this.notationDiv = document.createElement("td");
		this.notationDiv.className = "notation-div";
		this.valueDiv = document.createElement("td");
		this.valueDiv.className = "value-div";
		this.unitDiv = document.createElement("td");
		this.unitDiv.className = "unit-div";
		
		this.notationAnchor = document.createElement("a");

		if(typeof arg_type === "object"){
			this.valueInput	= document.createElement("select");
			this.options 		= arg_type;
		}else if(arg_type == "number"){
			this.valueInput		= document.createElement("input");
			this.valueInput.type = "number";
		}else if(arg_type == "text"){
			this.valueInput		= document.createElement("input");
			this.valueInput.type = "text";
		}else{
			this.valueInput		= document.createElement("input");
			this.valueInput.type = "none";
			this.valueInput.readonly=true;
		}
		
		
		this.valueDiv.appendChild(this.valueInput);
		this.notationDiv.appendChild(this.notationAnchor);
		
		this.row.appendChild(this.notationDiv);
		this.row.appendChild(this.valueDiv);
		this.row.appendChild(this.unitDiv);
		
		this.body.appendChild(this.row);
		
		
		this.notation	= arg_notation;
		this.href		= arg_href;
		this.target		= arg_target;
		
		
		this.id		= arg_id
		this.unit	= arg_unit;
		this.value	= arg_value;
		
		
		this.notationAnchor.tabIndex=-1;
		
		
		
		
	}.bind(this);
	// ##########################################################################################
	// 			EVENT LISTENERS
	// ##########################################################################################
	this.configureEvents = function(){
		this.valueInput.addEventListener("change",function(e){
			var val = {value:this.value, error:[], warning:[], info:[]};
			val = this.validate(val);
			this.value = val.value;
		}.bind(this));
		
		this.body.addEventListener("click", function(e){
			if(e.target.tagName!=="INPUT" && e.target.tagName!=="SELECT"){
				//e.preventDefault();
				this.notationAnchor.click();
				if(this.valueInput.tagName == "SELECT"){
					this.valueInput.focus();
				}else{
					this.valueInput.select();
				}
			}
		}.bind(this))
	}.bind(this);
	
	// ##########################################################################################
	// 			HELPER FUNCTIONS
	// ##########################################################################################
	
	this.appendTo = function(dom){
		dom.appendChild(this.body)
		this.updateMathJax();
		this.configureEvents();
	}.bind(this);
	
	this.updateMathJax = function(){
		if(document.body.contains(this.body)){
			try{
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.body]);
			}catch(e){
				this.notation = this.id;
				// Fail gracefully sort of
			}
		}
	}.bind(this);
	
	
	// ##########################################################################################
	// 			GETTERS AND SETTERS
	// ##########################################################################################
	
	Object.defineProperty(this,"notation",{
		get:function(){
			this._notation;
		}.bind(this),
		set:function(newval){
			this.notationAnchor.innerHTML	= newval;
			this.updateMathJax();
		}.bind(this)
	});
	Object.defineProperty(this,"target",{
		get:function(){
			this.notationAnchor.target;
		}.bind(this),
		set:function(newval){
			this.notationAnchor.target	= newval;
		}.bind(this)
	});
	Object.defineProperty(this,"href",{
		get:function(){
			this.notationAnchor.href;
		}.bind(this),
		set:function(newval){
			this.notationAnchor.href	= newval;
		}.bind(this)
	});
	
	
	
	Object.defineProperty(this,"value",{
		get:function(){
			return this.valueInput.value;
		}.bind(this),
		set:function(newval){
			this.valueInput.value = newval;
		}.bind(this)
	});
	
	Object.defineProperty(this,"options",{
		get:function(){
			return this._options;
		}.bind(this),
		set:function(newval){
			this._options = newval;
			for(var i=0;i<this._options.length;i++){
				var o = document.createElement("option");
				o.innerHTML = this._options[i];
				this.valueInput.appendChild(o);
			}
		}.bind(this),
	});
	
	Object.defineProperty(this,"unit",{
		get:function(){
			this.unitDiv.innerHTML;
		}.bind(this),
		set:function(newval){
			this.unitDiv.innerHTML = newval;
		}.bind(this)
	});
	
	
	
	
	
	
	
	
	
	this.buildInterface();
}

























