;(function() {

document.addEventListener("click", zoomPhotoPost);

document.addEventListener("click", loadMore);

document.addEventListener("click", removeHandler);

document.addEventListener("click", likeHandler);

let loadContentStatus = 'maybe there are some things';        //debug information

let hashTagsHint = [      //hint for the edit page

  "winter",
  "morning",
  "forest",
  "darkness",
  "happy",
  "friends"

];

window.addPhotoPost = addPhotoPost;
window.editPhotoPost = editPhotoPost;
window.removePhotoPost = removePhotoPost;
window.preparePage = preparePage;
window.loadContent = loadContent;
window.showAuthorsFocus = showAuthorsFocus;
window.showAuthorsBlur = showAuthorsBlur;

window.lastReceivedPosts = [];
window.lastConfig = {};

function addPhotoPost(photoPost){

  if(!photoPosts.addPhotoPost(photoPost)){
    return false;
  }

  let cofig = Object.assign({}, lastConfig);      //to reload photoPosts
  loadContent(lastReceivedPosts.length, cofig);

  return true;

}

function removeHandler(event){

	if (event.target.classList.contains("trash-ico")){
		removePhotoPost();
	}

}

function editPhotoPost(photoPost, selectedId){

	selectedId = selectedId || getStateOfEnvironmentFromLocalSorage().zoomedPhotoPost;

	let responseStatus = photoPosts.editPhotoPost(selectedId, photoPost);
	if (!responseStatus){
		return false;
	}

	let editedPhotoPost = photoPosts.find(function(element){
		return element.id === selectedId;
	});

  responseStatus = isItLocalPost(selectedId);

	if (responseStatus || responseStatus === 0){
		let newPhotoPost = createPhotoPost('simple', editedPhotoPost);
		let oldPhotoPost = document.getElementById(selectedId);
		oldPhotoPost.parentNode.replaceChild(newPhotoPost, oldPhotoPost);
	}
  else{
    console.log("it isn't local photoPost");
  }
	
	if (getStateOfEnvironmentFromLocalSorage().pageState === "more" && getStateOfEnvironmentFromLocalSorage().zoomedPhotoPost === selectedId){
  	let newPhotoPost = createPhotoPost('more', editedPhotoPost);
  	let oldPhotoPost = document.querySelector(".card-item--zoomed");
  	oldPhotoPost.parentNode.replaceChild(newPhotoPost, oldPhotoPost);
		setPhotoPostPosition(document.querySelector('.card-item--zoomed'));
	}
	
	return true;

}

function removePhotoPost(selectedId){

  selectedId = selectedId || getStateOfEnvironmentFromLocalSorage().zoomedPhotoPost;

  if (!photoPosts.removePhotoPost(selectedId)){
    return false;
  }

  if (!deleteLocalPhotoPost(selectedId)){
    console.log("It isn't local photoPost");
  }

	if (getStateOfEnvironmentFromLocalSorage().pageState === "more"){
		let zoomed__card = document.querySelector(".card-item--zoomed:not(.add-new-card)");
		zoomed__card.parentNode.removeChild(zoomed__card);
		document.querySelector(".dark-background").classList.toggle("disabled");
	}

  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
	stateOfEnvironment.pageState = "simple";
	stateOfEnvironment.zoomedPhotoPost = null;
  localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));

  loadContent(1, lastConfig);

	return true;

}

function loadMore(){

	target = event.target;
	if (!target.classList.contains("button")){
		return false;
	}
	if (!target.closest(".button-showmore-container")){
		return false;
	}
	
	let responseStatus = loadContent(6, lastConfig);

	if (responseStatus === "NO MORE"){
		alert("NO MORE");
		return true;
	}

}

