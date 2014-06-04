///* varinput.js
///////////////    SETUP VARIABLE INPUTS     /////////////////////
// TODO: varinfodiv iframe is no longer relevant here! Remove it from the definition of the thing and replace with #help_bar_ etc



// first, create the global variables
var vin = {};
vin.Ln     = new VarInput('Ln' , "$$$L_n$$$" , "number" , 4000, "mm");
vin.b      = new VarInput('b' , "$$$b$$$" , "number" , 300, "mm");
vin.D      = new VarInput('Depth' , "$$$D$$$" , "number" , 600, "mm");
vin.cover  = new VarInput('cover' , "$$$\\text{Cover}$$$" , "number" , 25, "mm");
vin.eclass = new VarInput('eclass' , "$$$\\text{E. Class}$$$" , "text" , "A1", "",["A1","A2","B1","B2","C1","C2"]);
vin.df     = new VarInput('dfitments' , "$$$d_f$$$" , "number" , 10, "mm",[10, 12, 13, 14, 15, 15, 17, 18, 19, 20]);
// TODO: SUPERVISOR Round bars http://www.onesteel.com/products.asp?action=showProduct&productID=52&categoryName=Bar%20Sections
vin.rhoc   = new VarInput('rhoc', "$$$\\rho_c$$$" , "number" , 2400, "kg/m&#179;");
vin.fc     = new VarInput('fc' , "$$$f_c$$$" , "number" , 32, "MPa",[20, 25, 32, 40, 50, 65, 80, 100]);


// append to dom and attatch a listener
for(var i in vin){
	vin[i].appendTo(document.querySelector("#invardiv-content"));
	vin[i].on("change",function(){
		mainUpdateListener()
	});
}












vin.b.validate = function(e){
	//var e = {value:this.value, error:[], warning:[], info:[]};
	var link = '<a href="infos/b.htm" target="varinfoiframe">$$$b$$$</a> '
	
	if(e.value%5!==0){
		e.error.push(link+"Round to nearest 5mm.");
		e.value = Math.round(e.value/5)*5;
	}
	if(e.value<200){
		e.error.push(link+"Beam not wide enough.");
		e.value=200;
	}
	if(e.value>2000){
		e.error.push(link+"Beam too wide.");
		e.value=2000;
	}
	
	
	
	
	//8.9.2 Simply supported and continuous beams
		// For a simply supported or continuous beam, the distance L_l between points at which lateral
		// restraint is provided shall be such that L_l/bef does not exceed the lesser of 180bef/D and 60.
		// Here we assume beam Ln == L_1
	var breadth_on_depth = e.value/vin.D.value;
	var length_on_breadth = vin.Ln.value/e.value;
	if(length_on_breadth>Math.min(60,180*breadth_on_depth)){
		e.warning.push(link+"L_n/b =  <b>"+length_on_breadth.toFixed(1)+"</b> > minimum(180*b/D , 60) = <b>"+Math.min(60,180*breadth_on_depth)+"</b> This beam is too slender! Assuming there is no lateral restraint on its length. See AS3600 8.9.2");
	}// TODO: THIS CHECK HAS NO EFFECT!
	
	return e;
}


vin.D.validate = function(e){
	//var e = {value:this.value, error:[], warning:[], info:[]};
	var link = '<a href="infos/D.htm" target="varinfoiframe">$$$D$$$</a> '
	
	if(e.value%5!==0){
		e.error.push(link+"Round to nearest 5mm.");
		e.value = Math.round(e.value/5)*5;
	}
	if(e.value<200){
		e.error.push(link+"Beam not deep enough.");
		e.value=200;
	}
	if(e.value>1500){
		e.error.push(link+"Beam too deep.");
		e.value=1500;
	}
	return e;
}