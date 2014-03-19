
///* drawBeam.js
///~ spreadsheetdata/Data.js

///////////////////////////////////////////////////////////////////////////////////////
//		Build UI  /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

var canvas_csect	= document.getElementById("canvas_csect");
var ctx_csect		= canvas_csect.getContext('2d');

var canvas_elevation	= document.getElementById("canvas_elevation");
var ctx_elevation		= canvas_elevation.getContext('2d');

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
ui.matdiv.appendChild(makeStandardInput("dfitments"));


// Calculated coefficients
ui.c1div.appendChild(makeStandardInput("alpha2"));
ui.c1div.appendChild(makeStandardInput("gamma"));
ui.c1div.appendChild(makeStandardInput("dn"));
ui.c1div.appendChild(makeStandardInput("dn"));
ui.c1div.appendChild(makeStandardInput("d"));
ui.c1div.appendChild(makeStandardInput("ku"));





//////////////////////////////////////////////////////////////////////////////////////////////////////////
////  UI BUILDING HELPERS  ///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
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
	elem.querySelector("table").id = "reo"+id;
	elem.querySelectorAll("td")[0].innerHTML = id;

	var inputs = elem.querySelectorAll('input[type="text"], input:not([type]), select');
	for(i=0;i<inputs.length;i++){
		var listen = function(e){
			var row = e.target.parentElement.parentElement;
			var areaspan = row.querySelector("span");
			var barcode = row.querySelectorAll("input")[1].value;
			var bararea = getReoObjectFromBarcode(barcode).a;
			if(isNaN(bararea)){
				row.querySelectorAll("input")[1].style.color="red";
				areaspan.innerHTML = "";
			}else{
				row.querySelectorAll("input")[1].style.color="black";
				areaspan.innerHTML = bararea;
			}
			
			update();
		}
		inputs[i].addEventListener("mouseup",listen);
		inputs[i].addEventListener("keyup"	,listen);
		inputs[i].addEventListener("change"	,listen);
	};

	var morebut = elem.querySelectorAll('input[type="button"]')[1];
	morebut.addEventListener("mouseup", function(e){
		var row = e.target.parentElement.parentElement;
		var area = parseInt(row.querySelector("span").innerHTML)+1||1;
		// TODO: get the beam's width to do this.
		var barobj = getReoObjectFromArea(area,beam.b-2*(beam.cover+beam.dfitments));
		row.querySelectorAll("input")[1].value = barobj.n+"N"+barobj.d;
		if(row.querySelectorAll("input")[0].value == ""){
			row.querySelectorAll("input")[0].value = 0;
		}
		row.querySelectorAll("input")[1].dispatchEvent(new Event("change"));
		
	});

	// TODO: implement less than button

	return elem;
}





//////////////////////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS /////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
function getReoObjectFromArea(a, fitwidth){
	
	// TODO: subject this function to further testing
	// TODO: rework this function to do a search in a list. This will be better for finding the next lowest/next highest


	// TODO: List this as a design assumption:

	// AS3600+A2 8.1.9 Spacing of tendons
	// AS3600+A2 17.1.3 has a shpeel about all the ways concete shoul be handeled and how it should minimise air gaps etc.
	// 20mm is a reasonable number since it is a nominal aggregate size
	var minbarspacing = 20;

	// AS3600+A2 8.1.9 Spacing of tendons: max 300 on tension face. never allow less than 2 bars.
	var minnumberofbars = Math.max(2,Math.ceil((beam.b-2*(beam.cover+beam.dfitments))/300));
	console.log("minbars",minnumberofbars);
	var maxbars = 10;
	// AS4671 Table 5A in section 7
	var ndia = [10,	12,		16,		20,		24,		28,		32,		36,		40];
	var area = [78,	113,	201,	314,	452,	616,	804,	1020,	1260];
	// search for closest area
	var n = 1;
	var d = area.length-1;
	var result = []
	for(;d>=0;d--){
		n = Math.max(minnumberofbars,Math.ceil(a/area[d]));
		if(n<maxbars && ndia[d]*n+minbarspacing*(n-1)<fitwidth){
			// There are not too many bars, and the number of bars fits within the required width
			result.push({n:n,d:ndia[d],a:area[d]*n});
		}
	}
	// Sort by area
	result.sort(function(a,b){
		// 50mm^2 is median difference in the available areas for less than 10 bars
		// If the difference between areas is less than 50 and the number of bars is less, reverse the sort decision
		if(a.a>b.a){
			if(a.a>b.a-50 && b.n<a.n){
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	});
	// TODO: implement maximum spacing
	return result[0];
}
function getReoObjectFromBarcode(barcode){
	var bs = barcode.split("N");
	
	if(bs.length<1){
		throw new Error("Bar-code should be specified in the format \"2N12\". not: "+barcode);
	}
	
	var ndia = [10,	12,		16,		20,		24,		28,		32,		36,		40];
	var area = [78,	113,	201,	314,	452,	616,	804,	1020,	1260];
	var result = {}
	result.d = parseInt(bs[1]);
	result.n = parseInt(bs[0]);
	result.a = area[ndia.indexOf(result.d)]*result.n;
	return result;
}





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
		var layer = getReoObjectFromBarcode(row.querySelectorAll("input")[1].value);
		layer.o = parseInt(row.querySelectorAll("input")[0].value);
		layer.f = row.querySelectorAll("select")[0].value;
		if(b.reo == undefined){
			b.reo = [];
		}
		b.reo.push(layer);
	}

	
	var b = {};
	getIdType(b, "D"		, "int");
	getIdType(b, "b"		, "int");
	getIdType(b, "cover"	, "int");
	getIdType(b, "rhoc"		, "int");
	getIdType(b, "fc"		, "int");
	getIdType(b, "Ln"		, "int");
	getIdType(b, "dfitments", "int");
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