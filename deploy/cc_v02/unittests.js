var reo
for(var i = 1; i<3000;i++){
reo = mb.getReoObjectFromArea(i);
i = reo.area;
console.log(i, reo.number, reo.diameter)
}