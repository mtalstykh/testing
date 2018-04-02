const express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");
const task8 = require('./task8.js');

const app = express();

app.use((req, res, next) => {

	if (req.method !== 'POST' && req.method !== 'GET'){
		res.status(403).end();
	}
	else{
		next();
	}
	
});

app.use(bodyParser.json());

app.post('/delete', (req, res) => {
	
	console.log("Before " + task8.readPhotoPosts().length);

	if (!req.body.id){
		res.status(400).end();
		return;
	}

	let responseStatus = task8.removePhotoPost(req.body.id);	
	res.setHeader('Content-Type', 'application/json');
	let body = JSON.stringify({ status: responseStatus});

	console.log("After " + task8.readPhotoPosts().length);

	res.end(body);
	
});

app.post('/add', (req, res) => {

	if (Object.keys(req.body).length === 0){
		res.status(400).end();
		return;
	}

	console.log("Before " + task8.readPhotoPosts().length);

	let responseStatus = task8.addPhotoPost(req.body);
	res.setHeader('Content-Type', 'application/json');
	let body = JSON.stringify({ status: responseStatus});	

	console.log("After " + task8.readPhotoPosts().length);

	res.end(body);

});

app.post('/edit', (req, res) => {

	if (Object.keys(req.body).length === 0 || 'id' in req.body === false || 'photoPost' in req.body === false){
		res.status(400).end();
		return;
	}

	let responseStatus = task8.editPhotoPost(req.body.id, req.body.photoPost);
	res.setHeader('Content-Type', 'application/json');
	let body = JSON.stringify({ status: responseStatus});

	res.end(body);

});

app.post('/get-posts', (req, res) => {

	if (Object.keys(req.body).length === 0 || 'skip' in req.body === false || 'top' in req.body === false || "filterConfig"in req.body === false){
		res.status(400).end();
		return;
	}

	// console.log(req.body.skip);
	// console.log(req.body.top);
	// console.log(req.body.filterConfig);
	let responseStatus = task8.getPhotoPosts(req.body.skip, req.body.top, req.body.filterConfig);
	res.setHeader('Content-Type', 'application/json');
	let body = JSON.stringify({ status: responseStatus});

	res.end(body);

});

app.post('/get-post', (req, res) => {

	if (!req.body.id){
		res.status(400).end();
		return;
	}
	let responseStatus = task8.getPhotoPost(req.body.id);
	res.setHeader('Content-Type', 'application/json');
	let body = JSON.stringify({ status: responseStatus});

	res.end(body);

});



app.use(express.static('./public'));

app.use((req, res) => {

	res.status(404).sendFile('error.html', {root: './public' });
	
});

app.listen(80, () => {

	console.log('Server is running');

});