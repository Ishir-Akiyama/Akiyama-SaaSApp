var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AutoIncrement = require('mongoose-sequence');
// client schema 
var ClientSchema = new Schema({
    ClientId: Number,
    //name: String,
    name: String,
    address1: { type: String, required: true },
    address2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
    country: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    isActive: Boolean,
});

module.exports = mongoose.model('clients', ClientSchema);
ClientSchema.plugin(AutoIncrement, { inc_field: 'ClientId' });



