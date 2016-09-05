var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// image schema 
var ImageSchema = new Schema({
    name: String,
    filename: String,
    size: Number,
    type: String,
    byte: { type: String, contentType: String },
    clientId:Number,
    client: String,
    user: String,
    uploadedOn: { type: Date, default: Date.now },
    status: Number
});



module.exports = mongoose.model('images', ImageSchema);

