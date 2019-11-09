const mongoose = require('mongoose'),
      schema = mongoose.Schema

const service_schema = new Schema({
	name: {
		type: String,
		required: true
	},
	addresses: [{
		line_1: {
			type: String,
			required: true
		},
		line_2: String,
		city: {
			type: String,
			required: true
		},
		state: {
			type: String,
			required: true
		},
		zip: {
			type: String,
			required: true
		}
	}],
	phone_numbers: [{
		contact: {
			type: String,
			required: false
		},
		number: {
			type: String,
			required: true
		}
	}],
	services_freeform: {
		type: String,
		required: false
	},
	eligibility_criteria: {
		type: String,
		required: false
	},
	emails: [String],
	bus_routes: [String],
	website: [String],
	walk_ins: String,
	hours: [{
		start: Date,
		end: Date,
		note: String
	}],
	appointment: {
		is_required: Boolean,
		phone: String,
		website: String,
		email: String,
		other_info: String
	},
	service_area: String,
	application: {
		is_required: Boolean,
		apply_online: Boolean,
		apply_in_person: Boolean,
		phone: String,
		website: String.
		email: String,
		other_info: String
	},
	cost_info: String,
	translation_available: Boolean,
	united_way_approval: Boolean,
	additional_information: String,
	categories: [ObjectId]
})

const Service = mongoose.model('Service', service_schema)
module.exports = Service
