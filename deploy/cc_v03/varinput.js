
function VarInput(arg_id,arg_notation,arg_unit,arg_type,arg_value,arg_href,arg_target){

	this._options = [];
	this._notation = "";
	
	
	
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
		
		if(typeof arg_type == "array"){
			this.valueInput	= document.createElement("select");
			this.options == arg_type;
		}else if(arg_type == "number"){
			this.valueInput		= document.createElement("input");
			this.valueInput.type = "number";
		}else if(arg_type == "text"){
			this.valueInput		= document.createElement("input");
			this.valueInput.type = "text";
		}else{
			this.valueInput		= document.createElement("input");
			this.valueInput.type = "text";
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
		
		this.options
		this.id		= arg_id
		this.unit	= arg_unit;
		this.value	= arg_value;
		
		
		
	}.bind(this);
	
	this.appendTo = function(dom){
		dom.appendChild(this.body)
		this.updateMathJax();
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
			if(this._type == "text"){
				return this.valueInput.value+"";
			}else{
				return Math.round(parseFloat(this.valueInput.value)*parseFloat(this.unitSelect.value));
			}
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

























