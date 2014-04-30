///~ jslib/taffy-min.js
///* data_AS3600Variables.js


data_AS3600Variables = nConvertTo2Taffy(data_AS3600Variables);

function nConvertTo2Taffy(spreadsheet){
	var prettyheader = spreadsheet.prettyheader;
	var header = spreadsheet.header;
	var data = spreadsheet.data;
	
	
	var tmpobj,arr = [];
	
	for(var j,i = 0; i<data.length;i++){
		tmpobj = {};
		for(j=0;j<header.length;j++){
			tmpobj[header[j]] = data[i][j];
		}
		arr.push(tmpobj);
	}
	
	var result = TAFFY(arr);
	return result;
}


