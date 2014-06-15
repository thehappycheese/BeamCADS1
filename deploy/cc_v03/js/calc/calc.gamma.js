
///* ../CalcDiv.js
if(calc===undefined) var calc = {};

calc.gamma = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	this.updateTitle = function(){
		this.title = "$$$\\gamma ~~=~~ "+b.gamma.toFixed(2)+"$$$<br> test";
	}
	
	this.update = function(){
		this.clear();
		this.updateTitle();
		
		this.addParagraph("From AS3600 Section 8.1.3(ii)")//Verify
		this.addParagraph("$$$\\begin{aligned}\\gamma &= 1.05 - 0.007 f'_c \\\\ "+
								 "&= 1.05-0.007\\times "+b.fc.toFixed(0)+"\\\\ "+
								 "&=~ "+(1.05-0.007*b.fc).toFixed(2)+"\\end{aligned}$$$")//Verify
		this.addSpace()//Verify
		this.addParagraph("where $$$0.67 \\le \\gamma \\le 0.85 $$$")//Verify
		this.addParagraph(" &there4; $$$\\gamma = "+b.gamma.toFixed(2)+" $$$")//Verify
	}.bind(this);
})();