function BeamIOElem(varinfo, parentbeam){

	this._value = undefined;

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
	this.input.disabled = varinfo.disabled;
	this.input.addEventListerner("mouseup",this.touchHandeler);
	this.input.addEventListerner("keyup",this.touchHandeler);
	this.input.addEventListerner("change",this.changeHandeler);

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

	this.touchHandeler = function(){
		// Do validation colours etc
		
	}.bind(this);
	this.changeHandeler = function(){
		// permit forced validation
		
		this.parentbeam.update();
	}.bind(this);

	this.isValid= function(){

	}.bind();
	this.getValue = function(){

		switch(this.varinfo.vtype){
			case "float":
				return parseFloat(this.input.value);
			case "int":
				return parseInt(this.input.value);
			case "text":
			default:
				return this.input.value;
		}
	}
}