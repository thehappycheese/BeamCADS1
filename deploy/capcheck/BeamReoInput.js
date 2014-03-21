///* ReoLayer.js


Valid = (new (function Valid(){
	this.numeric = function(v){
		if(isNaN(v) || v==undefined || typeof v == "string"){
			return false;
		}
		if(typeof v == "number"){
			return true;
		}
		return false;
	}
})());

function BeamReoInput(lable,parentbeam){
	
	

	this.init = function(){
		this.parentbeam = parentbeam;
		this.lable = lable;
		

		this.value = new ReoLayer(this.parentbeam, null);


		var template = document.querySelector("#reoinput");
		var docfrag	= document.importNode(template.content,true);

		this.elem = docfrag.querySelector("table");
		this.elem.title	= "[TODO: Help info]";


		this.elem.querySelectorAll("td")[0].innerHTML = lable;

		this.inputs = this.elem.querySelectorAll('input:not([type="button"]), select');

		for(var i=0; i<this.inputs.length; i++){
			this.inputs[i].addEventListener("mouseup"	, this.update);
			this.inputs[i].addEventListener("keyup"		, this.update);
			this.inputs[i].addEventListener("change"	, this.update);
		};

		this.elem.querySelectorAll('input[type="button"]')[0].addEventListener("mouseup", this.lessReo);
		this.elem.querySelectorAll('input[type="button"]')[1].addEventListener("mouseup", this.moreReo);

		document.getElementById("reodiv").appendChild(docfrag);
	}.bind(this);


	
	this.update = function(e){

		if(this.isValid()){
			this.elem.style.backgroundColor = "";
		}else{
			this.elem.style.backgroundColor = "red";
		}
	}.bind(this);


	this.moreReo = function(e){
		this.readUI();
		this.value.morethan();
		if(!Valid.numeric(this.value.offset)){
			this.value.offset = 0;
		}
		this.writeUI();
		this.update();
		this.parentbeam.update();
		// TODO: this still throws and error when it gets to big for the fitwidth
	}.bind(this);




	this.lessReo = function(e){
		this.readUI();
		this.value.lessthan();
		if(!Valid.numeric(this.value.offset)){
			this.value.offset = 0;
		}
		this.writeUI();
		this.update();
		this.parentbeam.update();
	}.bind(this);




	this.isValid = function(){
		if(typeof this.value.offset == "number" && this.value.offset >= 0){
			if(!isNaN(this.value.area)){
				return true
			}
		}
		return false;
	}.bind(this);
	

	this.readUI = function(){
		this.value.setBarcode(this.elem.querySelectorAll("input")[1].value);
		this.value.offset	= parseInt(this.elem.querySelectorAll("input")[0].value);
		this.value.from		= this.elem.querySelector("select").value;
	}.bind(this);
	this.writeUI = function(){
		if(typeof this.value.offset == "number"){
			this.elem.querySelectorAll("input")[0].value = this.value.offset;
		}else{
			this.elem.querySelectorAll("input")[0].value = "";
		}
		this.elem.querySelectorAll("input")[1].value	= this.value.getBarCode();
		this.elem.querySelector("select").value			= this.value.from;
		this.elem.querySelector("span").innerHTML		= this.value.area;
	}

	this.getValue = function(){
		this.readUI();
		return this.value;
	}.bind(this);

	this.init();
}

