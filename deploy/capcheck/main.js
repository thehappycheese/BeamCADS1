
///* drawBeam.js
// Build UI
var ui = {};
ui.physdiv = document.querySelector("#physdiv");
ui.matdiv = document.querySelector("#matdiv");
ui.reodiv = document.querySelector("#reodiv");



// Initial Physical property input boxes
ui.physdiv.appendChild(input("B"	, "number","mm",300));
ui.physdiv.appendChild(input("D"	, "number","mm",600));

ui.physdiv.appendChild(input("cover"	, "number","mm",30));

ui.physdiv.appendChild(input("d"	, "number","mm"));
ui.physdiv.appendChild(input("d_n"	, "number","mm"));

ui.physdiv.appendChild(input("k_u"	, "number",""));

// Initial material properties input boxes
ui.matdiv.appendChild(input("roh_c"	, "number","kg/m^3", 2400));
ui.matdiv.appendChild(input("f'_c"	, "number","MPa", 32));
ui.matdiv.appendChild(input("f_sy"	, "number","MPa", 500));
ui.matdiv.appendChild(input("reoclass","text","N or L", "N"));




var canvas = document.getElementById("canvas_csect");
update();
function update(evt){
	var b = {};
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
	
	b.add("D","int");
	b.add("B","int");
	b.add("cover","int");
	b.add("roh_c","int");
	b.add("f'_c","int");
	
	b.add("d0","int");
	b.add("d1","int");
	b.add("d2","int");
	b.add("d3","int");
	b.add("A_st0","int");
	b.add("A_st1","int");
	b.add("A_st2","int");
	b.add("A_st3","int");
	
	b.D = parseInt(getInp("D"));
	b.B = parseInt(getInp("B"));
	b.cover = parseInt(getInp("cover"));
	

	
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







function input(namestr, type, postfix,value){
	
	var inp = document.createElement("input");
	inp.placeholder = "??";
	inp.type = type || "text";
	inp.id = namestr;
	inp.addEventListener("keyup",update);
	inp.addEventListener("mouseup",update);
	inp.value = value || "";
	
	var lable = document.createElement("lable");
	var prefix = document.createTextNode(namestr+" =");
	var postfix = document.createTextNode(postfix);
	
	lable.appendChild(prefix);
	lable.appendChild(inp);
	lable.appendChild(postfix);
	
	return lable;
}