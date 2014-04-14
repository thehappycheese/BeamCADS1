///.
function loadWidget(url, on_done){
	var x = new XMLHttpRequest();
	x.open("GET",url);
	x.responseType = "document";
	x.onload = function(e){
		var doc = e.target.response;
		var temp = document.adoptNode(doc.querySelector("template"));
		document.body.appendChild(temp);
		
		var script = document.importNode(doc.querySelector("script"),true);
		console.log("Attacthing script:",url);
		document.body.appendChild(script);
		on_done();
	}
	x.send();
}
loadWidget("widgets/ReoInput.htm",function(){
	loadWidget("widgets/ReoOutput.htm",function(){
		loadWidget("widgets/XInput.htm",function(){
			loadWidget("widgets/ReoManager.htm",function(){
				console.log("widgets loaded in order")
				window.dispatchEvent(new Event("widgetsloaded"));
			});
		});
	});
});


