;(function() {

document.addEventListener("click", zoomPhotoPostHandler);

document.addEventListener("click", loadMoreHandler);

document.addEventListener("click", removeHandler);

document.addEventListener("click", likeHandler);

document.addEventListener("click", loginHandler);

document.addEventListener("click", logoutHandler);

document.addEventListener("click", showLoginHandler);

document.addEventListener("click", cancelLoginHandler);

document.addEventListener("click", backHomeHandler);

document.addEventListener("click", goToPersonalPageHandler);

document.addEventListener("click", showOrHideSortByHandler);

document.addEventListener("click", sortByHandler);

document.addEventListener("click", showFilterByHashTagsHandler);

document.addEventListener("click", cancelFilterByHashTagsHandler);

document.addEventListener("click", addHashTagToSelectedHandler);

document.addEventListener("click", addHashTagFromHintHandler);

document.addEventListener("click", removeHashTagFromSelectedHandler);

document.addEventListener("click", applyFilterByHashtagsHandler);

document.addEventListener("click", showAddNewCardHandler);

document.addEventListener("click", cancelAddNewCardHandler);

document.addEventListener("click", applyAddNewCardHandler);

document.addEventListener("click", showEditPhotoPostHandler);

document.addEventListener("click", cancelEditPhotoPostHandler);

document.addEventListener("click", applyEditPhotoPostHandler);

document.addEventListener("click", normalizeBodyHandler);

document.addEventListener("keydown", findAuthorHandler);

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

window.focusInput = focusInput;
window.blurLogin = blurLogin;

window.blurPassword = blurPassword;
window.blurSelectHashtag = blurSelectHashtag;

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

	let editedPhotoPost = getPhotoPostsFromLocalSorage().find(function(element){
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
  	let oldPhotoPost = document.querySelector(".card-item--zoomed:not(.add-new-card)");
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

function loadMoreHandler(){

	target = event.target;
	if (!target.classList.contains("button")){
		return false;
	}
	if (!target.closest(".button-showmore-container")){
		return false;
	}
	
	let responseStatus = loadContent(6, lastConfig);

  console.log(responseStatus);

	if (responseStatus === "NO MORE" || responseStatus === "Nothing found"){
		alert("NO MORE");
		return true;
	}

}

function likeHandler(){

  target = event.target;
  if (!target.classList.contains("fa-heart") || !getStateOfEnvironmentFromLocalSorage().currentUser){
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

function zoomPhotoPostHandler(event){

  target = event.target;
  let photoPost;
  if (!target.classList.contains("card-item__photo") && !target.classList.contains("close-button") ){
    return false;
  }
  photoPost = target.closest(".card-item");
  if (!photoPost){
    return false;
  }

  document.querySelector(".dark-background").classList.toggle("disabled");

  if (photoPost.classList.contains("card-item--zoomed")){
    document.querySelector(".main-content-wrapper").removeChild(photoPost);
    let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
    stateOfEnvironment.pageState = "simple";
    stateOfEnvironment.zoomedPhotoPost = null;
    localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));
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

function setPhotoPostPosition(cardItem, itIsntPhotoPost){

	let distanceToTheBottom = document.body.scrollHeight - window.pageYOffset;
  let top;
  let cardHeight = cardItem.clientHeight;
  if (itIsntPhotoPost){
    cardHeight += 100;
  }

  if (distanceToTheBottom < cardHeight){
    top = document.body.scrollHeight - cardItem.clientHeight;
  }
  else{
    top = window.pageYOffset;
  }

  if (document.body.scrollHeight === cardHeight){
    document.body.setAttribute("style", "height: "+ cardHeight + "px");
  }

  if (itIsntPhotoPost){
    top += 100;
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
  else{
    document.querySelector(".header__login").classList.remove("disabled");
    document.querySelector(".header__logout").classList.add("disabled");
    let currentUserName = document.querySelector(".header__current-user-name");
    currentUserName.classList.add("disabled");
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

  if (loadContentStatus === "Nothing found" && !document.querySelector(".sad-cat")){
    showSadCat();
  }

  return loadContentStatus;

}

function showLoginHandler(){

  target = event.target;

  if (!checkBeforeShowLogin(target)){
    return false;
  }

  if (getStateOfEnvironmentFromLocalSorage().pageState === "more"){
    let photoPost = document.querySelector(".card-item--zoomed:not(.add-new-card)");
    document.querySelector(".main-content-wrapper").removeChild(photoPost);
    let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
    stateOfEnvironment.pageState = "simple";
    stateOfEnvironment.zoomedPhotoPost = null;
    localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));
  }

  document.querySelector(".dark-background").classList.remove("disabled");
  let loginContainer = document.querySelector(".login-container");
  loginContainer.classList.toggle("disabled");
  setPhotoPostPosition(loginContainer, true);

}

function checkBeforeShowLogin(target){

  if (getStateOfEnvironmentFromLocalSorage().currentUser !== null){
    return false;
  }

  if (target.classList.contains("header__login") || target.classList.contains("fa-heart") || target.getAttribute("id") === "add_new" || target.classList.contains("add-ico")){
    return true;
  }

  return false;

}

function focusInput(){

  target = this;
  if (!target.value){
    target.placeholder = '';
  }
  
}

function blurLogin(){

  target = this;
  if (isStringEmpty(target.value)){
    target.value = '';
    target.placeholder = 'login';
  }

}

function blurPassword(){

  target = this;
  if (isStringEmpty(target.value)){
    target.value = '';
    target.placeholder = 'password';
  }

}

function loginHandler() {

  target = event.target;
  if (!target.classList.contains("login-button")){
    return false;
  }
  if(!validateLoginAndPassword()){
    return false;
  }

  let login = document.querySelector(".login__form")[0];
  let responseStatus = getUsersFromLocalSorage().find(function(element){
    return element.login === login.value;
  });

  if (!responseStatus){
    alert("sign up fail");
    return false;
  }

  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
  stateOfEnvironment.currentUser = responseStatus.user;
  localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));
  preparePage();

  let cofig = Object.assign({}, lastConfig);      //to reload photoPosts
  loadContent(lastReceivedPosts.length, cofig);

  document.querySelector(".dark-background").classList.add("disabled");
  let loginContainer = document.querySelector(".login-container");
  loginContainer.classList.toggle("disabled");
  
}

function validateLoginAndPassword(){

  let loginForm = document.querySelector(".login__form");
  if (!loginForm[0].value){
    alert("invalid login");
    return false;
  }

  return true;

}

function cancelLoginHandler() {

  target = event.target;
  if (!target.classList.contains("invisible-button")){
    return false;
  }

  document.querySelector(".dark-background").classList.add("disabled");
  let loginContainer = document.querySelector(".login-container");
  loginContainer.classList.toggle("disabled");

}

function logoutHandler(){

  let target = event.target;
  if(!target.classList.contains("header__logout")){
    return false;
  }

  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
  stateOfEnvironment.currentUser = null;
  localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));
  preparePage();

  let cofig = Object.assign({}, lastConfig);      //to reload photoPosts
  loadContent(lastReceivedPosts.length, cofig);

}

function showAuthorsFocus(){

  target = this;
  target.placeholder = '';
  let container = document.querySelector(".header__authors-container");
  container.classList.toggle("disabled");
  deleteChildren(container);
  showAuthors();

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

function backHomeHandler(){

  target = event.target;
  if (target.classList.contains("header__logo") || target.classList.contains("footer__logo")){
    let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
    stateOfEnvironment.personalPage = null;
    localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));
    document.querySelector(".about-user").classList.add("disabled");
    loadContent(9);
    resetFilters();

    let sadCat = document.querySelector(".sad-cat");
    if (sadCat){
      sadCat.parentNode.removeChild(sadCat);
    }
  }

  return false;

}

function goToPersonalPageHandler(){

  target = event.target;
  if (!target.closest(".header__form")){
    hideAuthorsList();
  }
  let personalPageOwner = checkBeforeGoToPersonalPage();
  if (!personalPageOwner){
    return false;
  }

  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
  if (stateOfEnvironment.pageState === "more"){
    let zoomed__card = document.querySelector(".card-item--zoomed:not(.add-new-card)");
    zoomed__card.parentNode.removeChild(zoomed__card);
    document.querySelector(".dark-background").classList.toggle("disabled");
    stateOfEnvironment.zoomedPhotoPost = null;
    stateOfEnvironment.pageState = "simple";
  }
  stateOfEnvironment.personalPage = personalPageOwner;
  localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));

  let sadCat = document.querySelector(".sad-cat");
  if (sadCat){
    sadCat.parentNode.removeChild(sadCat);
  }

  preparePage();
  loadContent(9);
  resetFilters();

}