function likeHandler(){

  target = event.target;
  if (!target.classList.contains("fa-heart")){
    return false;
  }

  let photoPost = target.closest(".card-item");

  if (!getStateOfEnvironmentFromLocalSorage().zoomedPhotoPost){
    selectedId = photoPost.getAttribute("id");
  }
  else{
    selectedId = getStateOfEnvironmentFromLocalSorage().zoomedPhotoPost;
  }

  let likeIndexInLikesArray = photoPosts.likeThePost(selectedId);

  let smallPhotoPost = document.getElementById(selectedId);
  let likeIco = smallPhotoPost.querySelector(".fa-heart");

  let indexOfLocalPost = lastReceivedPosts.findIndex(function(element){
    return element.id === selectedId;
  });

  if (likeIndexInLikesArray === -1){
    likeIco.className = "liked-ico fas fa-heart";
    lastReceivedPosts[indexOfLocalPost].likes.push(getStateOfEnvironmentFromLocalSorage().currentUser);
  }
  else{
    likeIco.className = "not-liked-ico far fa-heart";
    lastReceivedPosts[indexOfLocalPost].likes.splice(likeIndexInLikesArray, 1);
  }

  if (getStateOfEnvironmentFromLocalSorage().zoomedPhotoPost){
    if (likeIndexInLikesArray === -1){
      target.className = "liked-ico fas fa-heart";
    }
    else{
      target.className = "not-liked-ico far fa-heart"; 
    }
  }

  console.log(indexOfLocalPost);
 
}

function zoomPhotoPost(event){

  target = event.target;
  let photoPost;
  if (!target.classList.contains("card-item__photo") && !target.classList.contains("close-button") ){
    return false;
  }
  photoPost = target.closest(".card-item");
  if (!photoPost){
    console.log("YO");
    return false;
  }

  document.querySelector(".dark-background").classList.toggle("disabled");

  if (photoPost.classList.contains("card-item--zoomed")){
    document.querySelector(".main-content-wrapper").removeChild(photoPost);
    getStateOfEnvironmentFromLocalSorage().pageState = 'simple';
    getStateOfEnvironmentFromLocalSorage().zoomedPhotoPost = null;
    return true;
  }

  let id = photoPost.getAttribute("id");
  let cardItem = createPhotoPost("more", photoPosts.getPhotoPost(id));
  let cardsContainer = document.querySelector(".cards-container");
  document.querySelector(".main-content-wrapper").insertBefore(cardItem, cardsContainer);

  setPhotoPostPosition(cardItem);

  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
  stateOfEnvironment.pageState = "more";
  stateOfEnvironment.zoomedPhotoPost = id;
  localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));

}

function setPhotoPostPosition(cardItem){

	let distanceToTheBottom = document.body.scrollHeight - window.pageYOffset;
  let top;
  if (distanceToTheBottom < cardItem.clientHeight){
    top = document.body.scrollHeight - cardItem.clientHeight;
  }
  else{
    top = window.pageYOffset;
  }
  cardItem.style.top = top + "px";

}

function preparePage(){

  if (getStateOfEnvironmentFromLocalSorage().personalPage){
    document.querySelector(".about-user").classList.remove("disabled");

    let userProfile = getUserProfile(getStateOfEnvironmentFromLocalSorage().personalPage);
    document.querySelector(".about-user__avatar").setAttribute("src", userProfile.avatar);
    document.querySelector(".about-user__name").innerHTML = getStateOfEnvironmentFromLocalSorage().personalPage;
    document.querySelector(".about-user__description-text").innerHTML = userProfile.aboutYou;
    document.querySelector(".about-user__location").innerHTML = userProfile.country + ", " + userProfile.city;
  }
  if (getStateOfEnvironmentFromLocalSorage().currentUser){
    document.querySelector(".header__login").classList.add("disabled");
    document.querySelector(".header__logout").classList.remove("disabled");
    let currentUserName = document.querySelector(".header__current-user-name");
    currentUserName.classList.remove("disabled");
    currentUserName.innerHTML = getStateOfEnvironmentFromLocalSorage().currentUser.split(' ')[0];   
  }

  return true;

}

function loadContent(quantity, filterConfig){       //for load more filterConfig = lastConfig, for Edit filterConfig = {...}
  
  let skip = lastReceivedPosts.length;
  let receivedPhotoPosts;

  // console.log(lastConfig);

  if (!filterConfig){
    filterConfig = {
      hashTags: []
    };
  }

  if (getStateOfEnvironmentFromLocalSorage().personalPage){
  	filterConfig.author = getStateOfEnvironmentFromLocalSorage().personalPage;
  }

  if(filterConfig !== lastConfig){
    skip = 0;
  }

  receivedPhotoPosts = photoPosts.getPhotoPosts(skip, quantity, filterConfig);
  if (receivedPhotoPosts === false){
    return false;
  }

  if (skip !== 0 && receivedPhotoPosts.length < quantity){					//debug information
  	loadContentStatus = "CONTINUE:  it's all";
  }

  if (skip !== 0 && receivedPhotoPosts.length === 0){					//debug information
  	loadContentStatus = "NO MORE";
  }

  if (skip === 0 && receivedPhotoPosts.length < quantity){					//debug information
  	loadContentStatus = "START: it's all";
  }

  if (skip === 0 && receivedPhotoPosts.length === 0){					//debug information
  	loadContentStatus = "Nothing found";
  }

  if (receivedPhotoPosts.length === quantity){					//debug information
  	loadContentStatus = "maybe there are some things";
  }

  if (skip === 0 && lastReceivedPosts.length !== 0){
    deleteChildren(document.getElementsByClassName("cards-container")[0]);
  }

  if (skip !== 0){
    for (let i = 0; i < receivedPhotoPosts.length; i++) {
      lastReceivedPosts.push(receivedPhotoPosts[i]);
    }
  }
  else{
    lastReceivedPosts = receivedPhotoPosts;
  }

  lastConfig = filterConfig;

  for (let i = 0; i < receivedPhotoPosts.length; i++){
    appendPhotoPost (receivedPhotoPosts[i]);
  }

  // console.log(lastConfig);

  return loadContentStatus;

}

