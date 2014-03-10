// Build UI
var ui = {};
ui.physdiv = document.querySelector("#physdiv");
ui.matdiv = document.querySelector("#matdiv");
ui.reodiv = document.querySelector("#reodiv");



// Initial Physical property input boxes
ui.physdiv.appendChild(input("B"	, "number","mm",10000));
ui.physdiv.appendChild(input("D"	, "number","mm",1000));

ui.physdiv.appendChild(input("cover"	, "number","mm"));

ui.physdiv.appendChild(input("d"	, "number","mm"));
ui.physdiv.appendChild(input("d_n"	, "number","mm"));

ui.physdiv.appendChild(input("k_u"	, "number",""));

// Initial material properties input boxes
ui.matdiv.appendChild(input("roh_c"	, "number","kg/m^3"));
ui.matdiv.appendChild(input("f'_c"	, "number","MPa"));
ui.matdiv.appendChild(input("f_sy"	, "number","MPa"));
ui.matdiv.appendChild(input("reoclass","number","N or L"));





handleUserInput();
function handleUserInput(evt){
	var b = {};
	b.D = parseInt(getInp("D"));
	b.B = parseInt(getInp("B"));
	
	drawBeam(b);
	
}

function drawBeam(b){
	var canvas = document.getElementById("canvas_csect");
	var ctx = canvas.getContext('2d');
	
	
	var maxwidth = canvas.width*0.6;
	var maxheight = canvas.height*0.6;
	var minwidth = Math.max(40, canvas.width*0.2);
	var minheight = Math.max(40, canvas.height*0.2);
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	
	ctx.translate(Math.floor(canvas.width/2)+0.5, Math.floor(canvas.height/2)+0.5);
	
		
		
		var scale = Math.min(maxwidth/b.B, maxheight/b.D);
		
		var w = Math.max(scale*b.B, minwidth);
		var h = Math.max(scale*b.D, minheight);
		console.log(w,h);
		
		ctx.strokeStyle = "#FF00FF";
		ctx.lineWidth = "2px";
		ctx.strokeRect(-w/2, -h/2, w, h);
		
		
		
		// TODO: draw cover and steel Layers
		
		dim(ctx,-w/2,h/2,w/2,h/2, Math.PI/2, 10,b.B+" mm");
		dim(ctx,-w/2,-h/2,-w/2,h/2, 0, -10,b.D+" mm");
	
	
	
	ctx.restore();
	
	
}



function dim(ctx,x1,y1,x2,y2,angle,dist,txt){
	var fontpx = 15;
	ctx.save();
	ctx.font = fontpx+"px serif";
	ctx.textBaseline="middle"
	ctx.textAlign="center"
	
	var metric = ctx.measureText(txt);
	
	
	var v1 = new Vector(x1,y1);
	var v2 = new Vector(x2,y2);
	var offset = (new Vector()).fromAngLen(angle,Math.max(10,Math.abs(dist),metric.width/2*Math.cos(angle)+5)*dist/Math.abs(dist));
	var va = v1.copy().add(offset);
	
	var dimlen = (new Vector()).fromAngLen(angle+Math.PI/2,1).dot(v2.copy().minus(v1))
	var vb = va.copy().add((new Vector()).fromAngLen(angle+Math.PI/2,1).scalar(dimlen));
	
	ctx.strokeStyle = "#555555";
	ctx.fillStyle = "#555555";
	// Draw line bodies
	ctx.beginPath();
	var vc = va.copy().minus(v1).unit().scalar(3).add(v1);
	var vd = va.copy().minus(v1).unit().scalar(3).add(va);
	ctx.moveTo(vc.x,vc.y);
	ctx.lineTo(vd.x,vd.y);
	
	var vc = vb.copy().minus(v2).unit().scalar(3).add(v2);
	var vd = vb.copy().minus(v2).unit().scalar(3).add(vb);
	ctx.moveTo(vc.x,vc.y);
	ctx.lineTo(vd.x,vd.y);
	
	ctx.moveTo(va.x,va.y);
	ctx.lineTo(vb.x,vb.y);
	ctx.stroke();
	
	// Arrowhead A
	ctx.save()
	ctx.translate(va.x,va.y);
	ctx.rotate(-angle*dist/Math.abs(dist));
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(2,3);
	ctx.lineTo(-2,3);
	ctx.fill();
	ctx.restore();
	
	// Arrowhead B
	ctx.save()
	ctx.translate(vb.x,vb.y);
	ctx.rotate(-angle*dist/Math.abs(dist)+Math.PI);
	ctx.moveTo(0,0);
	ctx.lineTo(2,3);
	ctx.lineTo(-2,3);
	ctx.fill();
	ctx.restore();
	
	// Draw text
	ctx.fillStyle = "#000000";
	var vt = va.copy().add(vb).scalar(0.5);
	
	console.log(metric);
	ctx.clearRect(vt.x-metric.width/2-3,vt.y-fontpx/2-1,metric.width+6,fontpx+4);
	ctx.fillText(txt,vt.x,vt.y);
	
	ctx.restore();
	
}








function getInp(varname){
	var element = document.getElementById(varname);
	return element.value;
}







function input(namestr, type, postfix,value){
	
	var inp = document.createElement("input");
	inp.placeholder = "??";
	inp.type = type || "text";
	inp.id = namestr;
	inp.addEventListener("keyup",handleUserInput);
	inp.value = value || "";
	
	var lable = document.createElement("lable");
	var prefix = document.createTextNode(namestr+" =");
	var postfix = document.createTextNode(postfix);
	
	lable.appendChild(prefix);
	lable.appendChild(inp);
	lable.appendChild(postfix);
	
	return lable;
}