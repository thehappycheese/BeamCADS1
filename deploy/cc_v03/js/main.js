

///* function.dim.js

///* Beam.drawSection.js

///* reoinput.js
///* ReoManager.js
///* ProTips.js
///* CalcDiv.js
///* HelpBar.js


// Order matters for these ones :(
///* main.function.outputCalculations.js
///* main.code.setupVatiableInputs.js




///////////////  HELP BAR SETUP  ///////////////////////////
var helpBar  = new HelpBar("varinfodiv")


///////////////    SETUP TOOLTIPS     /////////////////////
var ttips = new ProTips(document.querySelector("#protips"));

ttips.add(vin.b.body,"Breadth or Width of beam.");
ttips.add(vin.D.body,"Depth or height of beam.");
ttips.add(vin.cover.body,"Distance from outer surface to the steel embedded in the beam.");
ttips.add(vin.eclass.body,"Exposure Classification. A designation of the harshness of the beam's enviroment. <b>See AS3600 Table 4.3</b>");
ttips.add(vin.df.body,"Diameter of 'fitments' which make up the 'ribcage' of the beam. This software uses <b>Standard Round Bar Diameters</b>");
ttips.add(vin.fc.body,"The concrete strength (standard grades only. See AS3600 3.1.1.1)");


///////////////    SETUP BEAM OBJECT     /////////////////////
// Create global beam object
var b = new Beam();

///////////////    SETUP REO MANAGER     /////////////////////
var rman = new ReoManager(document.querySelector("#reorows"), b);
rman.on("change",mainUpdateListener);








/////////////////// SETUP CANVAS VARIABLES //////////////////////////////

var cs_canvas = document.querySelector("#crosssectioncanvas");
var cs_ctx = cs_canvas.getContext('2d');


///////////////////// MAIN UPDATE LISTENER  /////////////////////////////
mainUpdateListener()
function mainUpdateListener(e){
	
	
	intakeBeamValues();
	
	document.querySelector("#reosumarea").innerHTML = b.As || "";
	//outputCalculations();
	clearCalculations();
	b.drawSection(cs_ctx);
	
	
	
	var err_list = [];
	var war_list = [];
	for(var i in vin){
		var v = vin[i].getValidity()
		err_list = err_list.concat(v.error);
		war_list = war_list.concat(v.warning);
	}
	var rs = rman.getEnabledRows()
	for(var i = 0; i<rs.length; i++){
		var v = rs[i].getValidity(b.dn);
		err_list = err_list.concat(v.error);
		war_list = war_list.concat(v.warning);
	}
	ttips.setError(err_list, war_list);
	
}


function intakeBeamValues(){
	//b.Ln		= vin.Ln.value;
	b.b			= Math.max(150, vin.b.value) || 200;
	b.D			= Math.max(150, vin.D.value) || 300;
	b.cover		= Math.max(5, vin.cover.value);
	b.eclass	= vin.eclass.value;
	b.df		= vin.df.value;
	//b.rhoc	= vin.rhoc.value;
	b.fc		= vin.fc.value;
	b.reo		= rman.value;
	
	for(var i in vin){
		vin[i].update_validity();
	}
	for(var i in rman.rows){
		rman.rows[i].update_validity();
	}
}









///////////// CLEAR CALCULATION DIV HELPER FINCTION ////////////////
function clearCalculations(){
	var calculationdiv = document.querySelector("#calcdiv-content");
	calculationdiv.innerHTML = "";
	var but = document.createElement("button");
	but.innerHTML = "Click here to show the Calculation Process";
	but.onclick = function(){
		outputCalculations()
	}
	calculationdiv.appendChild(but);
}