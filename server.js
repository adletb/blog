var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');


var uploade = multer({dest: 'public/images/content'});
mongoose.connect("mongodb://127.0.0.1:27017/projectdb");
var Blog = require('./server/models/Blog.js');

var app = express();
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 1 })); // чтоб начал грузить index.html
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

new Blog({
	title: "For remove",
	description: "remove"
}).save(function(err, blog){
	// console.log(blog);
});

app.get('/api/blog', function(req, res, next){
	Blog.find().exec(function(err, blogs){
		if(err) return res.status(400).send({msg: "Error"});
		res.status(200).send(blogs);
	})
});

app.delete('/api/blog/:id', function(req, res, next){
	// console.log(req.params.id);
	Blog.remove({_id: req.params.id}).exec(function(err){
		if(err) return res.status(400).send({msg: "Not deleted"})
		res.status(200).end();
	})

});

app.post('/api/blog', uploade.single("img"), function(req, res, next){
	new Blog({
		title: req.body.title,
		description: req.body.description
	}).save(function(err, blog){

			var tempPath = req.file.path;

			var targetPath = path.resolve('public/images/content/'+blog._id+'.'+req.file.originalname.split('.').slice(-1).pop());

			fs.rename(tempPath, targetPath, function(err) {
				if (err) return next(err);

				blog.img = "images/content/"+blog.
				_id+'.'+req.file.originalname.split('.').slice(-1).pop();
				blog.save(function(err, blogsaved){
					if(err) return res.status(400).send({msg:"error"});
					res.status(200).send(blogsaved);
				});
			});

	});
});



app.listen(process.env.PORT || 3000, function(){
	console.log('Server is listening on port', process.env.PORT || 3000 );
});
