///~ ../jslib/Vector.js
///* widgets/widgets.js
///* Beam.js


//###########################################################################################
//###### Canvas resize events ###############################################################
//###########################################################################################
window.addEventListener("resize",handleResize);
setTimeout(handleResize,500);
setTimeout(handleResize,1500);
setTimeout(handleResize,5000);
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
//###### Reo input/output helpers ###########################################################
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
	this.output = output;
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
//#### Contextual Help View ################################
//##########################################################

(function(){
	var xins = document.querySelectorAll("x-input");
	for(i=0;i<xins.length;i++){
		xins[i].addEventListener("mousedown",function(e){
			setHelpLoc("infos/"+e.target.id+".htm");
		})
	}
})()

function setHelpLoc(url){
	if(document.querySelector("#varinfoiframe").getAttribute("src") != url){
		document.querySelector("#varinfoiframe").contentWindow.location.replace(url);
	}
}
var ifrm = document.querySelector("#varinfoiframe");