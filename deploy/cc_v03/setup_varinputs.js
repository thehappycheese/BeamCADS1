
///* varinput.js
var vin = {};









vin.Ln     = new VarInput('Ln' , "$$$L_n$$$" , "number" , 4000, "mm", "infos/Ln.htm", "varinfoiframe");
vin.b      = new VarInput('b' , "$$$b$$$" , "number" , 300, "mm", "infos/b.htm", "varinfoiframe");
vin.D      = new VarInput('D' , "$$$D$$$" , "number" , 600, "mm", "infos/D.htm", "varinfoiframe");
vin.cover  = new VarInput('cover' , "$$$\\text{Cover}$$$" , "number" , 25, "mm", "infos/cover.htm", "varinfoiframe");
vin.eclass = new VarInput('eclass' , "$$$\\text{E. Class}$$$" , "text" , "A1", "", "infos/eclass.htm", "varinfoiframe",["A1","A2","B1","B2","C1","C2"]);
vin.df     = new VarInput('df' , "$$$d_f$$$" , "number" , 10, "mm", "infos/df.htm", "varinfoiframe",[10, 12, 16, 20, 24, 28, 32, 36, 40]);
vin.rhoc   = new VarInput('rhoc', "$$$\\rho_c$$$" , "number" , 2400, "kg/m&#179;", "infos/rhoc.htm", "varinfoiframe");
vin.fc     = new VarInput('fc' , "$$$f_c$$$" , "number" , 32, "MPa", "infos/fc.htm", "varinfoiframe",[20, 25, 32, 40, 50, 65, 80, 100]);




vin.Ln





vin.b.validate = function(e){
	//var e = {value:this.value, error:[], warning:[], info:[]};
	if(e.value%5!==0){
		e.error.push("b should be a rounded to the nearest 5mm");
	}
	if(e.value<100){
		e.value=100;
	}
	if(e.value>3000){
		e.value=3000;
	}
	return e;
}