function showAuthorsFocus(){

  target = this;
  this.placeholder = '';
  let container = document.querySelector(".header__authors-container");
  container.classList.toggle("disabled");
  deleteChildren(container);
  showAuthors();

}

function showAuthorsBlur(){

  target = this;
  target.placeholder = 'Find more authors';
  document.querySelector(".header__authors-container").classList.toggle("disabled");

}

function showAuthors(){

  let authors = getAuthors(getUsersFromLocalSorage, 5);
  for (let i = 0; i < authors.length; i++){
    let authorItem = document.createElement("li");
    authorItem.className = "header__list-item";
    let authorName = document.createElement("span");
    authorName.className = "header__author-name";
    authorName.innerHTML = getUsersFromLocalSorage()[i].user;
    authorItem.appendChild(authorName);
    document.querySelector(".header__authors-container").appendChild(authorItem);
  }

}

function getAuthors(users, quantity){

  quantity = quantity || 5;

  let authors = [];
  for (var i = 0; i < quantity; i++){
    authors[i] = users()[i].user;
  }
  return authors;

}

function appendPhotoPost (photoPost){     //just add photoCardItem in cardContainer

  let cardsContainer = document.getElementsByClassName("cards-container")[0];
  let cardItem = createPhotoPost("simple", photoPost);
  cardsContainer.appendChild(cardItem);
  return cardsContainer;

}

