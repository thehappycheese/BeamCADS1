var calcs = {};
function outputCalculations(){
	var calculationdiv = document.querySelector("#calcdivcontent");
	calculationdiv.innerHTML = "";
	function format(value, decimals){
		if(typeof value == "number" && !isNaN(value)){
			return n.toFixed(decimals || 0)
		}else{
			return "--"
		}
	}
	var calc = [];
	calc.push("alpha2: "	+b.alpha2.toFixed(2)		);
	calc.push("gamma: "	+b.gamma.toFixed(2)		);
	calc.push("");
	
	
	var b_dn= b.dn;
	
	
	
	
	
	
	// ALPHA 2;
	calcs.alpha2 = calcs.alpha2 || new CalcDiv();
	calcs.alpha2.title = "$$$\\alpha_2 ~~=~~ "+b.alpha2.toFixed(2)+"$$$";
	calcs.alpha2.content = "";
	calcs.alpha2.addParagraph("From As3600 Section 8.1.3(ii)")//Verify
	calcs.alpha2.addParagraph("$$$\\begin{aligned}\\alpha_2 &= 1.0 - 0.003 f'_c \\\\"+
								"&= 1.0-0.003\\times "+b.fc.toFixed(0)+"\\\\"+
								"&= "+(1-0.003*b.fc).toFixed(2)+"\\end{aligned}$$$")//Verify
	calcs.alpha2.addParagraph("where $$$0.67 \\le \\alpha_2 \\le 0.85 $$$")//Verify
	calcs.alpha2.addParagraph(" &there4; $$$\\alpha_2 = "+b.alpha2.toFixed(2)+" $$$")//Verify
	calcs.alpha2.appendTo(calculationdiv);
	// GAMMA;
	calcs.gamma = calcs.gamma || new CalcDiv();
	calcs.gamma.title = "$$$\\gamma ~~=~~ "+b.gamma.toFixed(2)+"$$$";
	calcs.gamma.content = "";
	calcs.gamma.addParagraph("From As3600 Section 8.1.3(ii)")//Verify
	calcs.gamma.addParagraph("$$$\\begin{aligned}\\gamma &= 1.05 - 0.007 f'_c \\\\ "+
							 "&= 1.05-0.007\\times "+b.fc.toFixed(0)+"\\\\ "+
							 "&=~ "+(1.05-0.007*b.fc).toFixed(2)+"\\end{aligned}$$$")//Verify
	calcs.gamma.addSpace()//Verify
	calcs.gamma.addParagraph("where $$$0.67 \\le \\gamma \\le 0.85 $$$")//Verify
	calcs.gamma.addParagraph(" &there4; $$$\\gamma = "+b.gamma.toFixed(2)+" $$$")//Verify
	calcs.gamma.appendTo(calculationdiv);
	
	
	// TODO: disegaurd bars less than half the diameter of the largets bar!
	//d
	
	calcs.d = calcs.d || new CalcDiv();
	calcs.d.title = "$$$d ~~=~~ "+b.d.toFixed(0)+"$$$";
	calcs.d.content = "";
	calcs.d.addParagraph("d is the depth to the <b>centroid of the tension steel</b> from the upper surface of the beam.")
	//calcs.d.addParagraph("d is found by: (sum of (tension steel layer depth)*(tension steel layer area)) divide by (sum of(tension steel layer area))");
	calcs.d.addParagraph("$$ \\sum{d_i \\times A_{st i}}\\over\\sum{A_{st i}} $$");
	calcs.d.addParagraph("<b>Note:</b> The 'top' reo layer may or may not be in tension! <i>Be sure to check that you assume correctly in hand calculations</i>. (Once you have calculated Depth to Neutral Axis (dn), all layers below dn are in tension.)")
	
	var sum_dast_sym = "";
	var sum_dast_val = "";
	var sum_dast_res = 0;
	
	var sum_ast_sym = "";
	var sum_ast_val = "";
	var sum_ast_res = 0;
	var discluded_layers = [];
	
	for(var i = 0;i<b.reo.length;i++){
		
		if(b.layer_strain_from_layer_dn(b.reo[i],b_dn)<=0){
			discluded_layers.push(i);
			continue;
		}
		
		sum_dast_sym += "d_"+i+" "+"A_{st "+i+"}";
		sum_dast_val += b.reo[i].depth.toFixed(0)+" \\times "+b.reo[i].area.toFixed(0);
		sum_dast_res +=b.reo[i].depth*b.reo[i].area

		sum_ast_sym += "A_{st "+i+"}";
		sum_ast_val += b.reo[i].area+"";
		sum_ast_res += b.reo[i].area;
		
		if(i!=b.reo.length-1){
			sum_dast_sym+="~+~";
			sum_dast_val+="~+~";
			sum_ast_sym+="~+~";
			sum_ast_val+="~+~";
		}
	}
	calcs.d.addParagraph("$$\\begin{aligned} d &= {{"+sum_dast_sym+"}\\over{"+sum_ast_sym+"}} \\\\ &= {{"+sum_dast_val+"}\\over{"+sum_ast_val+"}}\\\\ &= {{"+(sum_dast_res/sum_ast_res).toFixed(0)+"}}mm\\end{aligned}$$")
	if(discluded_layers.length){
		calcs.d.addParagraph("<b>Note:</b> layers  <b>"+discluded_layers.join(", ")+"</b> are compressive and have been excluded.");
	}
	calcs.d.appendTo(calculationdiv);
	
	
	// DN; =============================================
	calcs.dn = calcs.dn || new CalcDiv();
	calcs.dn.appendTo(calculationdiv);
	calcs.dn.title = "$$$d_n ~~=~~ "+b.dn.toFixed(0)+"$$$";
	calcs.dn.content = "";
	// TODO simplify this shiz
	calcs.dn.addParagraph("Depth to neutral axis (dn) is calculated by the 'Rectangular Stress Block' Method.")
	calcs.dn.addParagraph("To find this depth imagine a see-saw with the Concrete Compression (Cc) on one side and the Steel Tension (Ts) on the other side. We must find the point on the see-saw where these two forces balance.");
	calcs.dn.addParagraph("That is $$$ C_c = T_s $$$ in other words $$$\\sum F_x = 0$$$");
	calcs.dn.addParagraph("To find $$$dn_n$$$, solve the equilibrium of horizontal forces in the beam cross section:");
	calcs.dn.addParagraph("The equations are developed as follows:");
	calcs.dn.addParagraph("$$\\sum F_x = C_c + C_s + (-T_s) = 0$$");
	calcs.dn.addParagraph("Where...");
	calcs.dn.addParagraph("$$\\begin{aligned} C_c &= \\alpha_2 f'_c \\times (b)(\\gamma d_n) \\\\ "+
							"T_s &= E_s \\sum(\\epsilon_{s i} A_{s i}) &\\text{for tensile steel layers}\\\\"+
							"C_s &= E_s \\sum(\\epsilon_{s i} A_{s i}) &\\text{for compressive steel layers}\\end{aligned}$$");
	calcs.dn.addParagraph("Where...");
		// d_n - epsilon_si ====================================
		calcs.esi = calcs.esi || new CalcDiv(); // Create
		calcs.esi.appendTo(calcs.dn.contentdiv);// Append
		calcs.esi.title = "$$$\\epsilon_{si} = 0.003 ({{d_i}/{d_n}} - 1)$$$";
		calcs.esi.addParagraph("$$$\\epsilon_{si}$$$ is the strain of each layer of steel.");
		calcs.esi.addParagraph("It is calculated by similar triangles from the following diagram.");
	
	calcs.dn.addParagraph("Thus, the full equations are as follows:")
	
	// d_n - C_c
	var fe = [] // create a temporary array to hold the next few lines of calcs
	fe.push("C_c &= "+b.alpha2.toFixed(2)+"\\times"+b.fc.toFixed(0)+"\\times("+b.b.toFixed(0)+")("+b.gamma.toFixed(2)+"\\times d_n"+")")
	
	
	// TODO: add units to all calcs
	var T_s = [];
	var C_s = [];
	
	var T_s_sym = [];
	var C_s_sym = [];
	
	// d_n - T_s & C_s
	for(var i = 0;i<b.reo.length;i++){
		
		if(b.layer_strain_from_layer_dn(b.reo[i],b_dn)<=0){
			// compression
			// numeric
			var e_si = "0.003("+b.reo[i].depth.toFixed(0)+"/{d_n} - 1)";
			C_s.push("["+e_si+"]\\times"+b.reo[i].area.toFixed(0))
			// symbolic
			var e_si = "0.003(d_+{"+i+"}+/{d_n} - 1)";
			C_s_sym.push("["+e_si+"]\\times A_{s"+i+"}")
		}else{
			// tension
			// numeric
			var e_si = "0.003("+b.reo[i].depth.toFixed(0)+"/{d_n} - 1)";
			T_s.push("["+e_si+"]\\times"+b.reo[i].area.toFixed(0))
			// symbolic
			var e_si = "0.003(d_{"+i+"}/{d_n} - 1)";
			T_s_sym.push("["+e_si+"]\\times A_{s"+i+"}")
		}

		
		
	}
	fe.push("T_s &= E_s \\times ("+((T_s.length>0)?T_s.join("+"):"0")+")")
	fe.push("C_s &= E_s \\times ("+((C_s.length>0)?C_s.join("+"):"0")+")")
	calcs.dn.addParagraph("$$\\begin{aligned}"+fe.join("\\\\")+"\\end{aligned}$$");
	
		
	
	
	
	
	
	
	
	
	
	
	
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,calculationdiv]);
	return;
}

