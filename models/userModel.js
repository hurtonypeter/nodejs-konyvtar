var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	cardNumber: { type: Number },
	name: { type: String },
	birthDate: { type: Date },
	birthPlace: { type: String },
	address: { type: String },
	mothersName: { type: String },
	rents: [{ type: Schema.ObjectId, ref: 'Rent' }]
});

UserSchema.plugin(deepPopulate);

UserSchema.statics = {
	
	// betölti a megadott id-jű usereket a kölcsönzéseikkel együtt
	load: function (id, cb) {
		this.findOne({ _id: id })
			.deepPopulate('rents.bookItem.book')
			.exec(cb);
	},
	
	loadByBarcode: function (barcode, cb) {
		this.findOne({ cardNumber: barcode })
			.exec(cb);
	}
	
};

mongoose.model('User', UserSchema);