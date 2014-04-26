"use strict";
///~ ../jslib/Vector.js
////* drawBeam.js
///* Beam.js
///* varinput.js
///* setup_varinputs.js
///* validation.js
///* reoinput.js
///* ReoManager.js

var rman = new ReoManager(document.querySelector("#reorows"));
rman.on("change",mainUpdateListener);


for(var i in vin){
	vin[i].appendTo(document.querySelector("#invardivdiv"));
	vin[i].on("change",mainUpdateListener);
}


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

	function f(n){
		if(typeof n == "number" && !isNaN(n)){
			return n.toFixed(0)
		}else{
			return "--"
		}
	}
	var calc = [];
	calc.push("alpha2: "	+b.alpha2.toFixed(2)		);
	calc.push("gamma: "	+b.gamma.toFixed(2)		);
	calc.push("");
	
	calc.push("dn: "	+f(b.dn)+" mm"		);
	calc.push("Muo: "	+f(b.Muo)+" kNm");
	calc.push("Muo min: "	+f(b.Muo_min)+" kNm");
	calc.push("Ast min (Alternative to meeting Muo_min): "	+f(b.Muo_min_Ast_min)+" mm^2");
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


mainUpdateListener()
function mainUpdateListener(e){
	DoValidation(); // see validation.js
	intakeBeamValues();
	outputCalculations();
	outputReoSummary();
}




//###########################################################################################
//###### validation error text box ###########################################################
//###########################################################################################
function setErrorList(list){
	if(list===undefined || list.length==0){
		document.querySelector("#errortr").style.display="none";
	}else{
		document.querySelector("#errortr").style.display="";
		var out = '<h1 style="color:darkred;">Error</h1>'
		for(var i = 0;i<list.length;i++){
			out+="<p>"+list[i]+"</p>";
		}
		document.querySelector("#errortd").innerHTML = out;
	}
}
//##################################################################3
//##### Tooltips ###################################################3
//##################################################################3
setTimeout(function(){
	addTooltipTo(document.querySelector("#invardiv"),document.querySelector("#invardivtooltipbar"));
	addTooltipTo(document.querySelector("#reoinputoutputdiv"),document.querySelector("#reoinputoutputtooltipbar"));
},1500);
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


//##########################################################
//#### Contextual Help View ################################
//##########################################################

(function(){
	var xins = document.querySelectorAll("x-input");
	for(var i = 0;i<xins.length;i++){
		xins[i].addEventListener("mousedown",function(e){
			setHelpLoc("infos/"+e.target.id+".htm");
		})
	}
})()
var _current_help_url = "";
function setHelpLoc(url){
	// console.log(_current_help_url,document.querySelector("#varinfoiframe").contentWindow.location.pathname)
	// console.log(document.querySelector("#varinfoiframe").getAttribute("src"),url)
	// console.log(_current_help_url === document.querySelector("#varinfoiframe").contentWindow.location.pathname)
	// console.log(document.querySelector("#varinfoiframe").getAttribute("src") === url)
	if(document.querySelector("#varinfoiframe").contentWindow.location.pathname !== _current_help_url ||
			document.querySelector("#varinfoiframe").getAttribute("src")!==url){
		
		document.querySelector("#varinfoiframe").onload = function(){
			_current_help_url = document.querySelector("#varinfoiframe").contentWindow.location.pathname;
		};
		document.querySelector("#varinfoiframe").setAttribute("src",url);
	}
}


var ifrm = document.querySelector("#varinfoiframe");
var rm = document.querySelector("reo-manager");