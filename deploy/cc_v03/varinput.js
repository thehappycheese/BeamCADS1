
function VarInput(id,notation,type,value,anchor_href,anchor_target){
	this._id = id;
	this._notation = notation;
	this._type = type;
	this._value = value;
	this._href = anchor_href;
	this._target = anchor_target;
	
	
	
	
	this.buildInterface = function(){
		this.body = document.createElement("div");
		this.body.className = "varinput";
		this.notationDiv = document.createElement("a");
		this.notationDiv.className = "varinput-notation-div";
		this.valueDiv = document.createElement("div");
		this.valueDiv.className = "varinput-value-div";
		this.unitDiv = document.createElement("div");
		this.unitDiv.className = "varinput-unit-div";
		
		this.valueInput = document.createElement("input");
		this.unitSelect = document.createElement("select");
		
		this.valueDiv.appendChild(this.valueInput);
		this.unitDiv.appendChild(this.unitSelect);
		
		this.body.appendChild(this.notationDiv);
		this.body.appendChild(this.valueDiv);
		this.body.appendChild(this.unitDiv);
		
		this.notationDiv.innerHTML = this._notation;
		this.notationDiv.href		= this._href;
		this.notationDiv.target	= this._target;
		
		
		
		
	}.bind(this);
	
	
	this.type_units = {
		"mass":[
				{name:"kg", factor:1},
				{name:"N", factor:1/9.80665},
				{name:"kN", factor:1/9.80665/1000},
			],
		"density":[
				{name:"kg/m^3", factor:1},
				{name:"kN/m^3", factor:1/9.80665},
				{name:"kN", factor:1/9.80665/1000},
			],
		"length":[
				{name:"mm", factor:1},
				{name:"m", factor:1000},
			],
		"Pressure":[
				{name:"Pa", factor:1/1000},
				{name:"MPa", factor:1},
				{name:"GPa", factor:1000},
			],
		"time":[
				{name:"s", factor:1},
				{name:"min", factor:60},
				{name:"hr", factor:60*60},
				{name:"days", factor:60*60*24},
			],
		"number":[
				{name:"", factor:1},
			],
		"text":[
				{name:"", factor:null},
			],
	}
	
	this.configureInput = function(){
		var units = this.type_units[this._type];
		for(var i=0;i<units.length;i++){
			var li = document.createElement("option");
			li.innerHTML = units[i].name;
			li.value = units[i].factor;
			if(i==0){
				li.selected = true;
			}
			this.unitSelect.appendChild(li);
		}
		if(this._type=="text"){
			this.valueInput.type = "text";
		}else{
			this.valueInput.type = "number";
		}
		
		this.valueInput.value = this._value;
	}.bind(this);
	
	this.configureEvents = function(){
		this.valueInput.addEventListener("click",function(e){
			e.cancelBubble = true;
		});
	}.bind(this);
	
	
	
	
	
	
	
	Object.defineProperty(this,"value",{
		get:function(){
			if(this._type == "text"){
				return this.valueInput.value+"";
			}else{
				return Math.round(parseFloat(this.valueInput.value)*parseFloat(this.unitSelect.value));
			}
		}.bind(this),
		set:function(newval){
			this.valueInput.value = newval;
		}.bind(this)
	});
	
	
	
	
	
	
	
	
	
	this.buildInterface();
	this.configureInput();
	this.configureEvents();
}

























