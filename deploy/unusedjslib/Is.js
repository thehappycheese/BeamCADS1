var Is = function(val){
		var exp = new (function(val){
			this.v = val;
			this.numeric	=	function(){
				return this.v != undefined && !isNaN(this.v) && typeof this.v === "number";
			}.bind(this)
			
			this.notnumeric	=	function(){
				return !this.numeric(this.v);
			}.bind(this)
			
			this.divisible	=	function(b){
				return this.numeric() && Is(b).numeric() && (b%this.v === 0);
			}.bind(this)
			this.notdivisible = function(b){
				return !this.divisible(b);
			}.bind(this);
			this.indivisible = this.notdivisible;

			this.nonzero	=	function(){
				return this.numeric(this.v) && this.v !== 0;
			}.bind(this)
			
			this.positive	=	function(){
					return this.numeric() && this.v>0;
			}.bind(this)
			this.negative	=	function(){
					return this.numeric() && this.v<0;
			}
			this.between = function(v, a,b){
				return this.numeric() && Is(a).numeric() && Is(b).numeric() && this.v>a && this.v<b;
			}.bind(this);
		})(val);
		return exp;
	}