///* ../CalcDiv.js
if(calc===undefined) var calc = {};

calc.kuo = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		this.title = '<a href="#help_bar_kuo"> k<sub>uo</sub></a> = '+b.kuo.toFixed(3);
	}.bind(this);
	
	this.update = function(){
	
		var b_kuo = b.kuo
		this.content = "";
		this.addParagraph("$$k_{uo} = \\frac{d_n}{d_o}$$");
		this.addParagraph("Where:");
		this.addParagraph("$$d_o =\\href{#help_bar_do}{\\text{Depth to lowest reo layer from top surface}} = "+b.d0.toFixed(0)+"$$");
		this.addParagraph("$$d_n =\\href{#help_bar_dn}{\\text{Depth to Neutral Axis}} = "+b.dn.toFixed(0)+"$$");
		
		this.addParagraph("Thus:");
		this.addParagraph("$$k_{uo} = "+b_kuo.toFixed(3)+"$$");
		
		
		// TODO: verify!
		if(b_kuo<0.25 || b_kuo>0.36){
			this.addParagraph('<div class="calcerror">ERROR! $$$k_uo$$$ should be more than 0.25 and less than 0.36 (Except for in special conditions.) - See AS3600 8.1.5.</div>');
		}else{
			this.addParagraph("Within limits: $$$k_{uo}$$$ should be more than 0.25 and less than 0.36 (Except for in special conditions.) - See AS3600 8.1.5.");
		}
		
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