function createPhotoPost(mode, photoPost){       //create an return new cardItem without adding

  if (!isModeCorrect(mode)){      
    return false;
  }

  if (!photoPosts.validatePhotoPost(photoPost)){
    return false;
  }
  
  let cardItem = document.createElement('div');
  if (mode !== 'simple'){
    cardItem.className = "card-item shadow card-item--zoomed";
  }
  else{
    cardItem.className = "card-item shadow";
    cardItem.setAttribute("id", photoPost.id);
  }
  
  let cardItem__photo = document.createElement('img');
  cardItem__photo.className = "card-item__photo";
  let imgSource = photoPost.photoLink;
  cardItem__photo.setAttribute('src', imgSource);
  cardItem__photo.setAttribute('alt', 'photo');
  cardItem.appendChild(cardItem__photo);

  let cardItem__subtitle = document.createElement('div');
  if (mode === 'simple'){
    cardItem__subtitle.className = "card-item__subtitle";
  }
  else if (mode === 'more'){
    cardItem__subtitle.className = "card-item__subtitle card-item__subtitle--zoomed";
  }
  else if (mode === 'edit'){
    cardItem__subtitle.className = "card-item__subtitle card-item__subtitle--zoomed disabled";
  }
  cardItem.appendChild(cardItem__subtitle);

  let cardItem__ownerInfo = document.createElement('div');
  cardItem__ownerInfo.className = "card-item__owner-info";
  cardItem__subtitle.appendChild(cardItem__ownerInfo);

  let cardItem__photoOwner = document.createElement('span');
  cardItem__photoOwner.className = "card-item__photo-owner";
  let userName = photoPost.author.split(' ')[0];
  cardItem__photoOwner.innerHTML = userName;
  cardItem__ownerInfo.appendChild(cardItem__photoOwner);

  let cardItem__publDate = document.createElement('span');
  cardItem__publDate.className = "card-item__publ-date";
  cardItem__publDate.innerHTML = makeDateBeautiful(photoPost.createdAt);
  cardItem__ownerInfo.appendChild(cardItem__publDate);

  let cardItem__controlButtons = document.createElement('div');
  cardItem__controlButtons.className = "card-item__control-buttons";
  cardItem__subtitle.appendChild(cardItem__controlButtons);

  if (isUserLikedThePhoto(getStateOfEnvironmentFromLocalSorage().currentUser, photoPost)){
    let likedIco = document.createElement('i');
    likedIco.className = "liked-ico fas fa-heart";
    cardItem__controlButtons.appendChild(likedIco);
  }
  else{
    let notLikedIco = document.createElement('i');
    notLikedIco.className = "not-liked-ico far fa-heart";
    cardItem__controlButtons.appendChild(notLikedIco);
  }

  let editIco = document.createElement('i');
  if (mode === 'simple' || getStateOfEnvironmentFromLocalSorage().currentUser !== photoPost.author){
    editIco.className = "edit-ico fas fa-pencil-alt disabled";
  }
  else{
    editIco.className = "edit-ico fas fa-pencil-alt";
  }
  cardItem__controlButtons.appendChild(editIco);

  let trashIco = document.createElement('i');
  if (mode === 'simple' || getStateOfEnvironmentFromLocalSorage().currentUser !== photoPost.author){
    trashIco.className = "trash-ico fas fa-trash disabled";
  }
  else{
    trashIco.className = "trash-ico fas fa-trash";
  }
  cardItem__controlButtons.appendChild(trashIco);

  let titleEditHashtag = document.createElement('p');
  if (mode !== 'edit'){
    titleEditHashtag.className = "card-item__title-edit-hashtag disabled";
  }
  else{
    titleEditHashtag.className = "card-item__title-edit-hashtag";
  }
  cardItem.appendChild(titleEditHashtag);

  let cardItem__hashtagsContainer = document.createElement('div');
  if (mode === 'simple'){
    cardItem__hashtagsContainer.className = "card-item__hashtags-container disabled";
  }
  else{
    cardItem__hashtagsContainer.className = "card-item__hashtags-container";
  }
  cardItem.appendChild(cardItem__hashtagsContainer);

  for (let i = 0; i < photoPost.hashTags.length; i++){
    let hashtagItem = document.createElement('div');
    hashtagItem.className = "card-item__hashtag-item selected-hashtag";
    hashtagItem.innerHTML = photoPost.hashTags[i];
    if (mode === 'edit'){
      let closeIco = document.createElement('i');
      closeIco.className = "close-ico fas fa-times";
      hashtagItem.appendChild(closeIco);
    }
    cardItem__hashtagsContainer.appendChild(hashtagItem);
  }

  let selectHashtag__formContainer = document.createElement('div');
  if (mode === 'edit'){
    selectHashtag__formContainer.className = "select-hashtag__form-container card-item__form-editing";
  }
  else{
    selectHashtag__formContainer.className = "select-hashtag__form-container card-item__form-editing disabled";
  }
  cardItem.appendChild(selectHashtag__formContainer);

  let selectHashtag__form = document.createElement('form');
  selectHashtag__form.className = "select-hashtag__form";
  selectHashtag__formContainer.appendChild(selectHashtag__form);

  let selectHashtag__input = document.createElement('input');
  selectHashtag__input.className = "select-hashtag__input";
  selectHashtag__input.setAttribute("type", "text");
  selectHashtag__input.setAttribute("name", "add-hashtag");
  selectHashtag__input.setAttribute("placeholder", "Type #hashtags here");
  selectHashtag__form.appendChild(selectHashtag__input);

  let selectHashtag__submit = document.createElement('input');
  selectHashtag__submit.className = "select-hashtag__submit";
  selectHashtag__submit.setAttribute("type", "submit");
  selectHashtag__submit.setAttribute("value", "Add");
  selectHashtag__form.appendChild(selectHashtag__submit);

  let selectHashtag__cheatsheet = document.createElement('p');
  if (mode === "edit"){
    selectHashtag__cheatsheet.className = "select-hashtag__cheatsheet card-item__cheatsheet-editing";
  }
  else{
    selectHashtag__cheatsheet.className = "select-hashtag__cheatsheet card-item__cheatsheet-editing disabled";
  }
  selectHashtag__cheatsheet.innerHTML = "There is some examples below. You can add it to selected hashtags by click.";
  cardItem.appendChild(selectHashtag__cheatsheet);

  cardItem__hashtagsContainer = document.createElement('div');
  if (mode === 'edit'){
    cardItem__hashtagsContainer.className = "card-item__hashtags-container";
  }
  else{
    cardItem__hashtagsContainer.className = "card-item__hashtags-container disabled";
  }
  cardItem.appendChild(cardItem__hashtagsContainer);

  for (let i = 0; i < hashTagsHint.length; i++){
    hashtagItem = document.createElement('div');
    hashtagItem.className = "select-hashtag__hashtag-item hint-hashtag";
    hashtagItem.innerHTML = hashTagsHint[i];
    cardItem__hashtagsContainer.appendChild(hashtagItem);
  }

  let titleEditDescription = document.createElement('p');
  if (mode === "edit"){
    titleEditDescription.className = "card-item__title-edit-description";
  }
  else{
    titleEditDescription.className = "card-item__title-edit-description disabled";
  }
  titleEditDescription.innerHTML = "Edit description:";
  cardItem.appendChild(titleEditDescription);

  let textarea = document.createElement('textarea');
  textarea.innerHTML = photoPost.description;
  if (mode === "edit"){
    textarea.className = "card-item__textarea";
  }
  else{
    textarea.className = "card-item__textarea disabled";
  }
  cardItem.appendChild(textarea);

  let cardItem__description = document.createElement('p');
  cardItem__description.innerHTML = photoPost.description;
  if (mode === "more"){
    cardItem__description.className = "card-item__description";
  }
  else{
    cardItem__description.className = "card-item__description disabled";
  }
  cardItem__description.innerHTML = photoPost.description;
  cardItem.appendChild(cardItem__description);

  let cardItem__buttonContainer = document.createElement('div');
  if (mode === "simple"){
    cardItem__buttonContainer.className = "card-item__button-container disabled";
  }
  else{
    cardItem__buttonContainer.className = "card-item__button-container";
  }
  cardItem.appendChild(cardItem__buttonContainer);

  let close = document.createElement('div');
  if (mode === "more"){
    close.className = "button narrow-button close-button";
  }
  else{
    close.className = "button narrow-button close-button disabled";
  }
  close.innerHTML = "Close";
  cardItem__buttonContainer.appendChild(close);

  let submit = document.createElement('div');
  if (mode === "edit"){
    submit.className = "button narrow-button";
  }
  else{
    submit.className = "button narrow-button disabled";
  }
  submit.innerHTML = "Submit changes";
  cardItem__buttonContainer.appendChild(submit);

  let cancel = document.createElement('div');
  if (mode === "edit"){
    cancel.className = "button narrow-button";
  }
  else{
    cancel.className = "button narrow-button disabled";
  }
  cancel.innerHTML = "Cancel";
  cardItem__buttonContainer.appendChild(cancel);

  return cardItem;

}

