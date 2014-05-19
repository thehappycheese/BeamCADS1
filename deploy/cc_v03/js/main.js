///* drawBeam.js
///* Beam.js
///* varinput.js
///* validation.js
///* reoinput.js
///* ReoManager.js
///* ProTips.js
///* CalcDiv.js

///* function.outputCalculations.js









///////////////    SETUP VARIABLE INPUTS     /////////////////////

var vin = {};
vin.Ln     = new VarInput('Ln' , "$$$L_n$$$" , "number" , 4000, "mm", "infos/Ln.htm", "varinfoiframe");
vin.b      = new VarInput('b' , "$$$b$$$" , "number" , 300, "mm", "infos/b.htm", "varinfoiframe");
vin.D      = new VarInput('D' , "$$$D$$$" , "number" , 600, "mm", "infos/D.htm", "varinfoiframe");
vin.cover  = new VarInput('cover' , "$$$\\text{Cover}$$$" , "number" , 25, "mm", "infos/cover.htm", "varinfoiframe");
vin.eclass = new VarInput('eclass' , "$$$\\text{E. Class}$$$" , "text" , "A1", "", "infos/eclass.htm", "varinfoiframe",["A1","A2","B1","B2","C1","C2"]);
vin.df     = new VarInput('df' , "$$$d_f$$$" , "number" , 10, "mm", "infos/df.htm", "varinfoiframe",[10, 12, 13, 14, 15, 15, 17, 18, 19, 20]); // TODO: SUPERVISOR Round bars http://www.onesteel.com/products.asp?action=showProduct&productID=52&categoryName=Bar%20Sections
vin.rhoc   = new VarInput('rhoc', "$$$\\rho_c$$$" , "number" , 2400, "kg/m&#179;", "infos/rhoc.htm", "varinfoiframe");
vin.fc     = new VarInput('fc' , "$$$f_c$$$" , "number" , 32, "MPa", "infos/fc.htm", "varinfoiframe",[20, 25, 32, 40, 50, 65, 80, 100]);
for(var i in vin){
	vin[i].appendTo(document.querySelector("#invardivdiv"));
	vin[i].on("change",mainUpdateListener);
}


var vin_tips = new ProTips(document.querySelector("#protips"));
vin_tips.add(vin.b.body,"test")









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





///////////////    SETUP REO MANAGER     /////////////////////

var rman = new ReoManager(document.querySelector("#reorows"));
rman.on("change",mainUpdateListener);




///////////////    SETUP REO MANAGER     /////////////////////
// Create global beam object
var b = new Beam();
function intakeBeamValues(){
	b.Ln		= vin.Ln.value;
	b.b		= vin.b.value;
	b.D		= vin.D.value;
	b.cover	= vin.cover.value;
	b.eclass	= vin.eclass.value;
	b.df		= vin.df.value;
	b.rhoc	= vin.rhoc.value;
	b.fc		= vin.fc.value;
	b.reo		= rman.value;
}

function clearCalculations(){
	var calculationdiv = document.querySelector("#calcdivcontent");
	calculationdiv.innerHTML = "";
	var but = document.createElement("button");
	but.innerHTML = "Click here to show the Calculation Process";
	but.onclick = function(){
		outputCalculations()
	}
	calculationdiv.appendChild(but);
}




var cs_canvas = document.querySelector("#crosssectioncanvas");
var cs_ctx = cs_canvas.getContext('2d');

mainUpdateListener()
function mainUpdateListener(e){
	//DoValidation(); // see validation.js
	var arr = [];
	for(var i in vin){
		var v = vin[i].getValidity()
		if(v.error.length>0){
			arr = arr.concat(v.error);
		}
	}
	vin_tips.setError(arr);
	
	
	intakeBeamValues();
	//outputCalculations();
	clearCalculations();
	outputReoSummary();
	drawCrossSection(cs_ctx,b)
}




//##################################################################3
//##### Tooltips ###################################################3
//##################################################################3





function addTooltipTo(d, output){
	var els = d.querySelectorAll("*");
	for(var i = 0;i<els.length;i++){
		if(els[i].webkitShadowRoot!=null){
			addTooltipTo(els[i].webkitShadowRoot, output);
			//console.log(els[i]);
		}else if(els[i].getAttribute("data-tooltip")){
			
			els[i].output = output;
			
			els[i].addEventListener("mouseover",function(e){
				var targ = e.target; 
				while(targ.getAttribute("data-tooltip")===null){
					targ=targ.parentNode;
				}
				var ttb = this.output;
				ttb.innerHTML = "Pro-tip: "+targ.getAttribute("data-tooltip");
			}.bind(els[i]));
			
			els[i].addEventListener("mouseout",function(e){
				var ttb = this.output;
				ttb.innerHTML = "";
			}.bind(els[i]));
		}
	}
}

//##########################################################
//#### iFrame Scroll behaviour #############################
//##########################################################

var scroll_disabled = false;
document.querySelector("#varinfoiframe").addEventListener("mouseover",function(e){
	try{
		if(e.target.contentDocument.body.scrollHeight> e.target.contentDocument.body.clientHeight){
			scroll_disabled = true;
		}
	}catch(e){
		//	console.warn("iFrame Scroll prevention doesnt work :(");
		//fail silently
	}
});
document.querySelector("#varinfoiframe").addEventListener("mouseout",function(e){
	scroll_disabled = false;
	document.querySelector("#varinfoiframe").style.borderColor="";
});
document.body.addEventListener("mousewheel",function(e){
	if(scroll_disabled){
		e.preventDefault();
		try{
			document.querySelector("#varinfoiframe").style.borderColor="orange";
			setTimeout(function(){
				document.querySelector("#varinfoiframe").style.borderColor="";
			},200);
		}catch(e){
			//	console.warn("iFrame Scroll prevention doesnt work :(");
			// fail silently
		}
	}
});
