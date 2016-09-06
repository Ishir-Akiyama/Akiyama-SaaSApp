
var mongoose = require('mongoose');
//create new client


var sch_obj = new mongoose.Schema({
    name: { type: String, default: "" },
    filename: { type: String, default: "" },
    size: { type: String, default: 0 },
    type: { type: String, default: "" },
    byte: { type: String, contentType: String, default: "" },
    user: { type: String, default: "" },
    uploadedOn: { type: Date, default: Date.now },
    status: { type: Number, default: -1 },
});

var clientId = "";



//Get all images by clientid
exports.allImagesByClientId = function (request, response) {
    //module.exports = mongoose.model('Images_' + request.clientId);
    var Image = mongoose.model('Images_' + request.clientId);
    Image.find({}, function (err, Image) {
        if (err) response.send(err);
        // return the users
        response.json(Image);
    });

};









