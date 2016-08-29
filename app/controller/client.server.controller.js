var Client = require('../models/client.server.model');

//create new client
exports.create = function (request, response) {
    var entry = new Client({
        name: request.body.name,
        address1: request.body.address1,
        address2: request.body.address2,
        city: request.body.city,
        state: request.body.state,
        zip: request.body.zip,
        country: request.body.country,
        isActive: request.body.isActive
    });
    entry.save(function (err) {
        if (err) {
            // duplicate entry
            //if (err.code == 11000) 
            //    return res.json({ success: false, message: 'A user with that username already exists. '});
            //else 
            console.log("test2");
            return response.send(err);
        }
        // return a message
        response.json({ message: 'Client created!' });
    });
    console.log(response);
};

//Get all clients
exports.all = function (request, response) {
    Client.find({}, function (err, Client) {
        if (err) response.send(err);
        // return the users
        response.json(Client);
    });
};

//Get all active clients
exports.allActive = function (request, response) {
    Client.find({ isActive: true }, function (err, Client) {
        if (err) response.send(err);
        // return the users
        response.json(Client);
    });
};


//Get by client id
exports.findById = function (request, response) {
    Client.findById(request.params.client_id, function (err, Client) {
        if (err) response.send(err);
        // return that client
        response.json(Client);
    });
}

// Edit Client
exports.update = function (request, response) {
    Client.findById(request.params.client_id, function (err, Client) {
        if (err) response.send(err);
        // set the new client information if it exists in the request
        if (request.body.name) Client.name = request.body.name;
        if (request.body.address1) Client.address1 = request.body.address1;
        if (request.body.address2) Client.address2 = request.body.address2;
        if (request.body.city) Client.city = request.body.city;
        if (request.body.state) Client.state = request.body.state;
        if (request.body.zip) Client.zip = request.body.zip;
        if (request.body.country) Client.country = request.body.country;
        if (request.body.isActive) Client.isActive = request.body.isActive;
        // save the client
        Client.save(function (err) {
            if (err) response.send(err);
            // return a message
            response.json({ message: 'Client updated!' });
        });
    });
}

//function getNextSequence(name) {
//    var ret = db.counters.findAndModify(
//           {
//               query: { _id: name },
//               update: { $inc: { seq: 1 } },
//               new: true
//           }
//    );
//    return ret.seq;
//}


