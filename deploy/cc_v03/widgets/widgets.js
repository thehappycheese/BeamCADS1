function loadWidget(url){
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
		
	}
	x.send();
}
loadWidget("widgets/ReoInput.htm");
loadWidget("widgets/ReoOutput.htm");
loadWidget("widgets/XInput.htm");