function outputReoSummary(){
	// TODO: fix this bs :(
	return
	var rm = document.querySelector("reo-manager");
	var om = document.querySelector("reo-output");
	var rs = rman.selected_value;
	if(rs.length == 0){
		om.clear();
		om.oneLables();
		return;
	}else if(rs.length>1){
		om.avgLables();
	}else{
		om.oneLables();
	}
	
	
	var area = 0;
	var depth_times_area = 0;
	var number = 0;
	var length = 0;
	var mass = 0;
	var tforce = 0;
	
	for(var i = 0;i<rs.length;i++){
		area += rs[i].area;
		depth_times_area += rs[i].depth*rs[i].area;
		number += rs[i].number;
		length += rs[i].number*b.Ln/1000;
		mass += rs[i].number*b.Ln/1000*rs[i].mass_per_meter;
		tforce += b.layer_force_from_layer_dn(rs[i], b.dn);
	}
	
	// TODO: remove the "Amount:" lable and lable individualy.
	// TODO: fix output styles to prevent column resizing
	// TODO: have a current column and sum column??
	
	om.setIdContent("depth", (depth_times_area/area).toFixed(0) || 0);
	om.setIdContent("area", area);
	om.setIdContent("number", number);
	om.setIdContent("length", length.toFixed(1));
	om.setIdContent("mass", mass.toFixed(1));
	om.setIdContent("tforce", tforce.toFixed(1));
	
}