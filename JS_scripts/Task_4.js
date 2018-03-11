let photoPosts = (function () {

let photoPosts = [

  {

    id: '8',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-12-26T23:00:00'),

    author: 'Dmitry Shamov',

    photoLink: 'images/1.jpg',

    hashTags: ['japan','summer'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '19',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-08-13T23:00:00'),

    author: 'Dmitry Shamov',

    photoLink: 'images/2.jpg',

    hashTags: ['japan','spring'],

    likes: []

  },

  {

    id: '1',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-10-16T23:00:00'),

    author: 'Dmitry Shamov',

    photoLink: 'images/3.jpg',

    hashTags: ['japan','winter'],

    likes: []

  },

  {

    id: '9',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-10-24T23:00:00'),

    author: 'Dmitry Shamov',

    photoLink: 'images/4.jpg',

    hashTags: ['japan','autumn'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '12',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-01-22T23:00:00'),

    author: 'Alexander Martinchik',

    photoLink: 'images/5.jpg',

    hashTags: ['poland','summer'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '7',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-08-15T23:00:00'),

    author: 'Alexander Martinchik',

    photoLink: 'images/6.jpg',

    hashTags: ['poland','spring'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '23',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-05-16T23:00:00'),

    author: 'Alexander Martinchik',

    photoLink: 'images/7.jpg',

    hashTags: ['poland','winter'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '25',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-10-10T23:00:00'),

    author: 'Alexander Martinchik',

    photoLink: 'images/8.jpg',

    hashTags: ['poland','autumn'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '4',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-02-20T23:00:00'),

    author: 'Dirk Dallas',

    photoLink: 'images/9.jpg',

    hashTags: ['dubai','summer'],

    likes: []

  },

  {

    id: '14',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-02-03T23:00:00'),

    author: 'Dirk Dallas',

    photoLink: 'images/10.jpg',

    hashTags: ['dubai','spring'],

    likes: []

  },

  {

    id: '17',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-07-28T23:00:00'),

    author: 'Dirk Dallas',

    photoLink: 'images/11.jpg',

    hashTags: ['dubai','winter'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '5',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-10-21T23:00:00'),

    author: 'Dirk Dallas',

    photoLink: 'images/12.jpg',

    hashTags: ['dubai','autumn'],

    likes: []

  },

  {

    id: '11',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-02-27T23:00:00'),

    author: 'Jannik Obenhoff',

    photoLink: 'images/13.jpg',

    hashTags: ['germany','autumn'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '6',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-03-18T23:00:00'),

    author: 'Jannik Obenhoff',

    photoLink: 'images/14.jpg',

    hashTags: ['germany','spring'],

    likes: []

  },

  {

    id: '2',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-02-02T23:00:00'),

    author: 'Jannik Obenhoff',

    photoLink: 'images/15.jpg',

    hashTags: ['germany','summer'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '18',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-12-06T23:00:00'),

    author: 'Jannik Obenhoff',

    photoLink: 'images/16.jpg',

    hashTags: ['germany','winter'],

    likes: []

  },

  {

    id: '27',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-01-11T23:00:00'),

    author: 'Eric Kimberlin',

    photoLink: 'images/17.jpg',

    hashTags: ['seattle','winter'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '21',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-01-05T23:00:00'),

    author: 'Eric Kimberlin',

    photoLink: 'images/18.jpg',

    hashTags: ['seattle','summer'],

    likes: []

  },

  {

    id: '28',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-12-17T23:00:00'),

    author: 'Eric Kimberlin',

    photoLink: 'images/19.jpg',

    hashTags: ['seattle','autumn'],

    likes: []

  },

  {

    id: '3',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-06-14T23:00:00'),

    author: 'Eric Kimberlin',

    photoLink: 'images/20.jpg',

    hashTags: ['seattle','spring'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '20',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-09-04T23:00:00'),

    author: 'Ryan Millier',

    photoLink: 'images/21.jpg',

    hashTags: ['new_york','spring'],

    likes: ["Maksim Talstykh"]

  },

  {

  id: '10',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-05-25T23:00:00'),

    author: 'Ryan Millier',

    photoLink: 'images/22.jpg',

    hashTags: ['new_york','winter'],

    likes: []

  },

  {

    id: '15',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-07-23T23:00:00'),

    author: 'Ryan Millier',

    photoLink: 'images/23.jpg',

    hashTags: ['new_york','summer'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '22',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-02-07T23:00:00'),

    author: 'Ryan Millier',

    photoLink: 'images/24.jpg',

    hashTags: ['new_york','autumn'],

    likes: []

  },

  {

    id: '24',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-04-12T23:00:00'),

    author: 'Emilie Ristevski',

    photoLink: 'images/25.jpg',

    hashTags: ['australia','autumn'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '16',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-09-09T23:00:00'),

    author: 'Emilie Ristevski',

    photoLink: 'images/26.jpg',

    hashTags: ['australia','winter'],

    likes: ["Maksim Talstykh"]

  },

  {

    id: '13',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-08-09T23:00:00'),

    author: 'Emilie Ristevski',

    photoLink: 'images/27.jpg',

    hashTags: ['australia','spring'],

    likes: []

  },

  {

    id: '26',

    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nobis, quidem fuga distinctio. Quis consectetur ab earum impedit, tenetur officiis.',

    createdAt: new Date('2018-08-01T23:00:00'),

    author: 'Emilie Ristevski',

    photoLink: 'images/28.jpg',

    hashTags: ['australia','summer'],

    likes: ["Maksim Talstykh"]

  }

];

photoPosts.removePhotoPost = function(selectedId){

  for (let i = 0; i < this.length; i++){
    if (this[i].id === selectedId){
      this.splice(i, 1);
      return true;
    }
  }
  return false;

};

photoPosts.getPhotoPost = function(selectedId){

  for (let i = 0; i < this.length; i++){
    if (this[i].id === selectedId){
      return this[i];
    }
  }
  return false;

};

photoPosts.validatePhotoPost = function(photoPost){

  if (photoPost === undefined || typeof (photoPost.id) !== "string" || isStringEmpty(photoPost.id)){
    return false;
  }
  if (typeof (photoPost.description) !== "string" || photoPost.description.length >200 || isStringEmpty(photoPost.description)){
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

};

photoPosts.addPhotoPost = function(photoPost){
  
  if (!photoPost || typeof photoPost !== "object") return false;
  if (photoPost instanceof Array){
    return false;
  }
  if (!photoPost.hashTags){
    return false;
  }
  for (let i = 0; i < this.length; i++){
    if (this[i].id === photoPost.id){
      return false;
    }
  }

  photoPost = hashTagsToLowerCase(photoPost);

  if (!this.validatePhotoPost(photoPost)){
    return false;
  }
  this.push(photoPost);
  return true;
  
};

photoPosts.editPhotoPost = function(selectedId, photoPost){

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

  let selectedPost = this.getPhotoPost(selectedId);
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

  return true;

};

photoPosts.getPhotoPosts = function(skip, top, filterConfig){

  if (typeof(skip) !== "number" || typeof(top) !== "number"){
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

  for (let i = 0; i < this.length; i++) {
    filterFlag = true;
    for (let key in filterConfig) {
      if (!this[i][key] || key==='hashTags') continue;
      if (filterConfig[key] != this[i][key]){
        filterFlag = false;
      }
      break;
    }

    if (filterFlag && isBContainsA(filterConfig.hashTags,this[i].hashTags)){
      filteredPosts.push(this[i]);
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

};

sortByAuthor = function(sort_mode, object){

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

};

sortByDate = function(sort_mode, object){

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

};

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

return photoPosts;

}());