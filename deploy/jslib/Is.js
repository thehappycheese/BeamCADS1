Is = (function(){

		numeric:function(v){
			return v != undefined && !isNaN(v) && typeof v === "number";
		}.bind(this),
		
		notnumeric:function(v){
			return !this.numeric(v);
		}.bind(this),
		
		A_factorof_B:function(a,b){
			if(this.notnumeric(a) || this.notnumeric(b)){
				throw new Error("cannot factor non-numeric values")
			}
			return (b%a === 0);
		}.bind(this),

		nonzero:function(v){
			if(this.numeric(v)){
				return this.numeric(v) && v !== 0;
			}else{
				throw new Error("Cant check nonzero on non-numeric.");
			}
		}.bind(this),
		
		positive:function(v){
			if(this.numeric(v)){
				return v>0;
			}else{
				throw new Error("Cant check non-numeric is positive.");
			}
		},
		negative:function(v){
			if(this.numeric(v)){
				return v<0;
			}else{
				throw new Error("Cant check non-numeric is negative.");
			}
		},
	})();