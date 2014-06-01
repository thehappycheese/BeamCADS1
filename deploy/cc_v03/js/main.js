///* drawBeam.js
///* Beam.js

///* validation.js
///* reoinput.js
///* ReoManager.js
///* ProTips.js
///* CalcDiv.js
///* HelpBar.js

///* main.function.outputCalculations.js

///* main.code.setupVatiableInputs.js




///////////////  HELP BAR SETUP  /////////////////////////// 


var helpBar  = new HelpBar("varinfodiv")


///////////////    SETUP TOOLTIPS     /////////////////////

var vin_tips = new ProTips(document.querySelector("#protips"));
vin_tips.add(vin.b.body,"test")

///////////////    SETUP REO MANAGER     /////////////////////

var rman = new ReoManager(document.querySelector("#reorows"));
rman.on("change",mainUpdateListener);

///////////////    SETUP BEAM OBJECT     /////////////////////
// Create global beam object
var b = new Beam();
function intakeBeamValues(){
	b.Ln		= vin.Ln.value;
	b.b		= vin.b.value;
	b.D		= vin.D.value;
	b.cover	= vin.cover.value;
	b.eclass	= vin.eclass.value;
	b.df		= vin.df.value;
	b.rhoc	= vin.rhoc.value;
	b.fc		= vin.fc.value;
	b.reo		= rman.value;
}





/////////////////// SETUP CANVAS VARIABLES //////////////////////////////

var cs_canvas = document.querySelector("#crosssectioncanvas");
var cs_ctx = cs_canvas.getContext('2d');


///////////////////// MAIN UPDATE LISTENER  /////////////////////////////
mainUpdateListener()
function mainUpdateListener(e){
	//DoValidation(); // see validation.js
	var arr = [];
	for(var i in vin){
		var v = vin[i].getValidity()
		if(v.error.length>0){
			arr = arr.concat(v.error);
		}
	}
	vin_tips.setError(arr);
	
	
	intakeBeamValues();
	//outputCalculations();
	clearCalculations();
	outputReoSummary();
	drawCrossSection(cs_ctx,b)
}













///////////// CLEAR CALCULATION DIV HELPER FINCTION ////////////////
function clearCalculations(){
	var calculationdiv = document.querySelector("#calcdivcontent");
	calculationdiv.innerHTML = "";
	var but = document.createElement("button");
	but.innerHTML = "Click here to show the Calculation Process";
	but.onclick = function(){
		outputCalculations()
	}
	calculationdiv.appendChild(but);
}