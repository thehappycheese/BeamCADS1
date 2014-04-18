"use strict";
///~ ../jslib/Vector.js
///* widgets/widgets.js
///* Beam.js

// Create global beam object
var b = new Beam();
function intakeBeamValues(){
	b.Ln		= document.getElementById("Ln").value;
	b.b			= document.getElementById("b").value;
	b.D			= document.getElementById("D").value;
	b.cover		= document.getElementById("cover").value;
	b.eclass	= document.getElementById("eclass").value;
	b.df		= document.getElementById("df").value;
	b.rhoc		= document.getElementById("rhoc").value;
	b.fc		= document.getElementById("fc").value;
	b.reo		= document.getElementById("reomanagerelement").value;
}

function intakeBeamReo(){
	var rm = document.querySelector("reo-manager");
	console.log(rm.getEnabledRows())
}
(function _attatch_input_listners(){
	// attach event listeners to inputs
	var inps = document.querySelectorAll("reo-manager, x-input");
	for(var i = 0;i < inps.length;i++){
		inps[i].addEventListener("update",mainUpdateListener);
	}
})();
function mainUpdateListener(e){
	intakeBeamValues();
	document.querySelector("#calcdivcontent").innerHTML= b.dn;
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
		console.warn("iFrame Scroll prevention doesnt work :(");
	}
});
document.querySelector("#varinfoiframe").addEventListener("mouseout",function(e){
	scroll_disabled = false;
});
document.body.addEventListener("mousewheel",function(e){
	if(scroll_disabled){
		e.preventDefault();
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
	if(_current_help_url != url){
		_current_help_url = url;
		document.querySelector("#varinfoiframe").contentWindow.location.replace(url);
	}
}


var ifrm = document.querySelector("#varinfoiframe");
var rm = document.querySelector("reo-manager");