function deleteLocalPhotoPost(selectedId){

  let responseStatus = isItLocalPost(selectedId);
	if (responseStatus || responseStatus === 0){
		lastReceivedPosts.splice(responseStatus, 1);
	}
	else{
		return false;
	}

	let selectedPhotoPost = document.getElementById(selectedId);
	if (!selectedPhotoPost){
		return false;
	}
	selectedPhotoPost.parentNode.removeChild(selectedPhotoPost);
	return true;

}

function isItLocalPost(selectedId){

	let selectedPhotoPostIndex = lastReceivedPosts.findIndex(function(element){
		return element.id === selectedId;
	});

	if (selectedPhotoPostIndex !== -1){
		return selectedPhotoPostIndex;
	}
	else{
		return false;
	}

}

function getUserProfile(userName) {
  
  return getUsersFromLocalSorage().find(function(element){
    return element.user === userName;
  });

}

function deleteChildren(node){

  while (node.firstChild){ 
    node.removeChild(node.firstChild); 
  }

}

function isUserLikedThePhoto(user, photoPost){

  return photoPost.likes.find(function(element){
    return element === user;
  });

}

function isModeCorrect(mode){     //check generation mode

  if (mode === 'simple'){
    return true;
  }
  if (mode === 'more'){
    return true;
  }
  if (mode === 'edit'){
    return true;
  }
  return false;

}

function makeDateBeautiful(date){

  let day = date.getDate();
  if (day < 10){
    day =  '0' + day;
  }
  let month = date.getMonth() + 1;
  if (month < 10){
    month =  '0' + month;
  }
  let year = date.getFullYear() - 2000;
  return [day,month,year].join('.');

}

}());