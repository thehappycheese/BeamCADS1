




function ProTips(arg_body){
	this.body = arg_body;
	this.tips_div = this.body.querySelector(".tips");
	this.feedback_div = this.body.querySelector(".feedback");
	
	
	this.tips = [];
	
	
	this.add = function(target, tip){
		this.tips.push({target:target, tip:tip});
		target.addEventListener("mouseover",this.over);
		target.addEventListener("mouseout",this.out);
	}.bind(this);
	this.addElemSelector = function(elem,selector,tip){
		var els = elem.querySelectorAll(selector);
		for(var i = 0; i<els.length; i++){
			this.add(els[i],tip);
		}
	}.bind(this);
	this.tip_from_target = function(target){
		for(var i = 0; i<this.tips.length; i++){
			if(this.tips[i].target === target) return this.tips[i].tip;
		}
		return undefined;
	}.bind(this);
	
	this.over	= function(e){
		var t = e.target;
		while(this.tip_from_target(t) === undefined && t !== document.body){
			t = t.parentElement;
		}
		this.tips_div.innerHTML = this.tip_from_target(t);
	}.bind(this);
	this.out		= function(e){
		this.tips_div.innerHTML = "";
	}.bind(this);
	
	
	this.add(this.body,"Roll your mouse over something to get a tooltip here!");
	
	this.grab = function(elem){
		var els = elem.querySelectorAll("*");
		for(var i = 0;i<els.length;i++){
			if(els[i].getAttribute("data-tooltip")){
				this.add(els[i],els[i].getAttribute("data-tooltip"));
			}
		}
	}.bind(this);
	
	this.setError=function(error_list,warning_list){
		var out = ""
		if(error_list && error_list.length>0){
			out += '<ul class="errorlist"><li>'+error_list.join("</li><li>")+'</li></ul>';
		}
		if(warning_list && warning_list.length>0){
			out += '<ul class="warninglist"><li>'+warning_list.join("</li><li>")+'</li></ul>';
		}
		this.feedback_div.innerHTML = out;
	}.bind(this);
	
	this.updateMathJax = function(){
		if(document.body.contains(this.body)){
			try{
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.body]);
			}catch(e){
				// Fail silently
			}
		}
	}.bind(this);
	
	
}