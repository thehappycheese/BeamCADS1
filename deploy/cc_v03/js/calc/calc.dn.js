///* ../CalcDiv.js
///* ../Beam.drawStressBlock.js

if(calc===undefined) var calc = {};

calc.dn = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		//&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (<a href="#help_bar_dn">Depth to Neutral Axis</a>)'
		this.title = '$$$\\href{#help_bar_dn}{d_n} = '+b.dn.toFixed(0)+' mm$$$';
		this.updateMathJax();
	}.bind(this);
	
	this.update = function(){
		
		this.updateTitle();
		var para = function(str){
			return '<p>'+str+'</p>';
		}
		
		var str1 = "";
		str1+= para("Depth to neutral axis ($$$\\href{#help_bar_dn}{d_n}$$$) is calculated by the 'Rectangular Stress Block' Method. This involves solving the internal horizontal forces in the beam:");

		str1 += '<canvas class="dncanvas" width="450" height="300">Canvas not shown</canvas>';
		
		
		
		str1 += para("$$$\\begin{aligned}\\alpha_2 &= 1.0 - 0.003 f'_c \\\\"+
						"&= 1.0-0.003\\times "+b.fc.toFixed(0)+"\\\\"+
						"&= "+(1-0.003*b.fc).toFixed(2)+"\\end{aligned}$$$");
		
		
		
		
		
		
		this.content =  str1;
		b.drawStressBlock(this.contentdiv.querySelector("canvas").getContext('2d'))
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
