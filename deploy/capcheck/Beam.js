


"use strict";
function Beam(){
	this.varids = [
		"Ln"		,
		"b"			,
		"D"			,
		"cover"		,
		"eclass"	,

		"rhoc"		,
		"fc"		,
		"fsy"		,
		"reoclass"	,
		"dfitments"	,

		"alpha2"	,
		"gamma"		,
		"dn"		,
		"d"			,
		"ku"		,

		"phi"		,
		"Mb"		,

	];
};

Beam.prototype = {
	updateModel: function(){
		var i;
		console.log(this)
		for(i=0;i<this.varids.length;i++){
			// lookup the datatype
			var varinfo = data_AS3600Variables({id:this.varids[i]}).first();
			switch(varinfo.vtype){
				case "int":
					this[varinfo.id] = parseInt(document.getElementById(varinfo.id).value);
					break;
				case "float":
					this[varinfo.id] = parseFloat(document.getElementById(varinfo.id).value);
					break;
				case "text":
				default:
					this[varinfo.id] = document.getElementById(varinfo.id).value;
			}
		}
	},
	updateView: function(){

	}
}