var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema({
	author: { type: String, default: '' },
	title: { type: String, default: '' },
	isbn: { type: String, default: '' },
	items: [{ type: Schema.ObjectId, ref: 'BookItem' }]
});

BookSchema.statics = {
	
	// betölti a megadott id-jű könyvet a könyvpéldányokkal együtt
	load: function (id, cb) {
		this.findOne({ _id: id })
			.populate('items')
			.exec(cb);
	},
	
	// megkapja a szűréshez a paramétereket és betölti a könyvek listáját
	list: function (cb) {
		this.find()
			.exec(cb);
	}
		
};

mongoose.model('Book', BookSchema);