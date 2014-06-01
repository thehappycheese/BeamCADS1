

///* tinyxhr.js




function HelpBar(arg_host){
	this.host = document.getElementById(arg_host);
	this.data = null;
	this.startload = function(){
		tinyxhr("infos/infos.json",function(err,text,xhr){
			if(err) throw new Error("Help Bar couldnt load :(");
			this.data = JSON.parse(text)
			this.init()
		}.bind(this));
	}.bind(this)
	
	this.init=function(){
		this.buildBar();
		try{
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		}catch(e){
			console.log("Failed to typeset help bar",e);
		}
	}.bind(this);
	
	
	
	
	
	this.buildBar = function (){
		var div = document.createElement("div");
		var homediv = document.createElement("div");
		homediv.id = "home";
		var items = [];
		// convert object to array for sorting:
		for(var k in this.data){
			items.push(this.data[k]);
		}
		items.sort(function(a,b){
			a.id.localeCompare(b.id)
		})
		for(var i = 0;i<items.length;i++){
			div.appendChild(makeHelpBlock(items[i]));
		}
		
		this.host.appendChild(div);
		
		
		function makeIndexLink(){}
		function makeHelpBlock(item){
			var result = makeDiv(item.id,"helpblock");
			var html = "";
			html += "<h1>"+
					((item.notation)?("$$$"+item.notation+"$$$ "):"")+
					((item.unit)?("("+item.unit+") "):"")+
					item.name+"</h1>";
			if(item.description){
				html += "<p><b>"+item.description+"</b></p>";
			}
			html += item.docs;
			if(item.coderef.length>0){
				html += "<table>"
				for(var i = 0;i<item.coderef.length;i++){
					html+="<tr><td>"+item.coderef[i].ref+"</td><td>"+item.coderef[i].data+"</td></tr>";
				}
				html+="</table>"
			}
			if(item.related.length>0){
				html += "<h2>Related:</h2><ul>"
				for(var i = 0;i<item.related.length;i++){
					html+="<li>"+item.related[i]+"</li>";
				}
				html+="</ul>"
			}
			result.innerHTML = html;
			return result;
		}
		function makeDiv(id,classname){
			var result = document.createElement("div");
			result.id = id || "";
			result.className = classname || "";
			return result;
		}
	}
	
	
	
	
	
	
	
	
	this.startload();
}

















