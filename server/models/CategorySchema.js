const mongoose = require('mongoose'),
      schema = mongoose.Schema

const category_schema = new Schema({
	name: {
		type: String,
		required: true
	},
	subcategory_of: ObjectId
})

const Category = mongoose.model('Category', category_schema)
module.exports = Category
