const fs = require('fs');

function readPhotoPosts (){

  let photoPosts = fs.readFileSync('./data/photoPosts.json');
  photoPosts = JSON.parse(photoPosts.toString());
  return photoPosts;

}

module.exports.readPhotoPosts = readPhotoPosts;

function likeThePost (selectedId){

  let photoPost = photoPosts.getPhotoPost(selectedId);

  let likeStatus = photoPost.likes.findIndex(function(element){
    return element === getStateOfEnvironmentFromLocalSorage().currentUser;
  });

  if (likeStatus === -1)
  {
    photoPost.likes.push(getStateOfEnvironmentFromLocalSorage().currentUser);
  }
  else{
    photoPost.likes.splice(likeStatus, 1);
  }

  removePhotoPost(selectedId);
  let photoPostsFromStorage = getPhotoPostsFromLocalSorage();
  photoPostsFromStorage.push(photoPost);
  localStorage.setItem("photoPosts", JSON.stringify(photoPostsFromStorage));
  return likeStatus;

}

function removePhotoPost (selectedId){

  let photoPosts = readPhotoPosts();

  for (let i = 0; i < photoPosts.length; i++){
    if (photoPosts[i].id === selectedId + ''){
      photoPosts.splice(i, 1);
      photoPosts = JSON.stringify(photoPosts);
      fs.writeFileSync('./data/photoPosts.json', photoPosts);
      return true;
    }
  }
  return false;

}

function getPhotoPost (selectedId){

  let photoPosts = readPhotoPosts();

  for (let i = 0; i < photoPosts.length; i++){
    if (photoPosts[i].id === selectedId + ''){
      return photoPosts[i];
    }
  }
  return {};

}

function validatePhotoPost (photoPost){

  if (photoPost === undefined || typeof (photoPost.id) !== "string" || isStringEmpty(photoPost.id)){
    return false;
  }
  if (typeof (photoPost.description) !== "string" || photoPost.description.length > 200 || isStringEmpty(photoPost.description)){
    return false;
  }

  if (photoPost.createdAt instanceof Date === false){
    return false;
  }
  
  if (typeof (photoPost.author) !== "string" || isStringEmpty(photoPost.author)){
    return false;
  }
  if (typeof (photoPost.photoLink) !== "string" || isStringEmpty(photoPost.photoLink)){
    return false;
  }
  if (photoPost.hashTags && typeof(photoPost.hashTags) === 'object'){
    for (let i = 0; i < photoPost.hashTags.length; i++){
      if (typeof (photoPost.hashTags[i]) !== "string" || isStringEmpty(photoPost.hashTags[i])){
        return false;
      }
    }
  }
  else{
    return false;
  } 

  if (photoPost.likes && typeof(photoPost.likes) === 'object'){
    for (let i = 0; i < photoPost.likes.length; i++){
      if (typeof (photoPost.likes[i]) !== "string" || isStringEmpty(photoPost.likes[i])){
        return false;
      }
    }
  }
  else{
    return false;  
  } 

  return true;

}

function addPhotoPost (photoPost){

  let photoPosts = readPhotoPosts();
  
  if (!photoPost || typeof photoPost !== "object") return false;
  if (photoPost instanceof Array){
    return false;
  }
  if (!photoPost.hashTags){
    return false;
  }
  for (let i = 0; i < photoPosts.length; i++){
    if (photoPosts[i].id === photoPost.id + ''){
      return false;
    }
  }

  photoPost.createdAt = new Date();
  photoPost.likes = [];

  photoPost = hashTagsToLowerCase(photoPost);

  if (!validatePhotoPost(photoPost)){
    return false;
  }
  photoPosts.push(photoPost);
  // localStorage.setItem("photoPosts", JSON.stringify(photoPosts));
  photoPosts = JSON.stringify(photoPosts);
  fs.writeFileSync('./data/photoPosts.json', photoPosts);
  return true;
  
}

function editPhotoPost (selectedId, photoPost){

  if (!photoPost) return false;

  if(Array.isArray(photoPost)){        //array check
    return false;
  }

  if(isObjectEmpty(photoPost)){
    return false;
  }

  if (!validateBeforeEdit(photoPost)){
    return false;
  }

  let selectedPost = getPhotoPost(selectedId);
  if (isObjectEmpty(selectedPost)){
    return false;
  }

  if ('photoLink' in photoPost){
    selectedPost.photoLink = photoPost.photoLink;
  }

  if ('description' in photoPost){
    selectedPost.description = photoPost.description;
  }

  if ('hashTags' in photoPost){
    selectedPost.hashTags = photoPost.hashTags;
  }

  if ('likes' in photoPost){
    selectedPost.likes = photoPost.likes;
  }

  removePhotoPost(selectedId);
  let photoPosts = readPhotoPosts();
  photoPosts.push(selectedPost);
  // localStorage.setItem("photoPosts", JSON.stringify(photoPostsFromStorage));
  photoPosts = JSON.stringify(photoPosts);
  fs.writeFileSync('./data/photoPosts.json', photoPosts);

  return true;

}

