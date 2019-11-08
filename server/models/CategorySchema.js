var mongoose = require('mongoose'),
    schema = mongoose.Schema

var category_schema = new Schema({
	name: {
		type: String,
		required: true
	}
})

var Category = mongoose.model('Category', category_schema)
module.exports = Category
