

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
		var indexdiv = makeDiv("helpindex","helpblock");
		div.appendChild(indexdiv)
		var items = [];
		// convert object to array for sorting:
		for(var k in this.data){
			items.push(this.data[k]);
		}
		items.sort(function(a,b){
			return a.unicode.localeCompare(b.unicode)
		})
		var indexhtml = "<div><h1>Index</h1>";
		
		for(var i = 0;i<items.length;i++){
			div.appendChild(makeHelpBlock(items[i],this.data));
			//indexhtml +='<a href="#help_bar_'+items[i].id+'">$$$'+items[i].notation+'$$$ '+items[i].name+'</a>';
			indexhtml += makeIndexLink(items[i])
		}
		indexhtml +="</div>"
		indexdiv.innerHTML = indexhtml;
		this.host.appendChild(div);
		
		
		function makeIndexLink(item){
			var html ="";
			html+= '<a href="#help_bar_'+item.id+'">';
				html+= '<table class="help_bar_link"><tr>';
				html+= '<td class="c1">$$$'+item.notation+'$$$</td><td class="c2">'+item.name+'</td>';
				html+= "</tr></table>";
			html+= "</a>";
			
			return html
		}
		function makeHelpBlock(item,data){
			var result = makeDiv("help_bar_"+item.id,"helpblock");
			var html = "";
			html += "<hr/><h1>"+
					((item.notation)?("$$$"+item.notation+"$$$ "):"")+
					item.name+
					((item.unit)?(" ("+item.unit+")"):"")+
					"</h1>";
			if(item.description){
				html += "<p><b>"+item.description+"</b></p>";
			}
			html += item.docs;
			if(item.coderef.length>0){
				html += '<table class="help_bar_coderef">'
				for(var i = 0;i<item.coderef.length;i++){
					html+='<tr><td class="c1">'+item.coderef[i].ref+'</td><td class="c2">'+item.coderef[i].data+"</td></tr>";
				}
				html+="</table>"
			}
			if(item.related.length>0){
				html += "<h2>Related:</h2>"
				for(var i = 0;i<item.related.length;i++){
					// TRY TO FIND THE RELATED item in this.data
					try{
						// Create a link
						html +=  makeIndexLink(data[item.related[i]]);
					}catch(e){
						// Just show text
						html += item.related[i];
					}
				}
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
	}.bind(this);
	
	
	
	
	
	
	
	
	this.startload();
}

















