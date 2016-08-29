var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// image schema 
var ImageSchema = new Schema({
    name: String,
    size: Number,
    type: String,
    byte: { type: String, contentType: String },
    client: String,
    user: String,
    uploadedOn: { type: Date, default: Date.now },
});



module.exports = mongoose.model('images', ImageSchema);

