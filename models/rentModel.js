var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var getRentState = function () {
	//megállapítja a kölcsönzésről, 
	//hogy még aktuális-e, visszahozott, esetleg lejárt
	
	var now = new Date();
	if (this.returnDate == null) {
		if (this.end > now) {
			return "KÖLCSÖNZÖTT";
		} else {
			return "LEJÁRT";
		}
	} else {
		return "VISSZAHOZOTT";
	}
};

var RentSchema = new Schema({
	start: { type: Date, default: Date.now },
	end: { type: Date, default: (new Date((new Date()).setMonth((new Date()).getMonth() + 1))) },
	returnDate: { type: Date },
	status: { type: String, get: getRentState },
	bookItem: { type: Schema.ObjectId, ref: 'BookItem' },
	user: { type: Schema.ObjectId, ref: 'User' }
});

RentSchema.methods = {
	rentBook: function (bookNumber, userNumber, cb) {
		// létrehozza a kölcsönzést
		
		this.save(cb);
	},
	returnBook: function (bookNumber, cb) {
		// visszahozottnak nyilvánítja a kölcsönzést
		
		this.save(cb);
	}
}

mongoose.model('Rent', RentSchema);