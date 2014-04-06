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
	
	
	// TODO: make this controll respond to touch and change events

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
			this.inputs[i].addEventListener("mouseup"	, this.touchHandeler);
			this.inputs[i].addEventListener("keyup"		, this.touchHandeler);
			this.inputs[i].addEventListener("change"	, this.change);
		};

		this.elem.querySelectorAll('input[type="button"]')[0].addEventListener("mouseup", this.lessReo);
		this.elem.querySelectorAll('input[type="button"]')[1].addEventListener("mouseup", this.moreReo);

		document.getElementById("reodiv").appendChild(docfrag);
	}.bind(this);

	this.touchHandeler = function(e){
		// soft validation
		this.readUI();
		if(this.isValid()){
			this.elem.style.backgroundColor = "";
			this.writeUI();
			this.parentbeam.update();
		}else{
			this.elem.style.backgroundColor = "red";
		}
	}.bind(this);
	this.change = function(e){
		// hard validation
		// in this case the user should be able to disable the row by putting in an invalid value
		this.parentbeam.update();
	}.bind(this);
	
	this.update = function(e){

		
	}.bind(this);


	this.moreReo = function(e){
		this.readUI();
		this.value.morethan();
		if(!Valid.numeric(this.value.offset)){
			this.value.offset = 0;
		}
		this.writeUI();
		this.change();
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
		this.change();
		this.parentbeam.update();
	}.bind(this);




	this.isValid = function(){
		if(typeof this.value.offset == "number" && this.value.offset >= 0){
			if(!isNaN(this.value.area) && this.value.number>1){
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
		// TODO: this offset box doesnt work: fix this conditions
		if(this.elem.querySelectorAll("input")[0].value !== this.value.offset){
			if(typeof this.value.offset == "number"){
				this.elem.querySelectorAll("input")[0].value = this.value.offset;
			}else{
				this.elem.querySelectorAll("input")[0].value = "";
			}
		}
		if(this.elem.querySelectorAll("input")[1].value	!== this.value.getBarCode()){
			this.elem.querySelectorAll("input")[1].value = this.value.getBarCode()
		}
		this.elem.querySelector("select").value			= this.value.from;
		this.elem.querySelector("span").innerHTML		= this.value.area;
	}

	this.getValue = function(){
		this.readUI();
		return this.value;
	}.bind(this);

	this.init();
}

