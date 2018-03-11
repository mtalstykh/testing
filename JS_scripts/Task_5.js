document.addEventListener("click", zoomPhotoPost);

document.addEventListener("click", loadMore);

document.addEventListener("click", removeHandler);

function addPhotoPost(photoPost){

  if(!photoPosts.addPhotoPost(photoPost)){
    return false;
  }

  let cofig = Object.assign({}, lastConfig);
  loadContent(lastReceivedPosts.length, cofig);

  return true;

}

function removeHandler(event){
	if (event.target.classList.contains("trash-ico")){
		removePhotoPost();
	}
}

function editPhotoPost(photoPost, selectedId){

	selectedId = selectedId || stateOfEnvironment.zoomedPhotoPost;

	let responseStatus = photoPosts.editPhotoPost(selectedId, photoPost);
	// console.log(responseStatus);
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
	
	if (stateOfEnvironment.pageState === "more"){
		let newPhotoPost = createPhotoPost('more', editedPhotoPost);
		let oldPhotoPost = document.querySelector(".card-item--zoomed");
		oldPhotoPost.parentNode.replaceChild(newPhotoPost, oldPhotoPost);

		setPhotoPostPosition(document.querySelector('.card-item--zoomed'));
	}
	
	return true;

}

function removePhotoPost(selectedId){

  selectedId = selectedId || stateOfEnvironment.zoomedPhotoPost;

  if (!photoPosts.removePhotoPost(selectedId)){
    console.log("photoPost was deleted or didn't exist");
    return false;
  }

  if (!deleteLocalPhotoPost(selectedId)){
    console.log("It isn't local photoPost");
    // return false;
  }

	if (stateOfEnvironment.pageState === "more"){
		let zoomed__card = document.querySelector(".card-item--zoomed");
		zoomed__card.parentNode.removeChild(zoomed__card);
		document.querySelector(".dark-background").classList.toggle("disabled");
	}

	stateOfEnvironment.pageState = "simple";
	stateOfEnvironment.zoomedPhotoPost = null;

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
	
	var responseStatus = loadContent(3, lastConfig);

	if (responseStatus === "Nothing found"){
		alert("Nothing found");
		return true;
	}

	if (responseStatus === "NO MORE"){
		alert("NO MORE");
		return true;
	}

}

function zoomPhotoPost(event){

  target = event.target;
  let photoPost;
  if (!target.classList.contains("card-item__photo") && !target.classList.contains("close-button")){
    return false;
  }
  photoPost = target.closest(".card-item");

  document.querySelector(".dark-background").classList.toggle("disabled");

  if (photoPost.classList.contains("card-item--zoomed")){
    document.querySelector(".main-content-wrapper").removeChild(photoPost);
    stateOfEnvironment.pageState = 'simple';
    stateOfEnvironment.zoomedPhotoPost = null;
    return true;
  }

  let id = photoPost.getAttribute("id");
  let cardItem = createPhotoPost("more", photoPosts.getPhotoPost(id));
  let cardsContainer = document.querySelector(".cards-container");
  document.querySelector(".main-content-wrapper").insertBefore(cardItem, cardsContainer);

  setPhotoPostPosition(cardItem);

  // let distanceToTheBottom = document.body.scrollHeight - window.pageYOffset;
  // let top;
  // if (distanceToTheBottom < cardItem.clientHeight){
  //   console.log(distanceToTheBottom);
  //   top = document.body.scrollHeight - cardItem.clientHeight;
  // }
  // else{
  //   top = window.pageYOffset;
  // }
  // cardItem.style.top = top + "px";
  // stateOfEnvironment.pageState = "more";
  // stateOfEnvironment.zoomedPhotoPost = id;

  stateOfEnvironment.pageState = "more";
  stateOfEnvironment.zoomedPhotoPost = id;

}

function setPhotoPostPosition(cardItem){

	let distanceToTheBottom = document.body.scrollHeight - window.pageYOffset;
  let top;
  if (distanceToTheBottom < cardItem.clientHeight){
    // console.log(distanceToTheBottom);
    top = document.body.scrollHeight - cardItem.clientHeight;
  }
  else{
    top = window.pageYOffset;
  }
  cardItem.style.top = top + "px";

}

function preparePage(){

  if (stateOfEnvironment.personalPage){
    document.querySelector(".about-user").classList.remove("disabled");

    let userProfile = getUserProfile(stateOfEnvironment.personalPage);
    document.querySelector(".about-user__avatar").setAttribute("src", userProfile.avatar);
    document.querySelector(".about-user__name").innerHTML = stateOfEnvironment.personalPage;
    document.querySelector(".about-user__description-text").innerHTML = userProfile.aboutYou;
    document.querySelector(".about-user__location").innerHTML = userProfile.country + ", " + userProfile.city;

    // loadContent(9, {author: stateOfEnvironment.personalPage});
  }
  if (stateOfEnvironment.currentUser){
    document.querySelector(".header__login").classList.add("disabled");
    document.querySelector(".header__logout").classList.remove("disabled");
    let currentUserName = document.querySelector(".header__current-user-name");
    currentUserName.classList.remove("disabled");
    currentUserName.innerHTML = stateOfEnvironment.currentUser.split(' ')[0];   
  }
  // else{
  //   document.querySelector(".about-user").classList.add("disabled");
  // }

}

