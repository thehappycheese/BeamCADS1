///* ../CalcDiv.js
///* calc.esi.js


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
						"		 C_s &= \\href{#help_bar_Cs}{\\text{Compression in Steel}}			&= E_s \\sum(\\epsilon_{s i} A_{s i}) \\\\"+
						"		 T_s &= \\href{#help_bar_Ts}{\\text{Tension in Steel}}				&= E_s \\sum(\\epsilon_{s i} A_{s i})\\\\"+
						"		\\\\"+
						"\\epsilon_{s i} &= \\text{Strain in reo layer i} &= 0.003 ({{d_i}/\\color{green}{d_n}} - 1) \\\\"+
						"E_s &= \\href{#help_bar_Es}{\\text{Young's Modulus of Steel}} &= 200000MPa"+
						"\\end{aligned}$$");
		
		str1 += para("The only unknown variable here is $$$\\color{green}{d_n}$$$.");
		

		
		this.content =  str1;
		
		calc.esi.appendTo(this.contentdiv);
		
		
		
		
		
		
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
