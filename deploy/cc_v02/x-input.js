
var x_input_prototype = Object.create(HTMLDivElement.prototype);

x_input_prototype.addEventListener("created",function(){
	console.log(this, "created");
});


document.registerElement("x-input", {
	prototype: x_input_prototype
})