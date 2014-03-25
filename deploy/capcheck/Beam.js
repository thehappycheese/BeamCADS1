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
		// AS3600+A2 8.1.2(d) Concrete maximum strain is 0.003
		this.epsiloncmax = 0.003;
	}.bind(this);
	this.update = function(){
		this.getData();
		this.processData();
		this.onupdate();
	}.bind(this);



	this.getFitWidth = function(){
		return this.b - 2*(this.cover+this.dfitments);
	}.bind(this);













	Object.defineProperty(this,"Muo",{get:function(){
		this.printed = {};
		document.getElementById("calcdiv").innerHTML = "";
		var dn = this.dn;
		return (this.dsc-this.gamma*dn) * this.Cc_from_dn(dn)/1000; // kNm
	}.bind(this)});

	Object.defineProperty(this,"dsc",{get:function(){
		//depth to steel centroid
		var sum_area_times_depth = 0;
		var sum_area = 0;
		for(var i=0;i<this.reo.length;i++){
			if(this.reo[i].isValid()){
				sum_area_times_depth += this.reo[i].getDepth()*this.reo[i].area;
				sum_area += this.reo[i].area;
			}
		}
		return sum_area_times_depth/sum_area;
	}.bind(this)});
	
	Object.defineProperty(this,"dn",{get:function(){
		// TODO: make a beam flag to determine whether compression steel is considered in this calculation.
		var dn;
		var top = this.D;
		var bot = 0;
		var diff;
		var cnt = 0;
		do{
			dn = (top+bot)/2;
			diff = this.Ts_from_dn(dn)-this.Cc_from_dn(dn);
			if(diff>0){
				bot = dn;
			}else{
				top = dn;
			}
			cnt++
		}while(Math.abs(diff) > 0.0001 && cnt<20);
		
		
		if(!this.printed.dn){
			this.printed.dn = true;
			this.showCalc("<hr>");
			this.showCalc("find depth to neutral axis: dn");
			this.showCalc("This is found by equating tension and compression forces in the beam. (Ignore moment calculations for now)");
			this.showCalc("We will also ignore any compression steel for now.");
			this.showCalc("dn can be found by equating the horizontal actions in the beam: Tension in the steel 'Ts' and the compression in the concrete 'Cc'");
			this.showCalc("Ts = Cc");
			
		}
		
		
		

		return dn;
	}.bind(this)});
	Object.defineProperty(this,"Ts",{get:function(){
		return this.Ts_from_dn(this.dn);
	}.bind(this)});
	Object.defineProperty(this,"Cc",{get:function(){
		return this.Cc_from_dn(this.dn);
	}.bind(this)});

	this.Ts_from_dn = function(dn){

		// AS4671 500MPa Steel && AS3600
		var steel_yield_stress = 500;//MPa
		// AS3600 3.2.2 taken to be (or determined by test)
		// LEFTOFF: 2013 03 24
		// TODO: add Es to variable inputs (commit with35mins)

		var steel_youngs_modulus = 200000;// MPa
		var epsilonsy = steel_yield_stress/steel_youngs_modulus;

		var r = this.reo;
		var result = 0;
		var epsilonsi;
		for(var i = 0;i<r.length;i++){
			if(r[i].isValid()){
				// First get strain in the steel layer according to similar triangles:
				epsilonsi = this.epsiloncmax/dn*(r[i].getDepth() - dn);
				// Limit the strain to a maximum of 0.025 and a minimum of 0 to remove compression steel.
				epsilonsi = Math.min(epsilonsi, epsilonsy);
				if(epsilonsi<0){
					epsilonsi = 0;
					// TODO: unintended compression steel?
				}
				// Ast*500MPa = yield force
				result += r[i].area * steel_youngs_modulus*epsilonsi/1000; // kN??
			}
		}
		return result;
	}.bind(this);
	this.Cc_from_dn = function(dn){
		return (this.b*dn*this.gamma) * (this.fc*this.alpha2)/1000; // kN
	}.bind(this);


	Object.defineProperty(this,"gamma",{get:function(){
		// TODO: test this
		var r1 = 1.05-this.fc*0.007;
		var r2 = Math.max(0.67,Math.min(0.85,r1)) 
		if(!this.printed.gamma){
			this.printed.gamma = true;
			this.showCalc("<hr>");
			this.showCalc("gamma = 1.05 - f'c*0.007");
			this.showCalc("gamma = 1.05 - "+this.fc+"*0.007 = "+r1.toFixed(3));
			this.showCalc("gamma< 0.85 AND gamma>0.67");
			this.showCalc("gamma = "+r2.toFixed(3));
		}
		return r2;
	}.bind(this)});

	Object.defineProperty(this,"alpha2",{get:function(){
		// TODO: test this
		var r1 = 1-this.fc*0.003
		var r2 = Math.max(0.67,Math.min(0.85,r1));
		if(!this.printed.alpha){
			this.printed.alpha = true;
			this.showCalc("<hr>");
			this.showCalc("alpha2 = 1 - f'c*0.003");
			this.showCalc("alpha2 = 1 - "+this.fc+"*0.003 = "+r1.toFixed(3));
			this.showCalc("alpha2< 0.85 AND alpha2>0.67");
			this.showCalc("alpha2 = "+r2.toFixed(3));
		}
		return r2;
	}.bind(this)});

	this.showCalc = function(txt){
		document.getElementById("calcdiv").innerHTML += txt+"<br/>";
	}.bind(this);
	
	this.printed = {};

	this.create();
};











