




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
		this.tips_div.innerHTML = "Pro-tip: "+this.tip_from_target(t);
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
	
	
}