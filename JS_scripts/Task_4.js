let photoPosts = (function () {

function likeThePost (selectedId){

  let photoPost = photoPosts.getPhotoPost(selectedId);

  let likeStatus = photoPost.likes.findIndex(function(element){
    return element === stateOfEnvironment.currentUser;
  });

  if (likeStatus === -1)
  {
    photoPost.likes.push(stateOfEnvironment.currentUser);
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

  let photoPosts = getPhotoPostsFromLocalSorage();

  for (let i = 0; i < photoPosts.length; i++){
    if (photoPosts[i].id === selectedId){
      photoPosts.splice(i, 1);
      localStorage.setItem("photoPosts", JSON.stringify(photoPosts));
      return true;
    }
  }
  return false;

}

function getPhotoPost (selectedId){

  let photoPosts = getPhotoPostsFromLocalSorage();

  for (let i = 0; i < photoPosts.length; i++){
    if (photoPosts[i].id === selectedId){
      return photoPosts[i];
    }
  }
  return false;

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

  let photoPosts = getPhotoPostsFromLocalSorage();
  
  if (!photoPost || typeof photoPost !== "object") return false;
  if (photoPost instanceof Array){
    return false;
  }
  if (!photoPost.hashTags){
    return false;
  }
  for (let i = 0; i < photoPosts.length; i++){
    if (photoPosts[i].id === photoPost.id){
      return false;
    }
  }

  photoPost = hashTagsToLowerCase(photoPost);

  if (!validatePhotoPost(photoPost)){
    return false;
  }
  photoPosts.push(photoPost);
  localStorage.setItem("photoPosts", JSON.stringify(photoPosts));
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

  let selectedPost = photoPosts.getPhotoPost(selectedId);
  if (!selectedPost){
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
  let photoPostsFromStorage = getPhotoPostsFromLocalSorage();
  photoPostsFromStorage.push(selectedPost);
  localStorage.setItem("photoPosts", JSON.stringify(photoPostsFromStorage));

  return true;

}

function getPhotoPosts (skip, top, filterConfig){

  let photoPostsFromStorage = getPhotoPostsFromLocalSorage();

  if (typeof(skip) !== "number" || typeof(top) !== "number"){
    return false;
  }

  if (typeof filterConfig === 'string' && isStringEmpty(filterConfig)){
    console.log('YES');
    return false;
  }

  // новая строка. Возможно из-за нее все сломается
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

  for (let i = 0; i < photoPostsFromStorage.length; i++) {
    filterFlag = true;
    for (let key in filterConfig) {
      if (!photoPostsFromStorage[i][key] || key==='hashTags') continue;
      if (filterConfig[key] != photoPostsFromStorage[i][key]){
        filterFlag = false;
      }
      break;
    }

    if (filterFlag && isBContainsA(filterConfig.hashTags, photoPostsFromStorage[i].hashTags)){
      filteredPosts.push(photoPostsFromStorage[i]);
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
  }

  return isChangeFlag;

}

// testing

// console.log(photoPosts);

// console.log("_________Remove photoPost:");

// console.log('remove invalid_id: 999');
// console.log(photoPosts.removePhotoPost('999'));
// console.log(photoPosts);
// console.log('remove valid_id: 12');
// console.log(photoPosts.removePhotoPost('12'));
// console.log(photoPosts);



// console.log("_________Get photoPost:");

// console.log('get valid_id: 2');
// console.log(photoPosts.getPhotoPost('2'));
// console.log('get invalid_id: 999');
// console.log(photoPosts.getPhotoPost('999'));



// console.log('_________Validate photoPost:');

// let valid_photoPost = {
//   id: '55',
//   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'Dmitry Shamov',
//   photoLink: 'images/1.jpg',
//   hashTags: ['japan','summer'],
//   likes: []
// };
// console.log('valid_photoPost');
// console.log(valid_photoPost);
// console.log(photoPosts.validatePhotoPost(valid_photoPost));

// let invalid_id = {
//   id: 12,
//   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'Dmitry Shamov',
//   photoLink: 'images/1.jpg',
//   hashTags: ['japan','summer'],
//   likes: []
// };
// console.log('invalid_id');
// console.log(invalid_id);
// console.log(photoPosts.validatePhotoPost(invalid_id));

// let invalid_description = {
//   id: '12',
//   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fugasit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fugasit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'Dmitry Shamov',
//   photoLink: 'images/1.jpg',
//   hashTags: ['japan','summer'],
//   likes: []
// };
// console.log('too long description');
// console.log(invalid_description);
// console.log(photoPosts.validatePhotoPost(invalid_description));

// let invalid_author = {
//   id: '99',
//   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fugasit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fugasit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 5,
//   photoLink: 'images/1.jpg',
//   hashTags: ['japan','summer'],
//   likes: []
// };
// console.log('invalid_author');
// console.log(invalid_author);
// console.log(photoPosts.validatePhotoPost(invalid_author));

// let invalid_photoLink = {
//   id: '12',
//   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fugasit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fugasit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'Dmitry Shamov',
//   photoLink: [],
//   hashTags: ['japan','summer'],
//   likes: []
// };
// console.log('invalid_photoLink');
// console.log(invalid_photoLink);
// console.log(photoPosts.validatePhotoPost(invalid_photoLink));

// let invalid_hashTags = {
//   id: '12',
//   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fugasit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fugasit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'Dmitry Shamov',
//   photoLink: 'images/1.jpg',
//   // hashTags: ['japan','summer'],
//   likes: []
// };
// console.log('invalid_hashTags');
// console.log(invalid_hashTags);
// console.log(photoPosts.validatePhotoPost(invalid_hashTags));

// let invalid_likes = {
//   id: '12',
//   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fugasit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fugasit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'Dmitry Shamov',
//   photoLink: 'images/1.jpg',
//   hashTags: ['japan','summer'],
//   // likes: []
// };
// console.log('invalid_likes');
// console.log(invalid_likes); 
// console.log(photoPosts.validatePhotoPost(invalid_likes));



// console.log("_________Add photoPost:");

// console.log('not unique id: 19');
// console.log(photoPosts.getPhotoPost('19'));
// console.log(photoPosts.addPhotoPost(photoPosts.getPhotoPost('19')));
// console.log('invalid_photoPost');
// console.log(invalid_author);
// console.log(photoPosts.addPhotoPost(invalid_author));
// console.log('valid_photoPost');
// console.log(valid_photoPost);
// console.log(photoPosts.addPhotoPost(valid_photoPost));



// console.log("_________Edit photoPost:");

// console.log('valid_photoPost');
// console.log('14', { hashTags: ['123', '12', '12321']});
// console.log(photoPosts.editPhotoPost('14', {description: "YO!", hashTags: ['123', '12', '12321']}));

// console.log('invalid_photoPost - without id');
// console.log({ hashTags: ['123', '12', '12321']});
// console.log(photoPosts.editPhotoPost({ hashTags: ['123', 12, '12321']}));

// console.log('invalid_photoPost - attempt to change id');
// console.log('14', { id: '66', description: "YO!", hashTags: ['123', '12', '12321']});
// console.log(photoPosts.editPhotoPost('14', { id: '66', description: "YO!", hashTags: ['123', '12', '12321']}));

// console.log('invalid_photoPost - attempt to change date');
// console.log('14', { createdAt: new Date('2018-10-23T23:00:00'), description: "YO!", hashTags: ['123', '12', '12321']});
// console.log(photoPosts.editPhotoPost('14', { createdAt: new Date('2018-10-23T23:00:00'), description: "YO!", hashTags: ['123', '12', '12321']}));

// console.log('invalid_photoPost - attempt to change author');
// console.log('14', { author: "Mark Dany", description: "YO!", hashTags: ['123', '12', '12321']});
// console.log(photoPosts.editPhotoPost('14', { author: "Mark Dany", description: "YO!", hashTags: ['123', '12', '12321']}));

// console.log('invalid_photoPost - empty object');
// console.log('14', {});
// console.log(photoPosts.editPhotoPost('14', {}));

// console.log('invalid_photoPost - not an object');
// console.log('14', 123);
// console.log(photoPosts.editPhotoPost('14', 123));



// console.log("_________Filter and sort photoPosts:");

// console.log('without skip, 10 posts, sort by date - new first');
// console.log('photoPosts.getPhotoPosts(0, 10)');
// console.log(photoPosts.getPhotoPosts(0, 10));

// console.log('sort by date - old first');
// console.log('photoPosts.getPhotoPosts(0, 10, {sort_mode: "old"})');
// console.log(photoPosts.getPhotoPosts(0, 10, {sort_mode: "old"}));

// console.log('sort by author - in alphabetical order');
// console.log('photoPosts.getPhotoPosts(0, 10, {sort_mode: "AZ"})');
// console.log(photoPosts.getPhotoPosts(0, 10, {sort_mode: "AZ"}));

// console.log('sort by author - NOT in alphabetical order');
// console.log('photoPosts.getPhotoPosts(0, 10, {sort_mode: "ZA"})');
// console.log(photoPosts.getPhotoPosts(0, 10, {sort_mode: "ZA"}));

// console.log('sort by hashTag and new first');
// console.log('photoPosts.getPhotoPosts(0, 10, {hashTags: "winter"})');
// console.log(photoPosts.getPhotoPosts(0, 10, {hashTags: ['winter']}));

// console.log('skip 2, get 10 posts, sort by hashTag and in alphabetical order');
// console.log("photoPosts.getPhotoPosts(2, 10, {sort_mode: 'AZ', hashTags: ['winter']})");
// console.log(photoPosts.getPhotoPosts(2, 10, {sort_mode: "AZ", hashTags: ['winter']}));

// console.log('sort by hashTag and author');
// console.log("photoPosts.getPhotoPosts(0, 10, {author: 'Dmitry Shamov', sort_mode: 'AZ', hashTags: ['winter']})");
// console.log(photoPosts.getPhotoPosts(0, 10, {author: 'Dmitry Shamov', sort_mode: 'AZ', hashTags: ['winter']}));

// console.log('sort by 2 hashTags');
// console.log("photoPosts.getPhotoPosts(0, 10, {hashTags: ['winter','japan']})");
// console.log(photoPosts.getPhotoPosts(0, 10, {hashTags: ['winter','japan']}));

// console.log('invalid hashTags');
// console.log("photoPosts.getPhotoPosts(0, 99, {hashTags: 123})");
// console.log(photoPosts.getPhotoPosts(0, 99, {hashTags: 123}));

// console.log("there is't such hashTag");
// console.log("photoPosts.getPhotoPosts(0, 99, {hashTags: 'asdasdsad'})");
// console.log(photoPosts.getPhotoPosts(0, 99, {hashTags: "asdasdsad"}));

// console.log("_________New tests after fixing:");

// console.log("_________editPhotoPost:");

// console.log('Fixed error');
// console.log('1', { description: 'a', photoLink: 2 });
// console.log(photoPosts.editPhotoPost('1', { description: 'a', photoLink: 2 }));

// console.log('Ignore protected id, author and date');
// console.log('1', { id: '13', author: 'asd asd', createdAt: new Date(), description: 'asd', photoLink: 'asd' });
// console.log(photoPosts.editPhotoPost('1', { id: '13', author: 'asd asd', createdAt: new Date(), description: 'asd', photoLink: 'asd' }));

// console.log("_________validatePhotoPost:");

// let empty_id = {
//   id: '',
//   description: 'Lorem ipsum uis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'Dmitry Shamov',
//   photoLink: 'images/1.jpg',
//   hashTags: ['japan','summer'],
//   likes: []
// };
// console.log('empty_id');
// console.log(empty_id); 
// console.log(photoPosts.validatePhotoPost(empty_id));

// let empty_photoLink = {
//   id: '42',
//   description: 'Lorem ipsum uis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'asd ads',
//   photoLink: '',
//   hashTags: ['japan','summer'],
//   likes: []
// };
// console.log('empty_photoLink');
// console.log(empty_photoLink); 
// console.log(photoPosts.validatePhotoPost(empty_photoLink));

// let empty_author = {
//   id: '42',
//   description: 'Lorem ipsum uis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: '',
//   photoLink: 'images/1.jpg',
//   hashTags: ['japan','summer'],
//   likes: []
// };
// console.log('empty_author');
// console.log(empty_author); 
// console.log(photoPosts.validatePhotoPost(empty_author));

// let empty_description = {
//   id: '42',
//   description: '',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'asd ads',
//   photoLink: 'images/1.jpg',
//   hashTags: ['japan','summer'],
//   likes: []
// };
// console.log('empty_description');
// console.log(empty_description); 
// console.log(photoPosts.validatePhotoPost(empty_description));

// let empty_hashTag = {
//   id: '42',
//   description: 'Lorem ipsum uis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'asd ads',
//   photoLink: 'images/1.jpg',
//   hashTags: ['', 'asd'],
//   likes: []
// };
// console.log('empty_hashTag');
// console.log(empty_hashTag); 
// console.log(photoPosts.validatePhotoPost(empty_hashTag));

// let empty_like = {
//   id: '42',
//   description: 'Lorem ipsum uis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: new Date('2018-10-23T23:00:00'),
//   author: 'asd ads',
//   photoLink: 'images/1.jpg',
//   hashTags: [],
//   likes: ['', 'asd']
// };
// console.log('empty_like');
// console.log(empty_like); 
// console.log(photoPosts.validatePhotoPost(empty_like));

// let wrong_date = {
//   id: '42',
//   description: 'Lorem ipsum uis consectetur ab earum impedit, tenetur officiis.',
//   createdAt: {},
//   author: 'asd ads',
//   photoLink: 'images/1.jpg',
//   hashTags: [],
//   likes: []
// };
// console.log('wrong_date');
// console.log(wrong_date); 
// console.log(photoPosts.validatePhotoPost(wrong_date));

return {
  "removePhotoPost": removePhotoPost,
  "getPhotoPost": getPhotoPost,
  "validatePhotoPost": validatePhotoPost,
  "addPhotoPost": addPhotoPost,
  "editPhotoPost": editPhotoPost,
  "getPhotoPosts": getPhotoPosts,
  "likeThePost": likeThePost
};

}());