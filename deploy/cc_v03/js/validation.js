

function DoValidation(){
	
	return
	var error_list = []
	var warning_list = []
	
	var Ln = document.getElementById("Ln");
	var D = document.getElementById("D");
	var b = document.getElementById("b");
	var cover = document.getElementById("cover");
	var eclass = document.getElementById("eclass");
	var fc = document.getElementById("fc");
	Ln.setCustomValidity("");
	D.setCustomValidity("");
	b.setCustomValidity("");
	cover.setCustomValidity("");
	eclass.setCustomValidity("");
	fc.setCustomValidity("");
	
	/** Ln
				too short
				too long
				span/depth ratio
	**/
	if(Ln.integerValue<500){
		error_list.push("Ln<500mm. This is too short to be considered a beam.");
		Ln.setCustomValidity("Ln too short.");
	}else if(Ln.integerValue<1000){
		warning_list.push("Ln<1000mm. This may be a bit short for the type of analysis used in this software.");
		//Ln.setCustomValidity("Ln too short.");
	}else if(Ln.integerValue>15000 && Ln.integerValue<25000){
		warning_list.push("Ln>15m. This is pretty long for a clear-span. Consider some columns!");
		//Ln.setCustomValidity("Ln too long.");
	}else if(Ln.integerValue>=25000){
		error_list.push("Ln>25m. This is too long for a clear-span. Columns would be needed.");
		Ln.setCustomValidity("Ln too long.");
	}
	// AS3600 8.5 - deflection span to depth ratio limits
	// TODO: confirm these values
	var span_to_depth = (Ln.integerValue/D.integerValue);
	if(span_to_depth>10){
		error_list.push("Ln/D =  "+span_to_depth.toFixed(1)+" (>10) This is a very small span to depth ratio. D should be more than "+(Math.ceil(Ln.integerValue/10/10)*10).toFixed(0)+"mm");
		Ln.setCustomValidity("Ln/D too small.");
		D.setCustomValidity("Ln/D too small.");
	}else if(span_to_depth<0.25 && Ln.integerValue!==0){
		error_list.push("Ln/D =  "+span_to_depth.toFixed(2)+" (< 0.25) This is a very low span on depth ratio. D should be less than "+(Math.ceil(Ln.integerValue/0.25/10)*10).toFixed(0)+"mm This software does not support 'deep' beams [See AS3600 Section 12 - Non Fexural members]");
		Ln.setCustomValidity("Ln/D too high.");
		D.setCustomValidity("Ln/D too high.");
	}

	
		
	/** b
				minimum: 200 - arbitrary
				maxumum: 5000 - arbitrary
				underasonably large: 1500??
				breadth/depth ratio: ?? slab vs deep beam
				reasonabled multiple
	**/
	
	
	// TODO: confirm these values of bread/depth
	var breadth_on_depth = b.integerValue/D.integerValue;
	if(breadth_on_depth>5 && D.integerValue<300){
		error_list.push("b/D =  "+breadth_on_depth.toFixed(1)+" (> 5) This looks more like a slab than a beam. This software does not support slabs. [See AS3600 Section 9]");
		b.setCustomValidity("b/D looks like slab.");
		D.setCustomValidity("b/D looks like slab.");
	}
	// TODO: verify this bs
	if(breadth_on_depth<0.2){
		error_list.push("b/D =  "+breadth_on_depth.toFixed(1)+" (< 0.2) This looks more like a wall than a beam. The b should be greater than "+(Math.ceil(0.2*D.integerValue/10)*10).toFixed(0));
		b.setCustomValidity("b/D looks like slab.");
		D.setCustomValidity("b/D looks like slab.");
	}
	if(b.integerValue<200){
		error_list.push("b<200mm. This is not wide enough to be a beam.");
		b.setCustomValidity("Not wide enough");
	}else if(b.integerValue>1500 && b.integerValue<3000){
		warning_list.push("b>1500mm. This is probably a bit too wide for a beam.");
	}else if(b.integerValue>=2500){
		error_list.push("b>3000mm. This is too wide to be designed as a normal beam.");
		b.setCustomValidity("Too wide");
	}
	
	if(b.integerValue%5!==0){
		warning_list.push("b should be rounded to the nearest 5mm. Construction tollerances are not milimeter accurate.");
	}
	

	/** D
				minimum: 200 - arbitrary
				maxumum: 3000 - arbitrary
				reasonabled multiple
				underasonably large: 2000??
				deep beam limitation: ??
				breadth/depth ratio: (see above)
				span/depth ratio:	(see above)
	**/
	// TODO: check the
	if(D.integerValue<200){
		error_list.push("D<200mm. This is too shallow for a beam.");
		D.setCustomValidity("Too shallow");
	}else if(D.integerValue<300){
		warning_list.push("D<300mm. This is probably a bit shallow for a beam.");
	}else if(D.integerValue>2000 && D.integerValue<3000){
		warning_list.push("D>2000mm. This is probably a bit too deep for a beam.");
	}else if(D.integerValue>=3000){
		error_list.push("D>3000mm. This is too deep to be designed as a normal beam.");
		D.setCustomValidity("Too deep");
	}
	
	if(D.integerValue%5!==0){
		warning_list.push("D should be rounded to the nearest 5mm.  Construction tollerances are not milimeter accurate.");
	}

	/** cover
				match with eclass 4.10.3.2
				resonable multiple
				not too big ?? how big is too big?
				not too small
	**/
	if(cover.integerValue<25){
		
	}if(cover.integerValue<25){
		
	}
	if(cover.integerValue%5!==0){
		warning_list.push("Cover should be rounded to the nearest 5mm.  Construction tollerances are not milimeter accurate.");
	}
	/** eclass
				match with cover fromt able
				chosen from list
				matches f'c accroding to Table 4.4
	**/
	var class_index = [
		"A1",
		"A2",
		"B1",
		"B2",
		"C1",
		"C2"
	];
	var fc_index = 	[20,25,32,40,50];
	var coverdata_standard = [ // AS3600+A2 T4.10.3.2
		[20,20,20,20,20],
		[  ,30,25,20,20],
		[  ,  ,40,30,25],
		[  ,  ,  ,45,35],
		[  ,  ,  ,  ,50],
		[  ,  ,  ,  ,65]
	];
	var coverdata_nonstandard = [ // AS3600+A2 T4.10.3.3
		[20,20,20,20,20],
		[  ,30,20,20,20],
		[  ,  ,30,25,20],
		[  ,  ,  ,35,25],
		[  ,  ,  ,  ,45],
		[  ,  ,  ,  ,60]
	];
	
	// find standard cover requirement:
	for(var fc_index_i=0;fc_index_i<fc_index.length-1;fc_index_i++){
		if(fc.integerValue>=fc_index[fc_index_i] && fc.integerValue<fc_index[fc_index_i+1]){
			break;
		}
	}
	var standard_min_cover 		= coverdata_standard[class_index.indexOf(eclass.textValue)][fc_index_i];
	var nonstandard_min_cover	= coverdata_nonstandard[class_index.indexOf(eclass.textValue)][fc_index_i];
	if(standard_min_cover === undefined){
		requed_fc = fc_index_i;
		while(coverdata_standard[class_index.indexOf(eclass.textValue)][requed_fc] === undefined){
			requed_fc++;
		}
		error_list.push("f'c insufficient for Exposure classification without special considerations. Increase f'c to "+fc_index[requed_fc]+"MPa. See AS3600 Table 4.10.3.2 and Table 4.10.3.3");
		fc.setCustomValidity("Mismatch with eclass.");
		eclass.setCustomValidity("Mismatch with cover.");
	}else	if(cover.integerValue<standard_min_cover){
		error_list.push("Cover insufficient for f'c and Exposure classification without special considerations. Increase cover to "+standard_min_cover+"mm. See AS3600 Table 4.10.3.2 and Table 4.10.3.3");
		// TODO: or increase f_c to ^^
		cover.setCustomValidity("Insufficint for fc and eclass");
		eclass.setCustomValidity("Mismatch with cover.");
	}
	// TODO: more and less buttons still dont work.
	// Slab recognition doesnt really work too well.
	
	/** df
				chosen from list
	**/

	/** rhoc
				resonable multiple
				within perscribed range
	**/




	/** REO
				second row of reo on wide shallow beams is stupid
				
	**/
	
	var ebar = document.querySelector("#invardiverrorbar");
	ebar.innerHTML = "";
	if(error_list.length>0){
		ebar.innerHTML += '<ul class="errorlist"><li>'+error_list.join("</li><li>")+'</li></ul>';
	}
	if(warning_list.length>0){
		ebar.innerHTML += '<ul class="warninglist"><li>'+warning_list.join("</li><li>")+'</li></ul>';
	}
	

}