function BeamIOElem(varinfo, parentbeam){

	this.create = function(){
		this.parentbeam = parentbeam;
		this.varinfo = varinfo;

		var template = document.querySelector("#textinput");
		var docfrag	= document.importNode(template.content,true);


		this.elem = docfrag.querySelector("table");
		this.elem.title	= varinfo.name+"\n"+(varinfo.description || "");

		
		this.elem.querySelectorAll("td")[0].innerHTML	= varinfo.unicode+":";
		this.elem.querySelectorAll("td")[2].innerHTML	= varinfo.unit;
		
		this.input 			= this.elem.querySelector("input");
		this.input.value	= varinfo.default;
		this._value			= varinfo.default || undefined;
		this.input.disabled = varinfo.disabled;
		this.input.addEventListener("mouseup",this.touchHandeler);
		this.input.addEventListener("keyup",this.touchHandeler);
		this.input.addEventListener("change",this.changeHandeler);

		switch(varinfo.vtype){
			case "float":
			case "int":
				this.input.type		= "number";
				break;
			case "text":
			default:
				this.input.type		= "text";
		}
		document.getElementById(varinfo.parent).appendChild(docfrag);
	}.bind(this);
	// LEFTOFF: 2014 03 24 4:54pm
	this.touchHandeler = function(e){
		// Do validation colours etc
		if(this.isInputValid()){
			this._value =this.getInputValue();
			this.input.style.color = "black";
			this.parentbeam.update();
		}else{
			this.input.style.color = "red";
		}
	}.bind(this);
	this.changeHandeler = function(e){
		// permit forced validation
		if(this.isInputValid()){
			this._value = this.getInputValue();
			this.input.style.color = "black";
		}else{
			this.setInputValue(this._value);
			alert("flash red");
		}
		this.parentbeam.update();
	}.bind(this);

	this.isInputValid= function(){
		var val = this.getInputValue();
		switch(this.varinfo.vtype){
			case "float":
			case "int":
				return !isNaN(val);
			case "text":
			default:
				return !(val=="");
		} 
	}.bind(this);
	this.getValue = function(){
		return this._value;
	}.bind(this);
	this.getInputValue = function(){
		switch(this.varinfo.vtype){
			case "float":
				return parseFloat(this.input.value);
			case "int":
				return parseInt(this.input.value);
			case "text":
			default:
				return this.input.value;
		}
	}.bind(this);
	this.setInputValue = function(newval){
		this.input.value = newval;
	}.bind(this);

	this.create();
}