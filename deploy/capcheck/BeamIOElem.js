function BeamIOElem(varinfo, parentbeam){
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
}
BeamIOElem.prototype = {
	getValue:function(){
		switch(this.varinfo.vtype){
			case "float":
				return parseFloat(this.input.value);
			case "int":
				return parseInt(this.input.value);
			case "text":
			default:
				return this.input.value;
		}
	},
	setValue:function(){

	},
	validate:function(){

	},
};