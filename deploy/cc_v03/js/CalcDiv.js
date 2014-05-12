
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
		
		this.body.appendChild(this.topdiv);
		this.body.appendChild(this.contentdiv);
		
		
		this.collapsed = true;
		
		
	}.bind(this);
	
	this.registerEvents = function(){
		this.topdiv.addEventListener("click",function(e){
			this.collapsed = !this.collapsed;
		}.bind(this));
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
		}.bind(this)
	})
	
	Object.defineProperty(this,"title",{
		get:function(){
			return this.topdiv.innerHTML;
		}.bind(this),
		set:function(newval){
			this.topdiv.innerHTML = newval;
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
	
	this.addParagraph = function(conent){
		var newp = document.createElement("p");
		newp.innerHTML = content;
		this.contentdiv.appendChild(newp);
	}.bind(this);
	this.addElement = function(element){
		this.contentdiv.appendChild(element);
	}.bind(this);
	
	
	
	this.init();
}