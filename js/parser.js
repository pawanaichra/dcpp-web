function parser(command){
	if(command.split(" ")[0]=="$SR"){
		var str=command.split(/(?<=^\S+)\s/)[1];
		var username = str.split(/(?<=^\S+)\s/)[0];
		var rem = str.split(/(?<=^\S+)\s/)[1];
		var path = rem.split("")[0];
		searchresult(username,path);
	}
}

function searchresult(username, path){
	if(document.getElementById("search-results")==null){
		document.getElementById("results").innerHTML="<table id='search-results'><tr><th>Username</th><th>Path</th></tr></table>";
	}
	var table=document.getElementById("search-results");
	var row = table.insertRow(-1);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell1.innerHTML = username;
	cell2.innerHTML = path;
}