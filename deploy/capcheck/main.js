
///* drawBeam.js
///~ spreadsheetdata/Data.js
///* Beam.js

///////////////////////////////////////////////////////////////////////////////////////
//		Build UI  /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

var canvas_csect	= document.getElementById("canvas_csect");
var ctx_csect		= canvas_csect.getContext('2d');

var canvas_elevation	= document.getElementById("canvas_elevation");
var ctx_elevation		= canvas_elevation.getContext('2d');

var mb = new Beam();
mb.init();
mb.update();




//////////////////////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS /////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////







////////////////////////////////////////////////////////////////////////////////////////////////
//// UPDATE EVENT //////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

update();
function update(evt){
	return
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
	getReoInput(b,"reo1");
	getReoInput(b,"reo2");
	getReoInput(b,"reo3");
	getReoInput(b,"reo4");
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