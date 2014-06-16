///* ../CalcDiv.js
if(calc===undefined) var calc = {};

calc.alpha2 = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		this.title = '<table style="width:100%;"><tr><td>$$$\\alpha_2 ~~=~~ '+b.alpha2.toFixed(2)+"$$$</td><td>"+
		"$$$\\gamma ~~=~~ "+b.gamma.toFixed(2)+"$$$"+
		"</td></tr></table>";
	}.bind(this);
	
	this.update = function(){
		this.clear();
		this.updateTitle();
		
		
		this.addParagraph("From AS3600 Section 8.1.3(b)(ii)")
		this.addParagraph("$$$\\begin{aligned}\\alpha_2 &= 1.0 - 0.003 f'_c \\\\"+
								"&= 1.0-0.003\\times "+b.fc.toFixed(0)+"\\\\"+
								"&= "+(1-0.003*b.fc).toFixed(2)+"\\end{aligned}$$$");
		this.addParagraph("where $$$0.67 \\le \\alpha_2 \\le 0.85 $$$");
		this.addParagraph(" &there4; $$$\\alpha_2 = "+b.alpha2.toFixed(2)+" $$$");
	}.bind(this);

})();