function getPhotoPosts (skip, top, filterConfig){

  let photoPosts = readPhotoPosts();

  if (typeof(skip) !== "number" || typeof(top) !== "number"){
    return false;
  }

  if (typeof filterConfig === 'string' && isStringEmpty(filterConfig)){
    return false;
  }

  if (filterConfig instanceof Array){
    return false;
  }

  let filteredPosts = [];
  let filterFlag;
  if (!filterConfig){
    filterConfig = {hashTags: []};
  }

  if (!filterConfig.hashTags){
    filterConfig.hashTags = [];
  }
  else{
    filterConfig = hashTagsToLowerCase(filterConfig);
  }

  for (let i = 0; i < photoPosts.length; i++) {
    filterFlag = true;
    for (let key in filterConfig) {
      if (!photoPosts[i][key] || key === 'hashTags') continue;
      if (filterConfig[key] != photoPosts[i][key]){
        filterFlag = false;
      }
      break;
    }

    if (filterFlag && isBContainsA(filterConfig.hashTags, photoPosts[i].hashTags)){
      filteredPosts.push(photoPosts[i]);
    }
  }

  switch(filterConfig.sort_mode){
    case "AZ":
      filteredPosts = sortByAuthor(true, filteredPosts);
    break;
    case "ZA":
      filteredPosts = sortByAuthor(false, filteredPosts);
    break;
    case "new":
      filteredPosts = sortByDate(true, filteredPosts);
    break;
    case "old":
      filteredPosts = sortByDate(false, filteredPosts);
    break;
    default:
      filteredPosts = sortByDate(true, filteredPosts);
    break;
  }

  filteredPosts = filteredPosts.splice(skip, top);
  return filteredPosts;

}

function sortByAuthor (sort_mode, object){

  function compareAuthors_AZ(a, b){

    if (a.author > b.author) return 1;
    if (a.author < b.author) return -1;

  }

  function compareAuthors_ZA(a, b){

    if (a.author < b.author) return 1;
    if (a.author > b.author) return -1;

  }

  if (sort_mode){ //if true - AZ, else - ZA
    return object.sort(compareAuthors_AZ);
  }
  else{
    return object.sort(compareAuthors_ZA);
  }

}

function sortByDate (sort_mode, object){

  function compareDate_newFirst(a, b){

    if (a.createdAt < b.createdAt){
      return 1;
    }
    if (a.createdAt > b.createdAt){
      return -1;
    }

  }

  function compareDate_oldFirst(a, b){

    if (a.createdAt > b.createdAt){
      return 1;
    }
    if (a.createdAt < b.createdAt){
      return -1;
    }

  }

  if (sort_mode){ //if true - new first, else - old first
    return object.sort(compareDate_newFirst);
  }
  else{
    return object.sort(compareDate_oldFirst);
  }

}

function isBContainsA(a,b){ // is B contains A

  if(!Array.isArray(a)) return false;

  for(let i=0;i<a.length;i++){ 
    if(b.indexOf(a[i])===-1){
      return false; 
    }
  } 
  return true;

}

function hashTagsToLowerCase(object){

  for (let i = 0; i < object.hashTags.length; i++){
    object.hashTags[i]=object.hashTags[i].toLowerCase();
  }
  return object;

}

function isObjectEmpty(obj) {

  return Object.keys(obj).length === 0;

}

function isStringEmpty(str) {      //to catch '' and also '      '

  if (str.trim() == ''){ 
    return true;
  }
  return false;

}

function validateBeforeEdit(photoPost) {

  let isChangeFlag = false;

  if ('photoLink' in photoPost){
    if (typeof (photoPost.photoLink) !== "string" || isStringEmpty(photoPost.photoLink)){
      return false;
    }
    isChangeFlag = true;
  }

  if ('description' in photoPost){
    if (typeof (photoPost.description) !== "string" || photoPost.description.length >200 || isStringEmpty(photoPost.description)){
      return false;
    }
    isChangeFlag = true;
  }

  if ('hashTags' in photoPost){
    if (typeof(photoPost.hashTags) === 'object'){
      for (let i = 0; i < photoPost.hashTags.length; i++) {
        if (typeof (photoPost.hashTags[i]) !== "string" || isStringEmpty(photoPost.hashTags[i])){
          return false;
        }
      }
      isChangeFlag = true;
    }
    else{
      return false;
    }
  }

  if ('likes' in photoPost){
    if (typeof(photoPost.likes) === 'object'){
      for (let i = 0; i < photoPost.likes.length; i++){
        if (typeof (photoPost.likes[i]) !== "string" || isStringEmpty(photoPost.likes[i])){
          return false;
        }
      }
      isChangeFlag = true; 
    }
    else{
      return false;
    }
  }

  return isChangeFlag;

}

module.exports.removePhotoPost = removePhotoPost;
module.exports.getPhotoPost = getPhotoPost;
module.exports.validatePhotoPost = validatePhotoPost;
module.exports.addPhotoPost = addPhotoPost;
module.exports.editPhotoPost = editPhotoPost;
module.exports.getPhotoPosts = getPhotoPosts;
module.exports.likeThePost = likeThePost;