function sortByHandler(){

  target = event.target;
  if (!checkBeforeSortBy()){
    return false;
  }

  let radioButton = target.querySelector(".unselected-ico");
  if (!radioButton){
    return false;
  }

  document.querySelector(".selected-ico").className = "unselected-ico fa fa-circle";
  radioButton.className = "selected-ico fa fa-circle";

  console.log(radioButton.getAttribute("data-sortmode"));
  lastConfig.sort_mode = radioButton.getAttribute("data-sortmode");

  if (lastConfig.author){
    if (lastConfig.sort_mode === "AZ" || lastConfig.sort_mode === "ZA"){  // to prevent one specific problem
      console.log("ignore");
      return false;
    }
  }
  
  let cofig = Object.assign({}, lastConfig);
  loadContent(9, cofig);

}

function resetFilters(){

  let selectedIco = document.querySelector(".selected-ico");
  selectedIco.classList = "unselected-ico fa fa-circle";

  document.querySelector("i[data-sortmode='new']").className = "selected-ico fa fa-circle";

}

function checkBeforeSortBy(){

  let selectItem = target.closest(".sort-by__select-item"); 
  if (!selectItem){
    return false;
  }

  target = selectItem;
  return true;

}

function showOrHideSortByHandler(){

  target = event.target;
  if(!checkBeforeHideOrShowSort()){
    return false;
  }

  let elementSortBy = document.querySelector(".sort-by__container");
  document.querySelector(".dark-background").classList.toggle("disabled");
  elementSortBy.classList.toggle("disabled");

}

