var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 1 })); // чтоб начал грузить index.html
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));




app.listen(process.env.PORT || 3000, function(){
	console.log('Server is listening on port', process.env.PORT || 3000 );
});
