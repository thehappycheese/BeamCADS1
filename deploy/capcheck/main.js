
///* drawBeam.js
// Build UI
var ui = {};
ui.physdiv	= document.querySelector("#physdiv");
ui.matdiv	= document.querySelector("#matdiv");
ui.reodiv	= document.querySelector("#reodiv");
ui.c1div	= document.querySelector("#c1div");



// Initial Physical property input boxes
ui.physdiv.appendChild(input("B"	,"B", 		"number","mm",300));
ui.physdiv.appendChild(input("D"	,"D", 		"number","mm",600));

ui.physdiv.appendChild(input("cover","Cover",	"number","mm",30));

ui.physdiv.appendChild(input("d"	, "d",		"number","mm"));
ui.physdiv.appendChild(input("d_n"	, "d_n",	"number","mm"));

ui.physdiv.appendChild(input("k_u"	, "k_u",	"number",""));

// Initial material properties input boxes
ui.matdiv.appendChild(input("roh_c"	, "r",		"number","kg/m^3", 2400));
ui.matdiv.appendChild(input("f'_c"	, "f'c",	"number","MPa", 32));
ui.matdiv.appendChild(input("f_sy"	, "f_sy",	"number","MPa", 500));
ui.matdiv.appendChild(input("reoclass","Reo Class",	"text","N or L", "N"));

// Calculated coefficients
ui.c1div.appendChild(input("alpha_2",	"al",	"number","", ""));
ui.c1div.appendChild(input("gamma",		"gam",	"number","", ""));




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
	
	b.add("D",		"D",		"int");
	b.add("B",		"B",		"int");
	b.add("cover",	"Cover",	"int");
	b.add("roh_c",	"\u03A1",	"int");
	b.add("fc",		"f'c",		"int");
	
	b.add("d0",		"int");
	b.add("d1",		"int");
	b.add("d2",		"int");
	b.add("d3",		"int");
	b.add("A_st0",	"int");
	b.add("A_st1",	"int");
	b.add("A_st2",	"int");
	b.add("A_st3",	"int");
	
	b.D = parseInt(getInp("D"));
	b.B = parseInt(getInp("B"));
	b.cover = parseInt(getInp("cover"));

	b.alpha_2	= Math.min(0.85,Math.max(0.67, 1 - b["f'_c"]*0.003));
	b.gamma		= Math.min(0.85,Math.max(0.67,1.05-b["f'_c"]*0.007));
	console.log(b);
	
	document.getElementById("alpha_2").value	= Math.round(b.alpha_2*1000)/1000;
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







function getInp(varname){
	var element = document.getElementById(varname);
	return element.value;
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