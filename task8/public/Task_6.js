if (!localStorage.getItem("stateOfEnvironment")){
	getStateOfEnvironmentFromJSON();
}

if (!localStorage.getItem("photoPosts")){
	getPostsFromJSON();
}

if (!localStorage.getItem("users")){
	getUsersFromJSON();
	alert("Login as 'admin' without password");
}

// getPostsFromJSON();
// getUsersFromJSON();
// getStateOfEnvironmentFromJSON();

function getPostsFromJSON (){

	let xmlhttp = new XMLHttpRequest();
	let url = "photoPosts.json?1";
	let receivedJSON = null;

	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    receivedJSON = this.responseText;
	    localStorage.setItem("photoPosts", receivedJSON);
	  }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}

function getPhotoPostsFromLocalSorage(){

	let photoPosts = localStorage.getItem("photoPosts");
	photoPosts = JSON.parse(photoPosts);
	parceDateFromJSON(photoPosts);
	return photoPosts;

}

function parceDateFromJSON(jsonObject){

	for (let i = 0; i < jsonObject.length; i++){
		jsonObject[i].createdAt = new Date (jsonObject[i].createdAt);
	}

}

function getUsersFromJSON () {

	let xmlhttp = new XMLHttpRequest();
	let url = "users.json?2";
	let receivedJSON = null;

	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    receivedJSON = this.responseText;
	    localStorage.setItem("users", receivedJSON);
	  }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}

function getUsersFromLocalSorage(){

	let users = JSON.parse(localStorage.getItem("users"));
	return users;

}

function getStateOfEnvironmentFromJSON (){

	let xmlhttp = new XMLHttpRequest();
	let url = "stateOfEnvironment.json?1";
	let receivedJSON = null;

	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    receivedJSON = this.responseText;
	    localStorage.setItem("stateOfEnvironment", receivedJSON);
	  }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}

function getStateOfEnvironmentFromLocalSorage(){

	let stateOfEnvironment = JSON.parse(localStorage.getItem("stateOfEnvironment"));
	return stateOfEnvironment;

}