function checkBeforeHideOrShowSort(){

  if (target.getAttribute("id") === "sort_by" || target.classList.contains("sort-ico")){
    let elementSortBy = document.querySelector(".sort-by__container");
    setPhotoPostPosition(elementSortBy, true);
    return true;
  }

  if (target.classList.contains("close-button") && target.closest(".sort-by__container")){
    return true;
  }

  return false;

}

function showFilterByHashTagsHandler(){

  target = event.target;
  if (!checkBeforeShowFilterByHashTags()){
    return false;
  }

  filterByHashTags = document.querySelector(".select-hashtag");
  document.querySelector(".dark-background").classList.toggle("disabled");
  filterByHashTags.classList.toggle("disabled");
  setPhotoPostPosition(filterByHashTags, true);

  deleteChildren(document.getElementById("selected-hashtags-in-filter"));
  deleteChildren(document.getElementById("hint-hashtags-in-filter"));

  let currentHashTags = lastConfig.hashTags;
  for (let i = 0; i < currentHashTags.length; i++){
    addHashTag(currentHashTags[i], "selected", filterByHashTags);
  }

  let hintHashTags = getHintHashTags(5);
  for (let i = 0; i < hintHashTags.length; i++){
    addHashTag(hintHashTags[i], "hint", filterByHashTags);
  }

}

function checkBeforeShowFilterByHashTags(){

  if (target.getAttribute("id") === "filter_by" || target.classList.contains("hashtag-ico")){
    return true;
  }
  return false;

}

function addHashTag(hashTag, typeOfHashTag, container){

  let hashTagsContainer;
  let hashTagItem = document.createElement("div");
  hashTagItem.innerHTML = hashTag;

  if (typeOfHashTag === "selected"){
    hashTagsContainer = container.querySelector("#selected-hashtags-in-filter");
    if (!hashTagsContainer){
      hashTagsContainer = container.querySelectorAll(".card-item__hashtags-container")[0];
    }
    hashTagItem.className = "select-hashtag__hashtag-item selected-hashtag";
    let removeIco = document.createElement("i");
    removeIco.className = "close-ico fas fa-times";
    hashTagItem.appendChild(removeIco);
    hashTagsContainer.appendChild(hashTagItem);
  }
  if (typeOfHashTag === "hint"){
    hashTagsContainer = container.querySelector("#hint-hashtags-in-filter");
    if (!hashTagsContainer){
      hashTagsContainer = container.querySelectorAll(".card-item__hashtags-container")[1];
    }
    hashTagItem.className = "select-hashtag__hashtag-item hint-hashtag";
    hashTagsContainer.appendChild(hashTagItem);
  }

  return false;

}

function getHintHashTags(quantity){

  let choosedHashTags = [];
  for (let i = 0; i < quantity; i++){
    choosedHashTags[i] = hashTagsHint[i];
  }
  return choosedHashTags;

}

