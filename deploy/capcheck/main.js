
///* drawBeam.js
// Build UI
var ui = {};
ui.physdiv = document.querySelector("#physdiv");
ui.matdiv = document.querySelector("#matdiv");
ui.reodiv = document.querySelector("#reodiv");



// Initial Physical property input boxes
ui.physdiv.appendChild(input("B"	, "number","mm",10000));
ui.physdiv.appendChild(input("D"	, "number","mm",1000));

ui.physdiv.appendChild(input("cover"	, "number","mm",30));

ui.physdiv.appendChild(input("d"	, "number","mm"));
ui.physdiv.appendChild(input("d_n"	, "number","mm"));

ui.physdiv.appendChild(input("k_u"	, "number",""));

// Initial material properties input boxes
ui.matdiv.appendChild(input("roh_c"	, "number","kg/m^3"));
ui.matdiv.appendChild(input("f'_c"	, "number","MPa"));
ui.matdiv.appendChild(input("f_sy"	, "number","MPa"));
ui.matdiv.appendChild(input("reoclass","number","N or L"));





handleUserInput();
function handleUserInput(evt){
	var b = {};
	b.D = parseInt(getInp("D"));
	b.B = parseInt(getInp("B"));
	b.cover = parseInt(getInp("cover"));
	var canvas = document.getElementById("canvas_csect");
	var ctx = canvas.getContext('2d');
	drawBeam(ctx, b);
	
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
	inp.addEventListener("keyup",handleUserInput);
	inp.value = value || "";
	
	var lable = document.createElement("lable");
	var prefix = document.createTextNode(namestr+" =");
	var postfix = document.createTextNode(postfix);
	
	lable.appendChild(prefix);
	lable.appendChild(inp);
	lable.appendChild(postfix);
	
	return lable;
}