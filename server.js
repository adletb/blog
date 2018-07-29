var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');


var uploade = multer({dest: 'public/images/content'});
mongoose.connect("mongodb://127.0.0.1:27017/projectdb");
var Blog = require('./server/models/Blog.js');

var app = express();
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 1 })); // чтоб начал грузить index.html
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));


app.get('/api/blog', function(req, res, next){
	Blog.find().exec(function(err, blogs){
		if(err) return res.status(400).send({msg: "Error"});
		res.status(200).send(blogs);
	})
});



app.listen(process.env.PORT || 3000, function(){
	console.log('Server is listening on port', process.env.PORT || 3000 );
});
