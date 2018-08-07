var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
var coockieParser = require("cookie-parser");
var validator = require("validator");
var passport = require("passport"); // авторизация
// авторизация использую сессию и куки
var LocalStrategy = require("passport-local").Strategy;
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var uploade = multer({dest: 'public/images/content'});
var uploade = multer({dest: 'public/images/content'});


mongoose.connect("mongodb://127.0.0.1:27017/projectdb");

var Blog = require('./server/models/Blog.js');
var User = require('./server/models/User.js')

var app = express();
app.use(logger('dev'));
app.use(coockieParser());

app.use(session({
  secret: 'secretasd',
  rasave: true,
  saveUninitialized: true,
  key: 'jsessionid',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(express.static(path.join(__dirname, 'public'), {maxAge: 1 })); // чтоб начал грузить index.html
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({usernameField: 'email'},
    function(email, password, done){
        User.findOne({email: email}).exec(function(err, user){

            if(err){
                return done(err);
            }

            if(!user) {
                return done(null, false);
              }

            user.comparePassword(password, function(err, isMatch){
                if(err){
                    return done(err);
                }
                if(isMatch) {
                    return done(null, user);
                }

                return done(null, false);
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    console.log("Right now");
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.post('/api/user/signup', function(req, res, next){
  var errors = {};

      if(isEmpty(req.body.email)){
        errors.email = "Поле email обязательно";
      } else if (!validator.isEmail(req.body.email)){
        errors.email = "Неправильно введенный email";
      }
      if(isEmpty(req.body.last_name)){
        errors.last_name = "Поле фамилия обязательно";
      }
      if(isEmpty(req.body.password)){
    		errors.password = "Поле пароль обязательно";
    	} else if(!validator.isLength(req.body.password, {min: 6, max: 30})){
    		errors.password = "Длина пароля должна быть от 6 до 30 символов";
    	}

    	if(isEmpty(req.body.password2)){
    		errors.password2 = "Поле пароль обязательно";
    	} else if(req.body.password!==req.body.password2) {
    	    errors.password2 = "Пароли не совподают";
    	}

    	if(isEmpty(errors)){

    		 new User(req.body).save(function(err, user){
    		 	if(err) {
    		 		console.log(err);
    		 		return res.status(400).send({msg: "Произошла ошибка при сохранении"});

    		 	}res.status(200).send(user);
    		 })
    	} else {
    		console.log(errors, "here")
    		res.status(400).send(errors);
    	}
});

app.post('/api/user/login', function(req, res, next){
    var  errors = {};

	if(isEmpty(req.body.email)) {
    	errors.email = "Поле email обязательно";
    } else if (!validator.isEmail(req.body.email)){
		errors.email = "Неправильно введенный email";
	}

	if(isEmpty(req.body.password)){
		errors.password = "Поле пароль обязательно";
	}

    if(!isEmpty(errors))
    	res.status(400).send(errors);
    else next();
}, passport.authenticate('local'), function(req, res, next){
	res.status(200).send({
		email: req.user.email,
		first_name: req.user.first_name,
		last_name: req.user.last_name,
		ava: req.user.ava,
		_id: req.user._id
	});
});

app.post('/api/user/logout', function(req, res, next){
	req.logout();
	res.send(200).end();
})


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

app.get('*', function(req, res, next){
	res.redirect('/#' + req.originalUrl);
});

app.listen(process.env.PORT || 3000, function(){
	console.log('Server is listening on port', process.env.PORT || 3000 );
});

function isAuthenticated(req, res, next){
	 if(req.user) {
		  next();
	 } else {
		   res.status(402).send({msg: "User not Authenticated" })
	 }
}


function isEmpty(data){
	console.log(data)
	if (data===""
          ||JSON.stringify(data)===JSON.stringify({})
          ||data===undefined||data===null) {
		console.log("tut1");
		return true;
	}
	return false;
}
