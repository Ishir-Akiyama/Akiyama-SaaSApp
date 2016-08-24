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
    entry.save();
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
        if (err) res.send(err);
        // set the new client information if it exists in the request
        if (req.body.name) client.name = req.body.name;
        if (req.body.address1) client.address1 = req.body.address1;
        if (req.body.address2) client.address2 = req.body.address2;
        if (req.body.city) client.city = req.body.city;
        if (req.body.state) client.state = req.body.state;
        if (req.body.zip) client.zip = req.body.zip;
        if (req.body.country) client.country = req.body.country;

        // save the client
        client.save(function (err) {
            if (err) res.send(err);

            // return a message
            res.json({ message: 'Client updated!' });
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


