//var Image = require('../models/image.server.model');



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
exports.create = function (request, response) {
    clientId = request.body.client;
    module.exports = mongoose.model('Images_' + request.body.client, sch_obj);
    var Image = mongoose.model('Images_' + request.body.client);
    
    var entry = new Image({

        name: request.body.name,
        filename: request.body.filename,

        size: request.body.size,
        type: request.body.type,
        byte: request.body.file,

        //  client: request.body.client,
        user: request.body.user,
        uploadedOn: request.body.uploadedOn,
        status: '-1'
    });
    entry.save(function (err) {
        debugger;
        if (err) {
            // duplicate entry
            //if (err.code == 11000) 
            //    return res.json({ success: false, message: 'A user with that username already exists. '});
            //else 
            console.log("test2");
            return response.send(err);
        }
        // return a message
        response.json({ message: 'Image created!' });
    });
    console.log(response);
};



//Get all clients
exports.all = function (request, response) {
    module.exports = mongoose.model('Images_' + clientId, sch_obj);
    var Image = mongoose.model('Images_' + clientId);
    Image.find({}, function (err, Image) {
        if (err) response.send(err);
        // return the users
        response.json(Image);
    });
};

//Get all active clients
exports.allActive = function (request, response) {
    Image.find({ isActive: true }, function (err, Image) {
        if (err) response.send(err);
        // return the users
        response.json(Image);
    });
};


//Get by Image name
exports.findByName = function (request, response) {
    Image.findById(request.params.client_id, function (err, Image) {
        if (err) response.send(err);
        // return that Image
        response.json(Image);
    });
}




