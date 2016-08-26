var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// client schema 
var ImagesSchema = new Schema({
    name: String,
    size: Number,
    type: String,
    byte: String,
    client: String,
    user: String,
    uploadedOn: { type: Date, default: Date.now },
    isActive: Boolean,
});



module.exports = mongoose.model('images', ImagesSchema);

