///* BeamIOElem.js
///* BeamReoInput.js
///* ReoLayer.js



"use strict";
function Beam(){
	this.create = function(){
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

				//"alpha2"		,
				//"gamma"			,
				//"dn"			,
				//"d"				,
				//"ku"			,
				//"phi"			,
				//"Muo"			,
			]
		this.reo = [];
		this.minbarspacing		= undefined;
		this.minnumberofbars	= undefined;
		this.maxnumberofbars	= undefined;
		this.onupdate		= function(){};


		this.ioelemIds.forEach(function(i){
			this.ioelems.push(
				new BeamIOElem(
					data_AS3600Variables({id:i}).first(),
					this
				)
			);
		}.bind(this));

		this.reoelems.push(
			new BeamReoInput(3,	this),
			new BeamReoInput(2,	this),
			new BeamReoInput(1,	this),
			new BeamReoInput(0,	this)
		);
	}.bind(this);

	this.getData = function(){
		var i;
		this.ioelems.forEach(function(item){
			this[item.varinfo.id] = item.getValue();
		}.bind(this));
		this.reo = [];
		this.reoelems.forEach(function  (item) {
			this.reo.push(item.getValue());
		}.bind(this))
	}.bind(this);
	this.processData = function(){
		// TODO: List this as a design assumption:
		// AS3600+A2 8.1.9 Spacing of tendons
		// AS3600+A2 17.1.3 has a shpeel about all the ways concete shoul be handeled and how it should minimise air gaps etc.
		// 20mm is a reasonable number since it is a nominal aggregate size
		this.minbarspacing		= 20;
		// AS3600+A2 8.1.9 Spacing of tendons: max 300 on tension face. never allow less than 2 bars
		this.minnumberofbars	= Math.max(2,Math.ceil((this.b-2*(this.cover+this.dfitments))/300));
		// Limit the number of bars to 10 - arbitrary but reduces number of area intervals
		this.maxnumberofbars	= 10;
	}.bind(this);
	this.update = function(){
		this.getData();
		this.processData();
		this.onupdate();
	}.bind(this);



	this.getFitWidth = function(){
		return this.b - 2*(this.cover+this.dfitments);
	}.bind(this);













	this.getCapacity = function(){

		var dn = 0;

		while(this.T_from_dn(dn)>this.C_from_dn(dn)){
			dn++;
		}

		return dn;
	}.bind(this);
	this.T_from_dn = function(dn){
		
		var r = this.reo;
		var result = 0;
		for(var i = 0;i<r.length;i++){
			if(r[i].isValid()){
				result += r[i].area * this.fsy;
			}
		}
		return result;
	}.bind(this);
	this.C_from_dn = function(dn){
		return (this.b*dn*this.gamma) * (this.fc*this.alpha2)/1000; // kN
	}.bind(this);

	Object.defineProperty(this,"gamma",{get:function(){
		return Math.max(0.67,Math.min(0.85,1.05*this.fc*0.007));
	}.bind(this)});

	Object.defineProperty(this,"alpha2",{get:function(){
		return Math.max(0.67,Math.min(0.85,1*this.fc*0.003));
	}.bind(this)});












	

	this.create();
};











