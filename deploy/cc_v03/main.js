"use strict";
///~ ../jslib/Vector.js
///* widgets/widgets.js
///* drawBeam.js
///* Beam.js
///* validation.js

///* varinput.js
var i1 = new VarInput('b',"$$$(f'_c)$$$","mm","number",300,"infos/b.htm","varinfoiframe");
i1.appendTo(document.querySelector("#invardivdiv"));


// Create global beam object
var b = new Beam();
function intakeBeamValues(){
	b.Ln		= parseInt(document.getElementById("Ln").value);
	b.b			= parseInt(document.getElementById("b").value);
	b.D			= parseInt(document.getElementById("D").value);
	b.cover		= parseInt(document.getElementById("cover").value);
	b.eclass	= document.getElementById("eclass").value;
	b.df		= parseInt(document.getElementById("df").value);
	b.rhoc		= parseInt(document.getElementById("rhoc").value);
	b.fc		= parseInt(document.getElementById("fc").value);
	b.reo		= document.getElementById("reomanagerelement").value;
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
	calc.push("dn: "	+f(b.dn)		);
	calc.push("Muo: "	+f(b.Muo)		);
	
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
	var rm = document.querySelector("reo-manager");
	var om = document.querySelector("reo-output");
	var rs = rm.selected_value;
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


(function _attatch_input_listners(){
	// attach event listeners to inputs
	var inps = document.querySelectorAll("reo-manager, x-input");
	for(var i = 0;i < inps.length;i++){
		inps[i].addEventListener("update",mainUpdateListener);
	}
})();
setTimeout(mainUpdateListener,500);
function mainUpdateListener(e){
	DoValidation(); // see validation.js
	intakeBeamValues();
	outputCalculations();
	outputReoSummary();
}


//###########################################################################################
//###### Canvas resize events ###############################################################
//###########################################################################################
window.addEventListener("resize",handleResize);
setTimeout(handleResize,500);
setTimeout(handleResize,1500);
setTimeout(handleResize,5000);
setTimeout(handleResize,10000);
function handleResize(e){
	var c=document.querySelector("#crosssectioncanvas");
	
	var st=window.getComputedStyle(c.parentElement);
	c.width = Math.min(500,parseInt(st.width));
	c.height = 300;
	
	var c=document.querySelector("#elevationcanvas");
	
	var st=window.getComputedStyle(c.parentElement);
	c.width = parseInt(st.width);
	c.height = 150;
	
	// TODO: Update drawing
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