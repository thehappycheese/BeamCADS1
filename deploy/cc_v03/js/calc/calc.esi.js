///* ../CalcDiv.js



if(calc===undefined) var calc = {};

calc.esi = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		this.title = '<a href="#help_bar_esi">&epsilon;<sub>si</sub></a> = '+b.dn.toFixed(0)+' mm';
	}.bind(this);
	
	this.update = function(){
		
		this.updateTitle();
		var para = function(str){
			return '<p>'+str+'</p>';
		}
		
		var str1 = "";
		str1+= para("// TODO: esi block");

		
		
		
		
		
		
		
		this.content =  str1;
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
