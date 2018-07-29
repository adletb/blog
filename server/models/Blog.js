var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
	title: String,
	description: String,
	date: {type: Date, default: Date.now },
    img: String
});

module.exports = mongoose.model("Blog", blogSchema);
