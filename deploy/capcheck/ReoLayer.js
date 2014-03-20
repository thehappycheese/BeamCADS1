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




	this.setFromArea = function (a){
		// TODO: subject this function to further testing
		var result = []

		var fitwidth = this.parentbeam.getFitWidth();
		
		// AS4671 Table 5A in section 7
		var ndia = [10,	12,		16,		20,		24,		28,		32,		36,		40];
		var area = [78,	113,	201,	314,	452,	616,	804,	1020,	1260];
		// Search for a bunch of solutions that will get more than or equal to required area 'a':
		var n, d;
		for(d = area.length-1; d>=0; d--){
			n = Math.max(this.parentbeam.minnumberofbars,Math.ceil(a/area[d]));
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

	this.getReoObjectFromAreaLess =function(a,fitwidth){
		var obj = this.getReoObjectFromArea(a,fitwidth);
		var originalarea = obj.area;

		var sub = 0;
		while(originalarea==obj.area && a-sub>156){
			sub+=2;
			obj = this.getReoObjectFromArea(a-sub,fitwidth);
		}
		return obj;
	}.bind(this);



	if(barcode)	this.setBarcode(barcode);
}