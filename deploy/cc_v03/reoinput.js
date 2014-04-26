

function ReoInput(){
	
	this._enabled = false;
	
	
	this.create = function(){
		this.body = document.createElement("tr");
		this.body.className = "reoinput";
		this.body.innerHTML = 
		'<td><input type="checkbox" class="enabled"></td>\
		<td><input class="barcode" required value="2N10"\></td>\
		<td><button class="more" tabindex="-1">+</button><button class="less" tabindex="-1">-</button></td>\
		<td class="area">--</td>\
		<td><input type="number" class="offset" /></td>\
		<td><select class="from"><option>lowest</option><option>highest</option></select></td>\
		<td><input type="checkbox" class="selected"/></td>';
		
		this.enabledCheckbox = this.body.querySelector(".enabled");
		this.barcodeInput = this.body.querySelector(".barcode");
		this.moreButton = this.body.querySelector(".more");
		this.lessButton = this.body.querySelector(".less");
		this.areaOutput = this.body.querySelector(".area");
		this.offsetInput = this.body.querySelector(".offset");
		this.fromInput = this.body.querySelector(".from");
		this.selectedCheckbox = this.body.querySelector(".selected");
		
		console.log(this)
		this.enabled = false;
	}.bind(this);
	// ##########################################################################################
	// 			BIND EVENTS
	// ##########################################################################################
	this.appendTo = function(dom){
		dom.appendChild(this.body);
		this.enabledCheckbox.addEventListener("change",function(){
			
		}.bind(this));
	}.bind(this);
	// ##########################################################################################
	// 			GETTER/SETTERS
	// ##########################################################################################
	Object.defineProperty(this,"enabled",{
		get:function(){
			return this._enabled;
		}.bind(this),
		set:function(newval){
			
			this._enabled = newval;
			this.enabledCheckbox.checked = newval;
			
			if(newval == true){
				this.body.style.color = "";
			}else if(newval == false){
				this.body.style.color = "grey";
				this.selected = false;
			}
			
			this.barcodeInput.disabled		= true;
			this.moreButton.disabled		= true;
			this.lessButton.disabled		= true;
			this.areaOutput.disabled		= true;
			this.offsetInput.disabled		= true;
			this.fromInput.disabled			= true;
			this.selectedCheckbox.disabled	= true;
			
			this.update();
		}.bind(this),
	});
	
	
	
	// ##########################################################################################
	// 			UPDATE
	// ##########################################################################################
	
	this.update = function(){
		this.areaOutput.innerHTML = "todo";
	}.bind(this);
	
	
	
	
	this.disable = function (){
		
	}.bind(this);

	

	this.create();
}