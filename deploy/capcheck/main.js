
///* drawBeam.js
///~ spreadsheetdata/Data.js

///////////////////////////////////////////////////////////////////////////////////////
//		Build UI
///////////////////////////////////////////////////////////////////////////////////////

var ui = {};

// TODO: Fitment diameter
ui.physdiv	= document.querySelector("#physdiv");
ui.matdiv	= document.querySelector("#matdiv");
ui.reodiv	= document.querySelector("#reodiv");
ui.c1div	= document.querySelector("#c1div");


ui.reodiv.appendChild(makeReoInput("4"));
ui.reodiv.appendChild(makeReoInput("3"));
ui.reodiv.appendChild(makeReoInput("2"));
ui.reodiv.appendChild(makeReoInput("1"));
ui.reodiv.appendChild(makeReoInput("0"));



// Initial Physical property input boxes
ui.physdiv.appendChild(makeStandardInput("Ln"));
ui.physdiv.appendChild(makeStandardInput("b"));
ui.physdiv.appendChild(makeStandardInput("D"));
ui.physdiv.appendChild(makeStandardInput("cover"));
ui.physdiv.appendChild(makeStandardInput("eclass"));


// Initial material properties input boxes
ui.matdiv.appendChild(makeStandardInput("rhoc"));
ui.matdiv.appendChild(makeStandardInput("fc"));
ui.matdiv.appendChild(makeStandardInput("fsy"));
ui.matdiv.querySelector("#fsy").disabled = true;
ui.matdiv.appendChild(makeStandardInput("reoclass"));
ui.matdiv.querySelector("#reoclass").disabled = true;


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
	inp.type = "text";
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
	console.log(elem.id)
	elem.querySelector("table").id = "reo"+id;
	elem.querySelectorAll("td")[0].innerHTML = id;


	return elem;
}

function getBarsFromArea(a,fitwidth){
	// TODO: verify minimum bar spacing
	var minbarspacing = 20;
	var maxbars = 30;
	var ndia = [10,	12,		16,		20,		24,		28,		32,		36,		40];
	var area = [78,	113,	201,	314,	452,	616,	804,	1020,	1260];
	// search for closest area
	var n = 1;
	var d = area.length-1;
	var result = []
	for(;d>=0;d--){
		for(n=1;n<maxbars;n++){
			if(area[d]*n>a){
				result.push(n+"N"+ndia[d]+" - "+(area[d]*n)+"mm^2");
				break;
			}
		}
	}
	return result;
}




var canvas_csect	= document.getElementById("canvas_csect");
var ctx_csect		= canvas_csect.getContext('2d');

var canvas_elevation	= document.getElementById("canvas_elevation");
var ctx_elevation		= canvas_elevation.getContext('2d');

////////////////////////////////////////////////////////////////////////////////////////////////
//// UPDATE EVENT //////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

update();
function update(evt){
	var b = getBeamDetails();
	window.beam = b;

	
	drawCrossSection(ctx_csect, b);
	drawElevation(ctx_elevation,b);
	
}


function getBeamDetails(){
	function getIdType(obj, id, datatype){
		switch(datatype){
			case "float":
				obj[id] = parseFloat(document.getElementById(id).value);
				break
			case "int":
				obj[id] = parseInt(document.getElementById(id).value);
				break
			case "string":
			default:
				obj[id] = document.getElementById(id).value;
		}
	}
	function getReoInput(b,id){
		var row = document.getElementById(id);
		var reo = {};
		reo.area	= parseInt(row.querySelectorAll("input")[1].value);
		reo.offset	= parseInt(row.querySelectorAll("input")[0].value);
		reo.from 	= row.querySelector("select").value;
		if(b.reo == undefined){
			b.reo = [];
		}
		b.reo.push(reo);
	}

	
	var b = {};
	getIdType(b, "D"		, "int");
	getIdType(b, "b"		, "int");
	getIdType(b, "cover"	, "int");
	getIdType(b, "rhoc"		, "int");
	getIdType(b, "fc"		, "int");
	getIdType(b, "Ln"		, "int");
	getReoInput(b,"reo0");
	b.reoclass = "N";
	//
    //
	b.alpha_2	= Math.min(0.85,Math.max(0.67, 1 - b.fc*0.003)) || "";
	b.gamma		= Math.min(0.85,Math.max(0.67,1.05-b.fc*0.007)) || "";
	//console.log(b);
	
	document.getElementById("alpha2").value	= Math.round(b.alpha_2*1000)/1000;
	document.getElementById("gamma").value	= Math.round(b.gamma*1000)/1000;

	return b;
}
function updateUI(b){
	
}


/////////////////////////////////////////////////////////////////////////////////////
// RESIZE EVENT /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("resize",resize);
resize();
function resize(e){
	var st = window.getComputedStyle(canvas_csect.parentElement);
	canvas_csect.width = parseInt(st.width);
	canvas_csect.height = Math.min(parseInt(st.width),400);


	var st = window.getComputedStyle(canvas_elevation.parentElement);
	canvas_elevation.width = parseInt(st.width);
	canvas_elevation.height = 100;

	update();
}