function cancelFilterByHashTagsHandler(){

  target = event.target;
  if (target.getAttribute("id") !== "cancel-hashtags"){
    return false;
  }

  filterByHashTags = document.querySelector(".select-hashtag");
  document.querySelector(".dark-background").classList.toggle("disabled");
  filterByHashTags.classList.toggle("disabled");

  return true;

}

function addHashTagToSelectedHandler(){

  let target = event.target;
  if (!target.classList.contains("select-hashtag__submit")){
    return false;
  }

  event.preventDefault();

  let container = target.closest(".card-item--zoomed");
  if (!container){
    container = target.closest(".select-hashtag");
  }

  let input = container.querySelector(".select-hashtag__input"); 
  if (isStringEmpty(input.value) || input.value.indexOf(' ') !== -1){
    input.value = '';
    alert("Empty string or Spaces");
    input.focus();  // the string is important to solve another specific problem
    input.blur();
    return false;
  }

  let selectedHashtags = container.querySelectorAll(".selected-hashtag"); 

  let alreadySelected = [].find.call(selectedHashtags, function(element){
    return element.innerText === input.value;
  });

  if (alreadySelected){
    alert("The same hashtag has already been added");
    input.value = '';
    return false;
  }

  addHashTag(input.value, "selected", container);
  input.value = '';
  input.focus();

}

function removeHashTagFromSelectedHandler(){

  target = event.target;
  if (!checkBeforeremoveHashTag()){
    return false;
  }

  target.parentNode.removeChild(target);

}

function checkBeforeremoveHashTag(){

  if (target.classList.contains("close-ico")){
    target = target.closest(".selected-hashtag");
    return true;
  }

  if (!target.classList.contains("selected-hashtag")){
    return false;
  }

  if (target.querySelector(".close-ico")){
    return true;
  }

  return false;

}

function addHashTagFromHintHandler(){

  target = event.target;
  if (!checkBeforeAddHashTagFromHint()){
    return false;
  }

  let container = target.closest(".card-item--zoomed");
  if (!container){
    container = target.closest(".select-hashtag");
  }

  let selectedHashtags = container.querySelectorAll(".selected-hashtag");

  let alreadySelected = [].find.call(selectedHashtags, function(element){
    return element.innerText === target.innerHTML;
  });

  if (alreadySelected){
    alert("The same hashtag has already been added");
    return false;
  }

  addHashTag(target.innerHTML, "selected", container);

  return true;

}

function checkBeforeAddHashTagFromHint(){

  if (!target.classList.contains("hint-hashtag")){
    return false;
  }
  if (target.closest(".select-hashtag")){
    return true;
  }
  if (target.closest(".card-item--zoomed")){
    return true;
  }

  return false;

}

function applyFilterByHashtagsHandler(){

  target = event.target;
  if (target.getAttribute("id") !== "apply-hashtags"){
    return false;
  }

  let selectedHashtags = target.closest(".select-hashtag").querySelectorAll(".selected-hashtag");
  let newConfig = Object.assign({}, lastConfig);
  newConfig.hashTags = [];
  for (let i = 0; i < selectedHashtags.length; i++){
    newConfig.hashTags.push(selectedHashtags[i].innerText);
  }

  let sadCat = document.querySelector(".sad-cat");
  if (sadCat){
    sadCat.parentNode.removeChild(sadCat);
  }
  loadContent(9, newConfig);

}

function blurSelectHashtag(){

  let target = this;
  if (isStringEmpty(target.value)){
    target.value = '';
    target.placeholder = 'Type #hashtags here';
  }

}

function hideAuthorsList(){
  let headerAuthorsContainer = document.querySelector(".header__authors-container");
  if (!headerAuthorsContainer.classList.contains("disabled")){
    headerAuthorsContainer.classList.toggle("disabled");
    headerInput = document.querySelector(".header__input");
    headerInput.placeholder = 'Find more authors';
  }
}

function checkBeforeGoToPersonalPage(){

  if (target.classList.contains("header__current-user-name")){
    return getStateOfEnvironmentFromLocalSorage().currentUser;
  }
  if (target.classList.contains("header__author-name")){
    hideAuthorsList();
    return target.innerText;
  }
  if (target.classList.contains("card-item__photo-owner")){
    
    let postId = null;
    if (target.closest(".card-item--zoomed")){    //rewrite the block to "check by id"
      postId = getStateOfEnvironmentFromLocalSorage().zoomedPhotoPost;
    }
    else{
      postId = target.closest(".card-item").getAttribute("id");
    }

    let author = photoPosts.getPhotoPost(postId).author;

    return author;
  }

  return false;

}

