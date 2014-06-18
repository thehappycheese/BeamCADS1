///* ../CalcDiv.js


if(calc===undefined) var calc = {};

calc.dn = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		this.title = '<a href="#help_bar_dn">d<sub>n</sub></a> = '+b.dn.toFixed(0)+' mm';
	}.bind(this);
	
	this.update = function(){
		
		this.updateTitle();
		var para = function(str){
			return '<p>'+str+'</p>';
		}
		
		var str1 = "";
		str1+= para("Depth to neutral axis ($$$\\href{#help_bar_dn}{d_n}$$$) is calculated by the 'Rectangular Stress Block' Method (See the diagram above). This involves solving the internal horizontal forces in the beam:");
		
		
		str1+= para("$$\\sum F_x = C_c + C_s + T_s = 0\\\\~\\\\~\\\\"+
						"\\begin{aligned}"+
						"Where~~ C_c &= \\href{#help_bar_Cc}{\\text{Compression in Concrete}}	&= \\alpha_2f'_c \\times (b)(\\gamma \\color{green}{d_n}) \\\\"+
						"		 C_s &= \\href{#help_bar_Cs}{\\text{Compression in Steel}}			&= E_s \\sum(\\color{brown}{\\epsilon_{s i}} A_{s i}) \\\\"+
						"		 T_s &= \\href{#help_bar_Ts}{\\text{Tension in Steel}}				&= E_s \\sum(\\color{brown}{\\epsilon_{s i}} A_{s i})\\\\"+
						"		\\\\"+
						"b &= \\href{#help_bar_b}{\\text{Breadth of beam}} &= "+b.b+"mm\\\\"+
						"{A_{s i}} &= \\href{#help_bar_As}{\\text{Area of reo in layer i}}\\\\"+
						"\\color{brown}{\\epsilon_{s i}} &= \\href{#help_bar_epsilonsi}{\\text{Strain in reo layer i}} &= 0.003 ({{d_i}/\\color{green}{d_n}} - 1) \\\\"+
						"E_s &= \\href{#help_bar_Es}{\\text{Young's Modulus of Steel}} &= 200000MPa"+
						"\\end{aligned}$$");
		
		str1 += para("The only unknown variable here is $$$\\color{green}{d_n}$$$ and which layers are in tension/compression!");
		
		

		
		this.content = str1;
		
		this.addParagraph("To proceed, take an educated guess as to which layers of reinforcement are in tension and which are in compression. The following workings are prepared with prior knowledge of which layers are in tension/compression. When working manually you have to guess and check if you don't know :(");
		
		
		
		// TODO: this is naughty :O
		b_dn = b.dn;
		
		
		// TODO: add units to all calcs
		var T_s = [];
		var C_s = [];
		
		var T_s_sym = [];
		var C_s_sym = [];
		
		var T_s_simp = [];
		var C_s_simp = [];
		
		///// LOOP THROUGH REO LAYERS  ///////
		// d_n - T_s & C_s ================================
		for(var i = 0;i<b.reo.length;i++){
			var add_to = null;
			var add_to_sym = null;
			if(b.layer_strain_from_layer_dn(b.reo[i],b_dn)<=0){
				// symbolic
				C_s_sym.push("C_{s"+i+"} &= E_s \\times ([0.003( d_{"+i+"} / {\\color{green}{d_n}} - 1 )]\\times A_{s"+i+"})")
				// numeric
				C_s.push("C_{s"+i+"} &= 200000 \\times ([0.003( "+b.reo[i].depth.toFixed(0)+" / {\\color{green}{d_n}} - 1)]\\times "+b.reo[i].area.toFixed(0)+")")
			}else{
				// symbolic
				T_s_sym.push("T_{s"+i+"} &= E_s \\times ([0.003( d_{"+i+"} / {\\color{green}{d_n}} - 1 )]\\times A_{s"+i+"})")
				// numeric
				T_s.push("T_{s"+i+"} &= 200000 \\times ([0.003( "+b.reo[i].depth.toFixed(0)+" / {\\color{green}{d_n}} - 1)]\\times "+b.reo[i].area.toFixed(0)+")")
			}
		}
		
		
		
		
		// Lets create a symbolic representation first:
		var symlines = [] // create a temporary array to hold the next few lines of calcs
		symlines.push("C_c &= (\\alpha_2 f_c)(b \\times \\gamma \\color{green}{d_n})")
		symlines= symlines.concat(C_s_sym);
		symlines = symlines.concat(T_s_sym);

		
		
		// now lets do the numeric representation:
		
		var numlines = [] // create a temporary array to hold the next few lines of calcs
		numlines.push("C_c &= ("+b.alpha2.toFixed(2)+"\\times"+b.fc.toFixed(0)+")("+b.b.toFixed(0)+"\\times"+b.gamma.toFixed(2)+"  \\color{green}{d_n})")
		numlines = numlines.concat(C_s);
		numlines = numlines.concat(T_s);
		
		
		
		
		this.addParagraph("$$\\begin{aligned}"+symlines.join("\\\\")+"\\end{aligned}$$");
		this.addParagraph("Substituting in all the known values:");
		this.addParagraph("$$\\begin{aligned}"+numlines.join("\\\\")+"\\end{aligned}$$");
		
		
		this.addParagraph("Now resubstitute back into the following equation and solve for $$$\\color{green}{d_n}$$$!");
		this.addParagraph("BUT THIS IS WRONG! if the layers have yielded we need to check that the strain of steel never leaves the range -0.0025 to 0.0025");
		this.addParagraph("$$\\sum F_x = C_c + C_s + -T_s = 0$$"); //TODO: check sign convention
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
