var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// client schema 
var ImagesSchema = new Images({
    name: String,
    size: Number,
    type: String,
    byte: Binary,
    client: String,
    user: String,
    uploadedOn: { type: Date, default: Date.now },
    isActive: Boolean,
});



module.exports = mongoose.model('images', ImagesSchema);

