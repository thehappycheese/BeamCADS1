

function DoValidation(){

	var error_list = []
	var warning_list = []
	
	var Ln = document.getElementById("Ln");
	var D = document.getElementById("D");
	var b = document.getElementById("b");
	var cover = document.getElementById("cover");
	Ln.setCustomValidity("");
	D.setCustomValidity("");
	b.setCustomValidity("");
	cover.setCustomValidity("");
	
	/** Ln
				too short
				too long
				span/depth ratio
	**/
	if(Ln.integerValue<500){
		error_list.push("Ln<0.5 m. This is too short to be considered a beam.");
		Ln.setCustomValidity("Ln too short.");
	}else if(Ln.integerValue<1000){
		warning_list.push("Ln<1 m. This may be a bit short for the type of analysis used in this software.");
		//Ln.setCustomValidity("Ln too short.");
	}else if(Ln.integerValue>=15000 && Ln.integerValue<25000){
		warning_list.push("Ln>15 m. This is pretty long for a clear-span. Consider some columns!");
		//Ln.setCustomValidity("Ln too long.");
	}else if(Ln.integerValue>=25000){
		error_list.push("Ln>25 m. This is too long for a clear-span. Columns would be needed.");
		Ln.setCustomValidity("Ln too long.");
	}
	// AS3600 8.5 - deflection span to depth ratio limits
	// TODO: confirm these values
	var span_to_depth = (Ln.integerValue/D.integerValue);
	if(span_to_depth>10){
		error_list.push("Ln/D =  "+span_to_depth.toFixed(1)+" (>10) This is a very small span to depth ratio. Consider deepening the beam.");
		Ln.setCustomValidity("Ln/D too small.");
		D.setCustomValidity("Ln/D too small.");
	}else if(span_to_depth<0.25 && Ln.integerValue!==0){
		error_list.push("Ln/D =  "+span_to_depth.toFixed(2)+" (< 0.25) This is a very low span on depth ratio. This software does not support 'deep' beams [See AS3600 Section 12 - Non Fexural members]");
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
		warning_list.push("b/D =  "+breadth_on_depth.toFixed(1)+" (> 5) This looks more like a slab than a beam. This software does not support slabs. [See AS3600 Section 9]");
		//b.setCustomValidity("b/D looks like slab.");
		//D.setCustomValidity("b/D looks like slab.");
	}
	if(b.integerValue%5!==0){
		error_list.push("b should be rounded to the nearest 5mm. Some construction tollerances are > 5mm.");
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
	}else if(D.integerValue<300){
		warning_list.push("D<300mm. This is probably a bit shallow a beam.");
	}else if(D.integerValue>3000 && D.integerValue<5000){
		warning_list.push("D>3000mm. This is probably a bit too deep for a beam.");
	}else if(D.integerValue>=5000){
		error_list.push("D>3000mm. This is probably a bit too deep for a beam.");
	}
	
	if(D.integerValue%5!==0){
		error_list.push("D should be rounded to the nearest 5mm. Some construction tollerances are > 5mm.");
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
		error_list.push("Cover should be rounded to the nearest 5mm. Some construction tollerances are > 5mm.");
	}
	/** eclass
				match with cover fromt able
				chosen from list
				matches f'c accroding to Table 4.4
	**/

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