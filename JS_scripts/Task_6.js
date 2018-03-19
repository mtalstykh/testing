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