function loadContent(quantity, filterConfig){       //для load more filterConfig задавать lastConfig, для Edit передавать объект ручками
  
  let skip = lastReceivedPosts.length;
  let receivedPhotoPosts;

  if (!filterConfig){
    filterConfig = {
      hashTags: []
    };
  }

  if (('hashTags' in filterConfig) !== true){
    filterConfig.hashTags = [];
  }

  if (stateOfEnvironment.personalPage){
  	filterConfig.author = stateOfEnvironment.personalPage;
  }

  if(filterConfig !== lastConfig){
    skip = 0;
  }

  receivedPhotoPosts = photoPosts.getPhotoPosts(skip, quantity, filterConfig);
  if (receivedPhotoPosts === false){
    return false;
  }

  if (skip !== 0 && receivedPhotoPosts.length < quantity){					//danger string!!!!!!!!
  	loadContentStatus = "CONTINUE:  it's all";
  }

  if (skip !== 0 && receivedPhotoPosts.length === 0){					//danger string!!!!!!!!
  	loadContentStatus = "NO MORE";
  }

  if (skip === 0 && receivedPhotoPosts.length < quantity){					//danger string!!!!!!!!
  	loadContentStatus = "START: it's all";
  }

  if (skip === 0 && receivedPhotoPosts.length === 0){					//danger string!!!!!!!!
  	loadContentStatus = "Nothing found";
  }

  if (receivedPhotoPosts.length === quantity){					//danger string!!!!!!!!
  	loadContentStatus = "maybe there are some things";
  }

  if (skip === 0 && lastReceivedPosts.length !== 0){
    deleteChildren(document.getElementsByClassName("cards-container")[0]);
  }

  if (skip !== 0){
    for (var i = 0; i < receivedPhotoPosts.length; i++) {
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

  console.log(lastConfig);
  console.log(lastReceivedPosts);

  return loadContentStatus;

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

  if (isUserLikedThePhoto(stateOfEnvironment.currentUser, photoPost)){
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
  if (mode === 'simple' || stateOfEnvironment.currentUser !== photoPost.author){
    editIco.className = "edit-ico fas fa-pencil-alt disabled";
  }
  else{
    editIco.className = "edit-ico fas fa-pencil-alt";
  }
  cardItem__controlButtons.appendChild(editIco);

  let trashIco = document.createElement('i');
  if (mode === 'simple' || stateOfEnvironment.currentUser !== photoPost.author){
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
    hashtagItem.className = "card-item__hashtag-item selected-hashtag"
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
    hashtagItem.innerHTML = hashTagsHint[i]
    cardItem__hashtagsContainer.appendChild(hashtagItem);
  }

  let titleEditDescription = document.createElement('p');
  if (mode === "edit"){
    titleEditDescription.className = "card-item__title-edit-description";
  }
  else{
    titleEditDescription.className = "card-item__title-edit-description disabled";
  }
  titleEditDescription.innerHTML = "Edit description:"
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

  // return selectedPhotoPostIndex;

	if (selectedPhotoPostIndex !== -1){
		return selectedPhotoPostIndex;
	}
	else{
		return false;
	}

}

function getUserProfile(userName) {
  
  return users.find(function(element){
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
  let month = date.getMonth();
  if (month < 10){
    month =  '0' + month;
  }
  let year = date.getFullYear() - 2000;
  return [day,month,year].join('.');

}

let loadContentStatus = 'maybe there are some things';

let lastReceivedPosts = [];       //keep last received post

let lastConfig = {};        //keep last used config

let stateOfEnvironment = {
  personalPage: null,
  currentUser: "Alexander Martinchik",
  pageState: "simple",
  zoomedPhotoPost: null
};

let hashTagsHint = [
  "winter",
  "morning",
  "forest",
  "darkness",
  "happy",
  "friends"
];

let users = [

  {
    user: 'Maksim Talstykh',
    country: 'Belarus',
    city: 'Minsk',
    aboutYou: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, ex possimus, aliquid repudiandae maiores soluta in.',
    avatar: "images/cat.png"
  },

  {
    user: 'Dmitry Shamov',
    country: 'Japan',
    city: 'Tokio',
    aboutYou: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, ex possimus, aliquid repudiandae maiores soluta in.',
    avatar: "images/cat.png"
  },

  {
    user: 'Alexander Martinchik',
    country: 'Poland',
    city: 'Warsaw',
    aboutYou: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, ex possimus, aliquid repudiandae maiores soluta in.',
    avatar: "images/cat.png"
  },

  {
    user: 'Dirk Dallas',
    country: 'UAE',
    city: 'Dubai',
    aboutYou: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, ex possimus, aliquid repudiandae maiores soluta in.',
    avatar: "images/cat.png"
  },

  {
    user: 'Jannik Obenhoff',
    country: 'Germany',
    city: 'Munich',
    aboutYou: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, ex possimus, aliquid repudiandae maiores soluta in.',
    avatar: "images/cat.png"
  },

  {
    user: 'Eric Kimberlin',
    country: 'USA',
    city: 'Seattle',
    aboutYou: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, ex possimus, aliquid repudiandae maiores soluta in.',
    avatar: "images/cat.png",
  },

  {
    user: 'Ryan Millier',
    country: 'USA',
    city: 'New York',
    aboutYou: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, ex possimus, aliquid repudiandae maiores soluta in.',
    avatar: "images/cat.png"
  },

  {
    user: 'Emilie Ristevski',
    country: 'Australia',
    city: 'Sydney',
    aboutYou: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, ex possimus, aliquid repudiandae maiores soluta in.',
    avatar: "images/cat.png"
  }

];