function showAddNewCardHandler(){

  target = event.target;
  if (!checkBeforeShowAddNewCard()){
    return false;
  }

  let addNewCard = document.querySelector(".add-new-card");
  deleteChildren(addNewCard.querySelector(".card-item__hashtags-container"));
  addNewCard.querySelector("textarea").value = '';
  setPhotoPostPosition(addNewCard, true);
  document.querySelector(".dark-background").classList.toggle("disabled");
  addNewCard.classList.toggle("disabled");

}

function checkBeforeShowAddNewCard(){

  if (!getStateOfEnvironmentFromLocalSorage().currentUser){
    return false;
  }
  if (target.getAttribute("id") === "add_new" || target.classList.contains("add-ico")){
    return true;
  }

  return false;

}

function cancelAddNewCardHandler(){

  target = event.target;
  if (target.getAttribute("id") !== "cancel-add"){
    return false;
  }

  let addNewCard = document.querySelector(".add-new-card");
  setPhotoPostPosition(addNewCard, true);
  document.querySelector(".dark-background").classList.toggle("disabled");
  addNewCard.classList.toggle("disabled");

}

function applyAddNewCardHandler(){

  target = event.target;
  if (target.getAttribute("id") !== "apply-add"){
    return false;
  }

  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
  let container = target.closest(".add-new-card");
  let selectedHashtagsItem = container.querySelectorAll(".selected-hashtag");
  let preparedHashTags = [];
  for (let i = 0; i < selectedHashtagsItem.length; i++){
     preparedHashTags.push(selectedHashtagsItem[i].innerText);
  }

  let textarea = container.querySelector("textarea");
  let description = textarea.value;

  let photoPost = {
    author: stateOfEnvironment.currentUser,
    createdAt: new Date(),
    description: description,
    hashTags: preparedHashTags,
    photoLink: "images/cat.png",
    id: getId(0, 1000),
    likes: []
  };

  function getId(min, max) {
    let id = Math.floor(Math.random() * (max - min)) + min;
    while (photoPosts.getPhotoPost(id+ '')){
      console.log(id);
      id = Math.floor(Math.random() * (max - min)) + min;
    }
    return id + '';
  }

  console.log(photoPost);

  if (!addPhotoPost(photoPost)){
    alert("invalid photopost");
    if (isStringEmpty(textarea.value)){
      textarea.value = '';
    }
    return false;
  }

  textarea.value = '';

  if (lastReceivedPosts.length < 9){
    let sadCat = document.querySelector(".sad-cat");
    if (sadCat){
      sadCat.parentNode.removeChild(sadCat);
    }
    loadContent(lastReceivedPosts.length + 1, lastConfig);
  }

  alert("Photo post has been added");

  return true;

}

function showEditPhotoPostHandler(){

  target = event.target;
  if (!checkBeforeShowEditPhotoPost()){
    return false;
  }

  document.querySelector(".main-content-wrapper").removeChild(target.closest(".card-item--zoomed"));

  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
  let nowEditPhotoPost = stateOfEnvironment.zoomedPhotoPost;
  stateOfEnvironment.pageState = "edit";
  localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));

  let editedPhotoPost = createPhotoPost("edit", photoPosts.getPhotoPost(nowEditPhotoPost));

  let cardsContainer = document.querySelector(".cards-container");
  document.querySelector(".main-content-wrapper").insertBefore(editedPhotoPost, cardsContainer);

  setPhotoPostPosition(editedPhotoPost);

}

function checkBeforeShowEditPhotoPost(){

  if (!target.classList.contains("edit-ico")){
    return false;
  }
  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
  if (stateOfEnvironment.currentUser === photoPosts.getPhotoPost(stateOfEnvironment.zoomedPhotoPost).author){
    return true;
  }

}

function cancelEditPhotoPostHandler(){

  target = event.target;
  if(!checkBeforeCancelEditPhotoPost()){
    return false;
  }

  document.querySelector(".dark-background").classList.toggle("disabled");
  document.querySelector(".main-content-wrapper").removeChild(target.closest(".card-item--zoomed"));
  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
  stateOfEnvironment.pageState = "simple";
  stateOfEnvironment.zoomedPhotoPost = null;
  localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));

  return true;

}

