var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Schema = mongoose.Schema;

var getBookItemState = function () {
	//megnézi a rents-eket, és ha épp valakinél van a könyv, akkor
	//kölcsönzöttet ad vissza, ha nincs, akkor szabadot, ha pedig 
	//már vissza kellett volna hozni, akkor lejárt
	
	var lastRent = null;
	this.rents.forEach(function (rent) {
		if (lastRent == null) {
			lastRent = rent;
			return;
		}
		
		if (lastRent.start < rent.start) {
			lastRent = rent;
		}
	});
	
	//ha nem volt kölcsönözve sosem, akkor szabad
	if (lastRent == null) {
		return "SZABAD";
	}
	
	//ha az utolsó kölcsönzés visszahozott, akkor a könyv szabadnak számít
	//egyébként pedig vegyük a kölcsönzés állapotát (kölcsönzött vagy lejárt)
	return lastRent.status == "VISSZAHOZOTT" ? "SZABAD" : lastRent.status;
};

var BookItemSchema = new Schema({
	barcode: { type: Number },
	book: { type: Schema.ObjectId, ref: 'Book' },
	rents: [{ type: Schema.ObjectId, ref: 'Rent' }],
	condition: { 
		type: String, 
		enum: ['JÓ', 'ERŐSEN HASZNÁLT', 'LESELEJTEZETT']
	},
	state: { type: String, get: getBookItemState }
});

BookItemSchema.plugin(deepPopulate);

BookItemSchema.statics = {
	
	// betölti a megadott id-jű könyvpéldányt a könyvvel együtt
	load: function (id, cb) {
		this.findOne({ _id: id })
			.populate('book')
			.populate('rents')
			.deepPopulate('rents.user')
			.exec(cb);
	},
	
	loadByBarcode: function (barcode, cb) {
		this.findOne({ barcode: barcode })
			.populate('rents')
			.exec(cb);
	}
	
};

mongoose.model('BookItem', BookItemSchema);