///* ../CalcDiv.js
if(calc===undefined) var calc = {};

calc.checks = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	this.updateTitle = function(){
		this.title = 'Final Checks';
	}.bind(this);
	
	this.update = function(){
		
		this.content = "";
		
		
		
		
		
		// TODO: Highlight error bar and this ones title if there is a problem
		
		
		
		

		this.addParagraph(
						"Muo_min = " + b.Muo_min
		);
		this.addParagraph(
						"kuo > 0.36 within limits"
		);
		this.addParagraph(
						"This software does not check serviceability requirements."
		);
		this.addParagraph(
						"Here are some values to help out <br>"+
						"I_g = " + b.Ig + "<br>"+
						"Ze = " + b.Ze + "<br>"
		);
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
