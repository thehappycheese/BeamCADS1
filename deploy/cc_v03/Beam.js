
"use strict";
function Beam(){
	this.create = function(){
		
		// #########################################################
		// Misc considerations
		this.elcass 			= "A";
		this.minbarspacing		= undefined;
		
		
		// #########################################################
		// Reinforcement considerations
		this.reo = [
			{number:2, diameter:10, area:156, depth:25+10+10/2,		tension:undefined},
			{number:2, diameter:10, area:156, depth:600-25-10-10/2,	tension:undefined},
		];
		this.df		= 10;
		
		
		// #########################################################
		// Geometric considerations
		this.b		= 300;
		this.D		= 600;
		this.cover	= 25;
		this.Ln		= 3000;
		
		
		// #########################################################
		// Material considerations
		this.fc		= 32;
		this.Ec		= undefined;
		this.rohc	= 2400;
		// AS4671 500MPa Steel && AS3600
		this.fsy = 500;// Steel characteristic yield stress: MPa
		// AS3600 3.2.2 taken to be (or determined by test)
		// TODO: add Es to variable inputs (commit with35mins)
		this.Es = 200000;// Steel Young's modulus of elasticity: MPa
		this.epsilonsy = this.fsy/this.Es; // 0.0025 or there-abouts
		
	}.bind(this);

	
	
	
	// #############################################################################
	// ### GEOMETRIC HELPER FUNCTIONS ##############################################
	// #############################################################################
	
	Object.defineProperty(this,"innerWidth",{
		get:function innerWidth(){
			return this.b - 2*(this.cover+this.df);
		}.bind(this)}
	);
	
	
	// TODO: Which layers of steel should be disregarded? Surely steel 'close' to the centroid should be left out.
	Object.defineProperty(this,"depthToTensionSteelCentroid",{
		get:function depthToTensionSteelCentroid(){
			var sum_area_times_depth = 0;
			var sum_area = 0;
			var layer_strain;
			var dn = this.dn;
			for(var i=0;i<this.reo.length;i++){
				layer_strain = this.layer_force_from_layer_dn(reo[i], dn);
				if(layer_strain>0){
					sum_area_times_depth += this.reo[i].getDepth()*this.reo[i].area;
					sum_area += this.reo[i].area;
				}
			}
			return sum_area_times_depth/sum_area;
		}.bind(this)
	});
	Object.defineProperty(this,"depthToCompressionSteelCentroid",{
		get:function depthToCompressionSteelCentroid(){
			var sum_area_times_depth = 0;
			var sum_area = 0;
			var layer_strain;
			var dn = this.dn;
			for(var i=0;i<this.reo.length;i++){
				layer_strain = this.layer_force_from_layer_dn(reo[i], dn);
				if(layer_strain<0){
					sum_area_times_depth += this.reo[i].getDepth()*this.reo[i].area;
					sum_area += this.reo[i].area;
				}
			}
			return sum_area_times_depth/sum_area;
		}.bind(this)
	});
	
	
	
	this.get_tension_reo = function(){
		var result = [];
		var dn = this.dn ;
		for(var i = 0; i < this.reo.length;i++){
			if(this.layer_strain_from_layer_dn(this.reo[i], dn)>0){
				result.push(this.reo[i]);
			}
		}
		return result;
	}.bind(this);
	
	this.get_compression_reo = function(){
		var result = [];
		var dn = this.dn ;
		for(var i = 0; i < this.reo.length;i++){
			if(this.layer_strain_from_layer_dn(this.reo[i], dn)<0){
				result.push(this.reo[i]);
			}
		}
		return result;
	}.bind(this);
	
	
	// #############################################################################
	// ### HIGH LEVEL CAPACITY FUNCTIONS ###########################################
	// #############################################################################
	Object.defineProperty(this,"Muo",{
		get:function Muo(){
			return (this.dsc-this.gamma*this.dn) * this.Cc_from_dn(this.dn)/1000; // kNm
		}.bind(this)}
	);

	
	Object.defineProperty(this,"dn",{get:function(){
		// TODO: make a beam flag to determine whether compression steel is considered in this calculation.
		// TODO: make a check to see that reo that is too small is never fed into this beam calculator
		var dn;
		var top = this.D;
		var bot = 0;
		var diff;
		var cnt = 0;
		do{
			dn = (top+bot)/2;
			diff = this.Ts_from_dn(dn)-this.Cs_from_dn(dn)-this.Cc_from_dn(dn);
			if(diff>0){
				bot = dn;
			}else{
				top = dn;
			}
			cnt++
		}while(Math.abs(diff) > 0.0001 && cnt<20);

		return dn;
	}.bind(this)});
	
	
	
	
	// #############################################################################
	// ### GET TOTAL STEEL FORCES ##################################################
	// #############################################################################
	
	Object.defineProperty(this,"Ts",{get:function(){
		return this.Ts_from_dn(this.dn);
	}.bind(this)});
	
	Object.defineProperty(this,"Cs",{get:function(){
		return this.Cs_from_dn(this.dn);
	}.bind(this)});
	
	Object.defineProperty(this,"Cc",{get:function(){
		return this.Cc_from_dn(this.dn);
	}.bind(this)});
	
	
	this.Ts_from_dn = function(dn){
		return this.Fs_from_dn(dn,true);
	}.bind(this);
	
	
	this.Cs_from_dn = function(dn){
		return this.Fs_from_dn(dn,false);
	}.bind(this);
	
	
	this.Fs_from_dn = funciton(dn, returntension){
		var result = 0;
		var epsilonsi;
		for(var i = 0;i<this.reo.length;i++){
			// First get strain in the steel layer according to similar triangles:
			epsilonsi = this.epsiloncmax/dn*(this.reo[i].depth - dn);
			// Limit the strain to a range of -0.0025 to 0.0025
			if(returntension){
				epsilonsi = Math.max(0, Math.min(epsilonsi, this.epsilonsy));
			}else{
				epsilonsi = Math.max(-this.epsilonsy, Math.min(epsilonsi, 0));
			}
			result += this.reo[i].area * this.Es * epsilonsi/1000; // kN
		}
		return result;
	}.binc(this);
	
	
	
	
	// #############################################################################
	// ### GET INDIVIDUAL STEEL FORCES #############################################
	// #############################################################################
	
	this.layer_strain_from_layer_dn = function(layer,dn){
		// First get strain in the steel layer according to similar triangles:
		var epsilonsi = this.epsiloncmax/dn*(layer.depth - dn);
		// Limit the strain to a range of -0.0025 to 0.0025
		// (The stress does not increase after yielding at fsy)
		epsilonsi = Math.max(-this.epsilonsy, Math.min(epsilonsi, this.epsilonsy));
		
		return epsilonsi
	}.bind(this);
	
	
	this.layer_force_from_layer_dn = function(layer,dn){
		var layer_strain = this.layer_strain_from_layer_dn(layer,dn);
		return layer.area * this.Es * layer_strain/1000; // kN
	}.bind(this);
	
	
	this.layer_yielded_from_layer_dn = function(layer,dn){
		var layer_strain = this.layer_strain_from_layer_dn(layer, dn);
		return layer_strain<=-0.0025 || layer_strain>=0.0025;
	}.bind(this);
	
	
	
	
	// ########################################################################
	// ####### GET CONCRETE FORCE #############################################
	// ########################################################################
	
	this.Cc_from_dn = function(dn){
		return (this.b*dn*this.gamma) * (this.fc*this.alpha2)/1000; // kN
	}.bind(this);

	

	// ########################################################################
	// #### MISC COEFICIENTS ##################################################
	// ########################################################################
	
	Object.defineProperty(this,"gamma",{get:function(){
		var r1 = 1.05-this.fc*0.007;
		var r2 = Math.max(0.67,Math.min(0.85,r1)) 
		return r2;
	}.bind(this)});
	
	
	Object.defineProperty(this,"alpha2",{get:function(){
		var r1 = 1-this.fc*0.003
		var r2 = Math.max(0.67,Math.min(0.85,r1));
		return r2;
	}.bind(this)});
	
	
	
	
	this.create();
};











