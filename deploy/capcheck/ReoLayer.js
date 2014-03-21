function ReoLayer(parentbeam,barcode){
	this.parentbeam = parentbeam;
	this.number		= undefined;
	this.diameter	= undefined;
	this.offset		= undefined;
	this.bartype	= "N";
	this.from		= undefined;


	this.diameters	= [10,	12,		16,		20,		24,		28,		32,		36,		40];
	this.areas		= [78,	113,	201,	314,	452,	616,	804,	1020,	1260];

	Object.defineProperty(this,"area",{get:function(){
		return this.number * this.areas[this.diameters.indexOf(this.diameter)];
	}.bind(this)})

	this.setBarcode = function(barcode){
		var bs = barcode.split("N");
		this.diameter = parseInt(bs[1]);
		this.number = parseInt(bs[0]);
	}.bind(this);


	this.getBarCode = function(){
		return this.number + this.bartype + this.diameter;
	}.bind(this);

	this.isValid = function(){
		// TODO: validate this object
		return typeof this.offset == "number"
				&& !isNaN(this.area)
				&& (this.from=="top" || this.from=="bottom" || this.from=="highest" || this.from=="lowest");

	}.bind(this);

	this.getDepth = function(){
		switch(this.from){
			case "top":
				return this.offset;
			case "bottom":
				return this.parentbeam.D-this.offset;
			case "lowest":
				return this.parentbeam.D-this.parentbeam.cover - this.parentbeam.dfitments - this.offset - this.diameter/2;
			case "highest":
				return this.parentbeam.cover + this.parentbeam.dfitments + this.offset + this.diameter/2-1;
			default:
				throw new Error("Can't get depth: this.from is not correct.");
		}
		return undefined;
	}.bind(this);

	this.setFromArea = function (a,moreless){
		// TODO: subject this function to further testing
		var result = []

		var fitwidth = this.parentbeam.getFitWidth();
		
		// AS4671 Table 5A in section 7
		var ndia = [10,	12,		16,		20,		24,		28,		32,		36,		40];
		var area = [78,	113,	201,	314,	452,	616,	804,	1020,	1260];
		// Search for a bunch of solutions that will get more than or equal to required area 'a':
		var n, d;
		for(d = area.length-1; d>=0; d--){
			switch(moreless){
				case "less":
					n = Math.max(this.parentbeam.minnumberofbars,Math.floor(a/area[d]));
					break
				case "more":
				default:
					n = Math.max(this.parentbeam.minnumberofbars,Math.ceil(a/area[d]));
					
			}
			if(n<this.parentbeam.maxnumberofbars && ndia[d]*n+this.parentbeam.minbarspacing*(n-1)<fitwidth){
				// There are not too many bars, and the number of bars fits within the required width
				result.push({number:n,diameter:ndia[d],area:area[d]*n});
			}
		}
		// Sort by area
		result.sort(function(a,b){
			// 50mm^2 is median difference in the available areas for less than 10 bars
			// If the difference between areas is less than 50 and the number of bars is less, reverse the sort decision
			var diff = Math.abs(a.area-b.area);

			if(a.area<b.area){
				// TODO: fix up this sorting thing. Sorting by area seems to be just fine.
				if(diff<20 && b.number<a.number) return 1;
				
				return -1;
				
			}else{
				if(diff<20 && a.number<b.number)	return -1;
				

				return 1;
				
			}
		});
		this.diameter	= result[0].diameter;
		this.number		= result[0].number;

	}.bind(this);

	this.morethan = function(a){
		this.setFromArea(a||this.area+1||1, "more");
	}.bind(this);
	this.lessthan = function(a){
		this.setFromArea(a||this.area-1||1, "less");
	}.bind(this);

	this.setAreaLess =function(a){
		var originalarea = this.area;

		var sub = 0;
		while(originalarea==this.area && a-sub>156){
			sub+=2;
			this.setFromArea(a-sub);
		}
	}.bind(this);



	if(barcode)	this.setBarcode(barcode);
}