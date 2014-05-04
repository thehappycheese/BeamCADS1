
///* EventDispatcher.js

function ReoInput(){
	
	EventDispatcher.call(this);
	
	this.diameters	= [10,	12,		16,		20,		24,		28,		32,		36,		40];
	this.areas		= [78,	113,	201,	314,	452,	616,	804,	1020,	1260];
	this.masses		= [0.632,0.910,1.619,2.528,3.640,4.955,6.471,8.910,10.112];
	
	this.create = function(){
		this.body = document.createElement("tr");
		this.body.className = "reoinput";
		this.body.innerHTML = 
		'<td><input type="checkbox" class="enabled"></td>\
		<td><input class="barcode" required value="2N10"\></td>\
		<td><button class="more" tabindex="-1">+</button><button class="less" tabindex="-1">-</button></td>\
		<td class="area">--</td>\
		<td><input type="number" class="offset" value="0" required/></td>\
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
		
		this.enabled = false;
	}.bind(this);
	// ##########################################################################################
	// 			BIND EVENTS
	// ##########################################################################################
	this.appendTo = function(dom){
		dom.appendChild(this.body);
		this.enabledCheckbox.addEventListener("change",function(e){
			this.enabled = this.enabledCheckbox.checked;
			this.change();
		}.bind(this));
		this.selectedCheckbox.addEventListener("change",function(e){
			this.selected = this.selectedCheckbox.checked;
			this.change();
		}.bind(this));
		this.moreButton.addEventListener("click",function(){
			this.more();
			this.update();
			this.change();
		}.bind(this));
		this.lessButton.addEventListener("click",function(){
			this.less();
			this.update();
			this.change();
		}.bind(this));
		this.offsetInput.addEventListener("change",function(){
			this.update();
			this.change();
		}.bind(this))
		this.offsetInput.addEventListener("input",function(){
			this.update();
			this.change();
		}.bind(this));
		this.fromInput.addEventListener("change",function(){
			this.update();
			this.change();
		}.bind(this))
		
		// BARCODE CHANGE EVENT LISTENERs
		this.barcodeInput.addEventListener("keydown",function(e){
			if(e.keyCode == 38){	// up button
				this.more();
				e.preventDefault();
				this.update();
				this.change();
			}
			if(e.keyCode == 40){	// down button
				this.less();
				e.preventDefault();
				this.update();
				this.change();
			}
		}.bind(this))
		
		this.barcodeInput.addEventListener("change",function(){
			this.update();
			this.change();
		}.bind(this));
		
		this.barcodeInput.addEventListener("input",function(e){
			var val = e.target.value;
			var ss = e.target.selectionStart;
			var se = e.target.selectionEnd;
			var arr = val.split("")
			var flag = false;
			var noN = true;
			for(var i=0;i<arr.length;i++){
				
				if((/[^0-9nN]/).test(arr[i])){
					arr.splice(i--,1);
					;
					if(i<ss){
						ss--;
						se=ss;
					}
				}
				if(arr[i]=="N"){
					noN = false;
				}
			}
			val = arr.join("");
			val = val.toUpperCase();
			e.target.value =  val;
			e.target.setSelectionRange(ss,se);
			this.update();
			this.change();
		}.bind(this))
	}.bind(this);
	// ##########################################################################################
	// 			GETTER/SETTERS
	// ##########################################################################################
	
	//				GET/SET ENABLED
	Object.defineProperty(this,"enabled",{
		get:function(){
			return this.enabledCheckbox.checked;
		}.bind(this),
		set:function(newval){
			
			this.enabledCheckbox.checked = newval;
			
			if(newval == true){
				this.body.style.color = "";
			}else if(newval == false){
				this.body.style.color = "grey";
				this.selected = false;
			}
			
			this.barcodeInput.disabled		= !newval;
			this.moreButton.disabled		= !newval;
			this.lessButton.disabled		= !newval;
			this.areaOutput.disabled		= !newval;
			this.offsetInput.disabled		= !newval;
			this.fromInput.disabled			= !newval;
			this.selectedCheckbox.disabled= !newval;
			
			this.update();
			
		}.bind(this),
	});
	
	//				GET/SET SELECTED
	Object.defineProperty(this,"selected",{
		get:function(){
			return this.selectedCheckbox.checked;
		}.bind(this),
		set:function(newval){
			this.selectedCheckbox.checked = newval;
			this.update();
		}.bind(this),
	});
	
	
	// 			GET/SET barcode
	Object.defineProperty(this,"barcode",{
		get:function(){
			return this.barcodeInput.value;
		}.bind(this),
		set:function(newval){
			this.barcodeInput.value = newval;
			this.update();
		}.bind(this),
	});
	
	// 			GET/SET area
	Object.defineProperty(this,"area",{
		get:function(){
			return this.areas[this.diameters.indexOf(this.diameter)]*this.number || undefined;
		}.bind(this)
	});
	
	
	// 			GET/SET mass_per_meter
	Object.defineProperty(this,"mass_per_meter",{
		get:function(){
			return this.masses[this.diameters.indexOf(this.diameter)]*this.number || undefined;
		}.bind(this)
	});
	
	
	// 			GET/SET diameter
	Object.defineProperty(this,"diameter",{
		get:function(){
			return parseInt(this.barcode.split("N")[1]) || undefined;
		}.bind(this),
		set:function(newval){
			if(this.diameters.indexOf(newval)!==-1){
				this.barcode = this.number + "N" + newval;
			}else{
				console.warn("Invalid assignment to reo-input diameter: "+newval);
			}
		}.bind(this)
	});
	
	
	// 			GET/SET number
	Object.defineProperty(this,"number",{
		get:function(){
			return parseInt(this.barcode.split("N")[0]);
		}.bind(this),
		set:function(newval){
			if(typeof newval == "number" && newval!==NaN && newval!==undefined && newval>=2 && newval<100){
				this.barcode = newval + "N" + this.diameter;
			}else{
				console.warn("Invalid assignment to reo-input number: "+newval);
			}
		}.bind(this)
	});
	
	
	// 			GET/SET OFFSET
	Object.defineProperty(this,"offset",{
		get:function(){
			return parseInt(this.offsetInput.value);
		}.bind(this),
		set:function(newval){
			this.offsetInput.value = Math.abs(Math.round(parseFloat(newval)));
			this.update();
		}.bind(this),
	});
	
	
	// 			GET/SET FROM
	Object.defineProperty(this,"from",{
		get:function(){
			return this.fromInput.value;
		}.bind(this),
		set:function(newval){
			this.fromInput.value = newval;
			this.update();
		}.bind(this),
	});
	
	
	
	// ##########################################################################################
	// 			UPDATE
	// ##########################################################################################
	
	this.update = function(){
		this.areaOutput.innerHTML = this.area || "--";
		this.dispatch("update",this);
	}.bind(this);
	this.change = function(){
		this.dispatch("change",this);
	}.bind(this);
	
	
	
	// ##########################################################################################
	// 			HELPERS
	// ##########################################################################################
	this.makeFirstRow = function(){
		this.enabled = true;
		this.enabledCheckbox.disabled = true;
		this.offsetInput.disabled = true;
		this.fromInput.disabled = true;
		this.offsetInput.style.visibility = "hidden";
		this.fromInput.style.visibility = "hidden";
	}.bind(this);
	
	// ##########################################################################################
	// 			MORE AND LESS HELPER FUNCTIONS
	// ##########################################################################################
	
	
	this.more = function(){
		var b = parseInt(vin.b.value);
		var D = parseInt(vin.D.value);
		var df = parseInt(vin.df.value);
		var cover = parseInt(vin.cover.value);
		var fitwidth = b-2*cover-2*df;
		
		var manager = this.manager;
		if(manager.getBottomRow()===this || manager.getTopmostTop()===this){// TODO: or if the row is pressed against the top allow multi bars of comp reo.
			// TODO: assume minimum spacing of 20mm between
			// TODO: assume maximum spacing of 300mm c-c
			// TODO: assume maximum of 10 bars
			this.barcode = this._more_less_barcode(true, 10, 300, 20, fitwidth, this.area) || this.barcode;
		}else{
			// TODO: assume maximum of 2 bars
			this.barcode = this._more_less_barcode(true, 2,  300, 20, fitwidth, this.area) || this.barcode;
		}
	}.bind(this);
	
	
	
	
	this.less = function(){
		var b = parseInt(vin.b.value);
		var D = parseInt(vin.D.value);
		var df = parseInt(vin.df.value);
		var cover = parseInt(vin.cover.value);
		var fitwidth = b-2*cover-2*df;
		
		var manager = this.manager;
		if(manager.getBottomRow()===this || manager.getTopmostTop()===this){// TODO: or if the row is pressed against the top allow multi bars of comp reo.
			// TODO: assume minimum spacing of 20mm between
			// TODO: assume maximum spacing of 300mm c-c
			// TODO: assume maximum of 10 bars
			this.barcode = this._more_less_barcode(false, 10, 300, 20, fitwidth, this.area) || this.barcode;
		}else{
			// TODO: assume maximum of 2 bars
			this.barcode = this._more_less_barcode(false, 2,  300, 20, fitwidth, this.area) || this.barcode;
		}
	}.bind(this);
	
	
	
	this._more_less_barcode = function (getmore, maxbar, max_spacing, min_gap, fitwidth, current_area){
		
		
		var combs = [];
		var num,dia,diai,minw,maxw;
		for(num = 2; num<=maxbar;num++){
			for(diai=0;diai<this.diameters.length;diai++){
				dia = this.diameters[diai];
				
				minw = dia*num+(num-1)*min_gap;
				maxw = dia*num+(num-1)*max_spacing;
				if(fitwidth>=minw && fitwidth<=maxw){
					combs.push({number:num, diameter:dia, area:this.areas[diai]*num})
				}
			}
		}
		
		combs.sort(function(a,b){
			if(getmore){
				return a.area-b.area;
			}else{
				return b.area-a.area;
			}
		})
		//console.table(combs);
		
		// go through pairwise and remove all adjacent combos within 50mm^2 of eachother where one has less bars than the other
		var da = 0;
		var dn = 0;
		for(var i = 0;i<combs.length-1;i++){
			da = Math.abs(combs[i].area - combs[i+1].area);
			if(da>50){
				if(combs[i].number<combs[i+1].number){
					combs.splice(i+1,1);
				}else if(combs[i].number>combs[i+1].number){
					combs.splice(i,1);
					i--;
				}
			}
		}
		// go through pairwise and remove all adjacent combos within 100mm^2 of eachother if one has less than or equal to half the number of bars.
		var da = 0;
		var dn = 0;
		for(var i = 0;i<combs.length-1;i++){
			da = Math.abs(combs[i].area - combs[i+1].area);
			if(da>50){
				if(combs[i].number<=combs[i+1].number/2){
					combs.splice(i+1,1);
				}else if(combs[i+1].number<=combs[i].number/2){
					combs.splice(i,1);
					i--;
				}
			}
		}

		//console.log(combs.length);
		
		for(var i = 0;i<combs.length;i++){
			if(getmore){
				if(combs[i].area>current_area){
					return combs[i].number+"N"+combs[i].diameter;
				}
			}else{
				if(combs[i].area<current_area){
					return combs[i].number+"N"+combs[i].diameter;
				}
			}
		}
		
		// no suitable combination was found. Return the top combination.
		return combs[combs.length-1].number+"N"+combs[combs.length-1].diameter;
		
	
	}.bind(this);// end _more_less_barcode

	

	this.create();
}