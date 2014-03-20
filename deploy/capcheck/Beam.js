


"use strict";
function Beam(){
	this.ioelems = [];
	this.reoelems = [];
	this.ioelemIds = [
			"Ln"		,
			"b"			,
			"D"			,
			"cover"		,
			"eclass"	,
			"dfitments"	,
			"rhoc"		,
			"fc"		,
			"fsy"		,
			"reoclass"	,

			"alpha2"		,
			"gamma"			,
			"dn"			,
			"d"				,
			"ku"			,
			"phi"			,
			"Muo"			,
		]
		this.minbarspacing		= undefined;
		this.minnumberofbars	= undefined;
		this.maxnumberofbars	= undefined;
		this.update;
};

Beam.prototype = {
	init: function(){
		
		this.ioelemIds.forEach(function(i){
			this.ioelems.push(
				new BeamIOElem(
					data_AS3600Variables({id:i}).first()
				)
			);
		}.bind(this));

		this.reoelems.shift(
			new BeamReoInput(4,	this),
			new BeamReoInput(3,	this),
			new BeamReoInput(2,	this),
			new BeamReoInput(0,	this)
		);
	},
	getData: function(){
		var i;
		this.ioelems.forEach(function(item){
			this[item.varinfo.id] = item.getValue();
		}.bind(this));
	},
	processData: function(){
		// TODO: List this as a design assumption:
		// AS3600+A2 8.1.9 Spacing of tendons
		// AS3600+A2 17.1.3 has a shpeel about all the ways concete shoul be handeled and how it should minimise air gaps etc.
		// 20mm is a reasonable number since it is a nominal aggregate size
		this.minbarspacing		= 20;
		// AS3600+A2 8.1.9 Spacing of tendons: max 300 on tension face. never allow less than 2 bars
		this.minnumberofbars	= Math.max(2,Math.ceil((this.b-2*(this.cover+this.dfitments))/300));
		// Limit the number of bars to 10 - arbitrary but reduces number of area intervals
		this.maxnumberofbars	= 10;
	},
	update: function(){
		this.getData();
		this.processData();
	},








	getReoObjectFromArea: function (a){
		// TODO: subject this function to further testing
		var result = []
		
		var fitwidth = this.b - 2*(this.cover + this.dfitments);
		
		// AS4671 Table 5A in section 7
		var ndia = [10,	12,		16,		20,		24,		28,		32,		36,		40];
		var area = [78,	113,	201,	314,	452,	616,	804,	1020,	1260];
		// Search for a bunch of solutions that will get more than or equal to required area 'a':
		var n, d;
		for(area.length-1; d>=0; d--){
			n = Math.max(this.minnumberofbars,Math.ceil(a/area[d]));
			if(n<maxbars && ndia[d]*n+this.minbarspacing*(n-1)<fitwidth){
				// There are not too many bars, and the number of bars fits within the required width
				result.push({n:n,d:ndia[d],a:area[d]*n});
			}
		}
		// Sort by area
		result.sort(function(a,b){
			// 50mm^2 is median difference in the available areas for less than 10 bars
			// If the difference between areas is less than 50 and the number of bars is less, reverse the sort decision
			if(a.a>b.a){
				if(a.a>b.a-50 && b.n<a.n){
					return false;
				}else{
					return true;
				}
			}else{
				return false;
			}
		});
		return result[0];
	},




	getReoObjectFromBarcode:function(barcode){
		var bs = barcode.split("N");
		
		if(bs.length<1){
			throw new Error("Bar-code should be specified in the format \"2N12\". not: "+barcode);
		}
		
		var ndia = [10,	12,		16,		20,		24,		28,		32,		36,		40];
		var area = [78,	113,	201,	314,	452,	616,	804,	1020,	1260];
		var result = {}
		result.d = parseInt(bs[1]);
		result.n = parseInt(bs[0]);
		result.a = area[ndia.indexOf(result.d)]*result.n;
		return result;
	},

}



function BeamIOElem(varinfo){
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





function BeamReoInput(lable,parentbeam){
	this.parentbeam = parentbeam;
	this.lable = lable;

	var template = document.querySelector("#reoinput");
	var docfrag	= document.importNode(template.content,true);

	this.elem = docfrag.querySelector("table");
	this.elem.title	= "[TODO: Help info]";


	this.elem.querySelectorAll("td")[0].innerHTML = lable;

	this.inputs = this.elem.querySelectorAll('input:not([type="button"]), select');

	for(var i=0; i<this.inputs.length; i++){
		this.inputs[i].addEventListener("mouseup"	, this.listen);
		this.inputs[i].addEventListener("keyup"		, this.listen);
		this.inputs[i].addEventListener("change"	, this.listen);
	};

	this.elem.querySelectorAll('input[type="button"]')[0].addEventListener("mouseup", this.lessReo);
	this.elem.querySelectorAll('input[type="button"]')[1].addEventListener("mouseup", this.moreReo);

	document.getElementById("reodiv").appendChild(docfrag);

}
BeamReoInput.prototype = {
	listen:function(e){
		var row = e.target.parentElement.parentElement;
		var areaspan = row.querySelector("span");
		var barcode = row.querySelectorAll("input")[1].value;
		var bararea = this.parentbeam.getReoObjectFromBarcode(barcode).a;
		if(isNaN(bararea)){
			row.querySelectorAll("input")[1].style.color="red";
			areaspan.innerHTML = "";
		}else{
			row.querySelectorAll("input")[1].style.color="black";
			areaspan.innerHTML = bararea;
		}
	},
	moreReo:function(e){
		var row = e.target.parentElement.parentElement;
		var area = parseInt(row.querySelector("span").innerHTML)+1||1;
		// TODO: get the beam's width to do this.
		var barobj = getReoObjectFromArea(area,beam.b-2*(beam.cover+beam.dfitments));
		row.querySelectorAll("input")[1].value = barobj.n+"N"+barobj.d;
		if(row.querySelectorAll("input")[0].value == ""){
			row.querySelectorAll("input")[0].value = 0;
		}
		row.querySelectorAll("input")[1].dispatchEvent(new Event("change"));
	},
	lessReo:function(e){
		console.log("unimplemented");
	},
};



function ReoObject(barcode){
	this.area = 0;
	this.number = 0;
	this.diameter = 0;
	this.offset = 0;
	this.from = "top";
}