function checkBeforeCancelEditPhotoPost(){

  if (target.getAttribute("id") === "cancel-edit"){
    return true;
  }

  return false;

}

function applyEditPhotoPostHandler(){

  target = event.target;
  if (!checkBeforeApplyEditPhotoPost()){
    return false;
  }

  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
  let container = target.closest(".card-item--zoomed");
  let selectedHashtagsItem = container.querySelectorAll(".selected-hashtag");
  let preparedHashTags = [];
  for (let i = 0; i < selectedHashtagsItem.length; i++){
     preparedHashTags.push(selectedHashtagsItem[i].innerText);
  }

  let textarea = container.querySelector("textarea");
  let description = textarea.value;

  let photoPost = {
    description: description,
    hashTags: preparedHashTags,
  };

  console.log(photoPost);

  if (!editPhotoPost(photoPost, stateOfEnvironment.zoomedPhotoPost)){
    alert("invalid photopost");
    return false;
  }

  let cofig = Object.assign({}, lastConfig);      //to reload photoPosts
  loadContent(lastReceivedPosts.length, cofig);

  let newPhotoPost = createPhotoPost("more", photoPosts.getPhotoPost(stateOfEnvironment.zoomedPhotoPost));
  // console.log(newPhotoPost);
  container.parentNode.replaceChild(newPhotoPost, container);
  setPhotoPostPosition(newPhotoPost);

  return true;

}

function checkBeforeApplyEditPhotoPost(){

  if (target.getAttribute("id") === "submit-edit"){
    return true;
  }

  return false;

}

function normalizeBodyHandler(){

  if (document.body.hasAttribute('style') && getStateOfEnvironmentFromLocalSorage().pageState !== "edit"){
    document.body.removeAttribute("style");
  }

}

function findAuthorHandler(){

  let target = event.target;

  if (!checkBeforeFindAuthor(target)){
    return false;
  }

  let inputValue = target.value;

  let responseStatus = getUserProfile(inputValue);
  if (!responseStatus){
    alert("There is no such user");
    return false;
  }

  let stateOfEnvironment = getStateOfEnvironmentFromLocalSorage();
  stateOfEnvironment.personalPage = responseStatus.user;
  localStorage.setItem("stateOfEnvironment", JSON.stringify(stateOfEnvironment));

  hideAuthorsList();
  target.value = "";
  target.blur();

  preparePage();
  loadContent(9);
  resetFilters();

  console.log(responseStatus);

}

function checkBeforeFindAuthor(target){

  if (target.classList.contains("header__input") && event.keyCode === 13){
    event.preventDefault();
    return !isStringEmpty(target.value);
  }

  return false;

}

function appendPhotoPost (photoPost){     //just add photoCardItem in cardContainer

  let cardsContainer = document.querySelector(".cards-container");
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
  selectHashtag__input.addEventListener("focus", focusInput);
  selectHashtag__input.addEventListener("blur", blurSelectHashtag);
  selectHashtag__input.setAttribute("type", "text");
  selectHashtag__input.setAttribute("name", "add-hashtag");
  selectHashtag__input.setAttribute("placeholder", "Type #hashtags here");
  selectHashtag__input.setAttribute("autocomplete", "off");
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
    submit.setAttribute("id", "submit-edit");
    submit.className = "button narrow-button";
  }
  else{
    submit.className = "button narrow-button disabled";
  }
  submit.innerHTML = "Submit changes";
  cardItem__buttonContainer.appendChild(submit);

  let cancel = document.createElement('div');
  if (mode === "edit"){
    cancel.setAttribute("id", "cancel-edit");
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

function showSadCat(){

  let container = document.createElement("div");
  container.className = "sad-cat";
  let img = new Image();
  img.src = "images/sad.jpg";
  img.className = "sad-cat__image";
  container.appendChild(img);
  
  let message = document.createElement("div");
  message.className = "sad-cat__message-container";
  container.appendChild(message);

  let oops = document.createElement("span");
  oops.innerHTML = "Oops!";
  oops.className = "sad-cat__oops";
  message.appendChild(oops);

  let paragraph = document.createElement("p");
  paragraph.innerHTML = "We can't find anything";
  paragraph.className = "sad-cat__message";
  message.appendChild(paragraph);

  console.log(container);
  document.querySelector(".cards-container").appendChild(container);

}

}());