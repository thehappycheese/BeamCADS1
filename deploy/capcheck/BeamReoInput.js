///* ReoLayer.js



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


	



	this.moreReo = function(e){
		this.value.setFromArea(this.value.area+1 || 1);
		if(this.value.offset!==0){
			this.value.offset=0;
		}
		this.writeUI();
	}.bind(this);




	this.lessReo = function(e){
		var row = e.target.parentElement.parentElement;
		var area = parseInt(row.querySelector("span").innerHTML)||1;
		// TODO: get the beam's width to do this.
		
		var barobj = this.parentbeam.getReoObjectFromAreaLess(area);

		row.querySelectorAll("input")[1].value = barobj.number+"N"+barobj.diameter;
		if(row.querySelectorAll("input")[0].value == ""){
			row.querySelectorAll("input")[0].value = 0;
		}
		this.update();
	}.bind(this);





	this.update = function(e){
		var areaspan		= this.elem.querySelector("span");
		this.readUI();
		this.writeUI();
		this.parentbeam.update();
	}.bind(this);

	this.readUI = function(){
		this.value.setBarcode(this.elem.querySelectorAll("input")[1].value);
		this.value.offset		= this.elem.querySelectorAll("input")[0].value;
		this.value.from		= this.elem.querySelector("select").value;
	}.bind(this);
	this.writeUI = function(){
		this.elem.querySelectorAll("input")[0].value	= this.value.offset;
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