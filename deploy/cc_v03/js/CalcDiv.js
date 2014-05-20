
///* EventDispatcher.js



function CalcDiv(){
	EventDispatcher.call(this);
	
	this.body;
	this.topdiv;
	this.contentdiv;
	
	this._collapsed = false;
	
	
	
	
	this.init = function(){
		
		
		this.body = document.createElement("div");
		this.body.className = "CalcDiv";
		this.topdiv = document.createElement("div");
		this.topdiv.className = "topdiv";
		this.contentdiv = document.createElement("div");
		this.contentdiv.className = "contentdiv";
		
		this.titlediv = document.createElement("div");
		this.titlediv.className = "titlediv";
		
		this.minmaxbutton = document.createElement("button");
		this.minmaxbutton.className = "minmaxbutton";
		this.minmaxbutton.innerHTML = "+";
		this.minmaxbutton.title = "Show workings."
		
		
		this.topdiv.appendChild(this.minmaxbutton);
		this.topdiv.appendChild(this.titlediv);
		
		this.body.appendChild(this.topdiv);
		this.body.appendChild(this.contentdiv);
		
		
		this.collapsed = true;
		
		
	}.bind(this);
	
	
	var _listeners_registered = false;
	this.registerEvents = function(){
		if(!_listeners_registered){
			_listeners_registered = true;
			this.topdiv.addEventListener("click",function(e){
				this.collapsed = !this.collapsed;
			}.bind(this),false);
		}
	}.bind(this);
	
	
	
	this.appendTo = function(dom){
		dom.appendChild(this.body);
		this.registerEvents();
	}.bind(this);
	
	
	Object.defineProperty(this,"collapsed",{
		get:function(){
			return this._collapsed;
		}.bind(this),
		set:function(newval){
			this._collapsed = newval;
			this.contentdiv.style.display = (newval)? "none" : "";
			if(newval){
				this.minmaxbutton.innerHTML = "+";
			}else{
				this.minmaxbutton.innerHTML = "-";
			}
		}.bind(this)
	})
	
	Object.defineProperty(this,"title",{
		get:function(){
			return this.titlediv.innerHTML;
		}.bind(this),
		set:function(newval){
			this.titlediv.innerHTML = newval;
		}.bind(this)
	})
	
	Object.defineProperty(this,"content",{
		get:function(){
			return this.contentdiv.innerHTML;
		}.bind(this),
		set:function(newval){
			this.contentdiv.innerHTML = newval;
		}.bind(this)
	})
	
	this.addParagraph = function(content){
		var newp = document.createElement("p");
		newp.innerHTML = content;
		this.contentdiv.appendChild(newp);
	}.bind(this);
	
	this.addSpace = function(){
		var newp = document.createElement("div");
		newp.style.height = "5px";
		this.contentdiv.appendChild(newp);
	}.bind(this);
	
	this.addElement = function(element){
		this.contentdiv.appendChild(element);
	}.bind(this);
	
	
	
	this.init();
}