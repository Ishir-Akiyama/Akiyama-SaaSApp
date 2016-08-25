var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AutoIncrement = require('mongoose-sequence');
// client schema 
var ClientSchema = new Schema({
    ClientId: Number,
    name: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: Number,
    country: String,
    createdOn: { type: Date, default: Date.now },
    isActive: Boolean,
});

module.exports = mongoose.model('clients', ClientSchema);
ClientSchema.plugin(AutoIncrement, { inc_field: 'ClientId' });



