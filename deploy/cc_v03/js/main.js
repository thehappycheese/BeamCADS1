///* drawBeam.js
///* Beam.js
///* varinput.js
///* validation.js
///* reoinput.js
///* ReoManager.js
///* ProTips.js









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


var vin_tips = new ProTips(document.querySelector("#invar_protips"));
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

var reo_tips = new ProTips(document.querySelector("#reo_protips"));
reo_tips.grab(reo_tips.body.parentElement);

reo_tips.addElemSelector(rman.body,".more","Add more reo to this layer. <i>Layers touching the top or bottom may have more than 2 bars.</i>");
reo_tips.addElemSelector(rman.body,".less","Remove some reo from this layer. <i>Layers touching the top or bottom may have more than 2 bars.</i>");
reo_tips.addElemSelector(rman.body,".enabled","Enable/Disable this layer");
reo_tips.addElemSelector(rman.body,".area","Cross section area of this layer");
reo_tips.addElemSelector(rman.body,".offset","Space between this layer and the next");
reo_tips.addElemSelector(rman.body,".from","Placement of the reo."); // TODO make this better.
reo_tips.addElemSelector(rman.body,".selected","Include this area in the 'Sum/Avg' column below");




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


function outputCalculations(){

	function f(n, did){
		if(typeof n == "number" && !isNaN(n)){
			return n.toFixed(did || 0)
		}else{
			return "--"
		}
	}
	var calc = [];
	calc.push("alpha2: "	+b.alpha2.toFixed(2)		);
	calc.push("gamma: "	+b.gamma.toFixed(2)		);
	calc.push("");
	
	calc.push("d: (Centroid depth of tensile steel) "	+f(b.Ts_centroid_depth)+" mm"		);
	calc.push("k: "	+f(b.k,3)+""		);
	
	
	calc.push("dn: "	+f(b.dn)+" mm"		);
	calc.push("Muo: "	+f(b.Muo)+" kNm");
	calc.push("MINIMUMS: Muo_min: "	+f(b.Muo_min)+" kNm  OR Ast_min: "+f(b.Muo_min_Ast_min)+" mm^2");
	calc.push("");
	
	calc.push("Ag: "	+f(b.Ag)+" mm^2");
	calc.push("Ast: "	+f(b.Ast)+" mm^2");
	calc.push("Asc: "	+f(b.Asc)+" mm^2");
	calc.push("Acc: "	+f(b.Acc)+" mm^2");
	calc.push("Ixx: "	+f(b.Ixx)+" mm^4");
	calc.push("Ze: "	+f(b.Ze)+" mm^3");
	
	calc.push("Tensile reo ratio (Ast/Ag): "	+(b.p*100).toFixed(3)+"%");
	calc.push("");
	
	calc.push("Ts: "	+f(b.Ts)		);
	calc.push("Cs: "	+f(b.Cs)		);
	calc.push("Cc: "	+f(b.Cc)		);
	calc.push("");
	
	calc.push("Ts_centroid_depth: "	+ f(b.Ts_centroid_depth)		);
	calc.push("Cs_centroid_depth: "	+ f(b.Cs_centroid_depth)		);
	calc.push("Cc_centroid_depth: "	+ 	  f(b.Cc_centroid_depth)		);
	calc.push("");
	
	document.querySelector("#calcdivcontent").innerHTML = calc.join("<br>");
	
	
	var o = document.createElement("pre");
	
	o.innerHTML = "Beam Information "+JSON.stringify(b,undefined,4);
	
	document.querySelector("#calcdivcontent").appendChild(o);
	
	
}

function outputReoSummary(){
	// TODO: fix this bs :(
	return
	var rm = document.querySelector("reo-manager");
	var om = document.querySelector("reo-output");
	var rs = rman.selected_value;
	if(rs.length == 0){
		om.clear();
		om.oneLables();
		return;
	}else if(rs.length>1){
		om.avgLables();
	}else{
		om.oneLables();
	}
	
	
	var area = 0;
	var depth_times_area = 0;
	var number = 0;
	var length = 0;
	var mass = 0;
	var tforce = 0;
	
	for(var i = 0;i<rs.length;i++){
		area += rs[i].area;
		depth_times_area += rs[i].depth*rs[i].area;
		number += rs[i].number;
		length += rs[i].number*b.Ln/1000;
		mass += rs[i].number*b.Ln/1000*rs[i].mass_per_meter;
		tforce += b.layer_force_from_layer_dn(rs[i], b.dn);
	}
	
	// TODO: remove the "Amount:" lable and lable individualy.
	// TODO: fix output styles to prevent column resizing
	// TODO: have a current column and sum column??
	
	om.setIdContent("depth", (depth_times_area/area).toFixed(0) || 0);
	om.setIdContent("area", area);
	om.setIdContent("number", number);
	om.setIdContent("length", length.toFixed(1));
	om.setIdContent("mass", mass.toFixed(1));
	om.setIdContent("tforce", tforce.toFixed(1));
	
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
	outputCalculations();
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
