var Image = require('../models/image.server.model');


//create new client
exports.create = function (request, response) {
    debugger;
    var entry = new Image({
        
        name: request.body.name,
        filename: request.body.filename,

        size: request.body.size,
        type: request.body.type,
        byte: request.body.file,

        client: request.body.client,
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




