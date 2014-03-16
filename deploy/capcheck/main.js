
///* drawBeam.js
///~ spreadsheetdata/Data.js
// Build UI


var ff=document.getElementById("canvas_csect").getContext('2d')
var ui = {};
ui.physdiv	= document.querySelector("#physdiv");
ui.matdiv	= document.querySelector("#matdiv");
ui.reodiv	= document.querySelector("#reodiv");
ui.c1div	= document.querySelector("#c1div");


ui.reodiv.appendChild(makeReoInput("2:"));
ui.reodiv.appendChild(makeReoInput("1:"));
ui.reodiv.appendChild(makeReoInput("0:"));



// Initial Physical property input boxes
ui.physdiv.appendChild(makeStandardInput("Ln"));
ui.physdiv.appendChild(makeStandardInput("b"));
ui.physdiv.appendChild(makeStandardInput("D"));
ui.physdiv.appendChild(makeStandardInput("cover"));


// Initial material properties input boxes
ui.matdiv.appendChild(makeStandardInput("rhoc"));
ui.matdiv.appendChild(makeStandardInput("fc"));
ui.matdiv.appendChild(makeStandardInput("fsy"));
ui.matdiv.appendChild(makeStandardInput("reoclass"));


// Calculated coefficients
ui.c1div.appendChild(makeStandardInput("alpha2"));
ui.c1div.appendChild(makeStandardInput("gamma"));
ui.c1div.appendChild(makeStandardInput("dn"));
ui.c1div.appendChild(makeStandardInput("dn"));
ui.c1div.appendChild(makeStandardInput("d"));
ui.c1div.appendChild(makeStandardInput("ku"));


function makeStandardInput(id){
	var dat = data_AS3600Variables({id:id});
	var t = document.querySelector("#text-input");
	
	t.content.querySelector("td").innerHTML = dat.first().unicode+":";
	t.content.querySelectorAll("td")[2].innerHTML = dat.first().unit;
	var inp = t.content.querySelector("input");
	inp.value = dat.first().default;
	inp.id = id;
	
	
	t.content.querySelector("table").title = dat.first().name+"\n"+dat.first().description;
	
	
	
	var elem = document.importNode(t.content,true);
	inp = elem.querySelector("input");
	inp.addEventListener("keyup",update);
	inp.addEventListener("mouseup",update);
	
	return elem
}

function makeReoInput(id){
	var t = document.querySelector("#reo-input");

	var elem = document.importNode(t.content,true);

	elem.querySelectorAll("td")[0].innerHTML = id;


	return elem;
	
}





var canvas = document.getElementById("canvas_csect");
update();
function update(evt){
	var b = {};
	window.b = b;
	b.add = function(nm,type){
		switch(type){
			case "float":
				this[nm] = parseFloat(document.getElementById(nm).value);
				break
			case "int":
				this[nm] = parseInt(document.getElementById(nm).value);
				break
			case "string":
			default:
				this[nm] = document.getElementById(nm).value;
		}
	}.bind(b);
	
	b.add("D",			"int");
	b.add("b",			"int");
	b.add("cover",		"int");
	b.add("rhoc",		"int");
	b.add("fc",			"int");
	//
	//b.add("d0",		"int");
	//b.add("d1",		"int");
	//b.add("d2",		"int");
	//b.add("d3",		"int");
	//b.add("A_st0",	"int");
	//b.add("A_st1",	"int");
	//b.add("A_st2",	"int");
	//b.add("A_st3",	"int");
	//
    //
	b.alpha_2	= Math.min(0.85,Math.max(0.67, 1 - b.fc*0.003)) || "";
	b.gamma		= Math.min(0.85,Math.max(0.67,1.05-b.fc*0.007)) || "";
	//console.log(b);
	
	document.getElementById("alpha2").value	= Math.round(b.alpha_2*1000)/1000;
	document.getElementById("gamma").value		= Math.round(b.gamma*1000)/1000;
	
	

	
	var ctx = canvas.getContext('2d');
	

	
	drawBeam(ctx, b);
	
}

window.addEventListener("resize",resize);
resize();
function resize(e){
	var st = window.getComputedStyle(canvas.parentElement);
	
	canvas.width = parseInt(st.width)-10;
	canvas.height = Math.min(parseInt(st.width)-10,400);
	update();
}




function input(id, lable, type, postfix, value){
	
	var inp = document.createElement("input");
	inp.placeholder = "??";
	inp.type = type || "text";
	inp.id = id;
	inp.addEventListener("keyup",update);
	inp.addEventListener("mouseup",update);
	inp.value = value || "";
	
	var lableElem = document.createElement("lable");
	var prefix = document.createTextNode(lable+" =");
	var postfix = document.createTextNode(postfix);
	
	lableElem.appendChild(prefix);
	lableElem.appendChild(inp);
	lableElem.appendChild(postfix);
	
	return lableElem;
}