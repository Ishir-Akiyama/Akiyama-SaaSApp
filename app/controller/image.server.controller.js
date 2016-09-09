//var Image = require('../models/image.server.model');


var mongoose = require('mongoose');
//create new client
var dateFormat = require('dateformat');
var now = new Date();

var sch_obj = new mongoose.Schema({
    name: { type: String, default: "" },
    filename: { type: String, default: "" },
    type: { type: String, default: "" },
    byte: { type: String, contentType: String, default: "" },
    user: { type: String, default: "" },
    uploadedOn: { type: String, default: dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT") },
    status: { type: Number, default: -1 },
});

var clientId;
exports.create = function (request, response) {
    console.log(request);
    clientId = request.body.clientId;
    module.exports = mongoose.model('Images_' + request.body.clientId, sch_obj);
    var Image = mongoose.model('Images_' + request.body.clientId);

    if (request.body.type.indexOf("application/vnd") > -1) {

        var bitmap = new Buffer(request.body.file.replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""), 'base64');
        // write buffer to file
        var fileAddress = "Uploads/" + request.body.filename;
        var fs = require('fs');
        fs.writeFileSync(fileAddress, bitmap);

        xlsxj = require("xlsx-to-json");
        xlsxj({
            input: fileAddress,
            output: fileAddress + ".json"
        }, function (err, result) {
            if (err) {

                console.error(err);
                throw ex;
            } else {

                var content;
                // First I want to read the file
                fs.readFile(fileAddress + '.json', function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    content = data;

                    var imagesInExcel = JSON.parse(content);
                    console.log(imagesInExcel);

                    for (var i = 0; i < imagesInExcel.length; i++) {
                        var getType = imagesInExcel[i].Image.toString().substr(5, 20);
                        getType = getType.substr(0, getType.indexOf(";"));
                        var entry = new Image({
                            name: imagesInExcel[i].name,
                            filename: request.body.filename,
                            type: getType,
                            byte: imagesInExcel[i].Image,
                            user: request.body.user,
                            status: '-1'
                        });
                        entry.save(function (err) {
                            if (err) { }
                            // return a message

                        });
                    }
                    response.json({ message: 'Excel imported!' });
                });


            }
        });
    }
    else {
        var entry = new Image({
            name: request.body.name,
            filename: request.body.filename,
            type: request.body.type,
            byte: request.body.file,
            user: request.body.user,
            status: '-1'
        });
        entry.save(function (err) {

            if (err) {
              
                return response.send(err);
            }
            // return a message
            response.json({ message: 'Image created!' });
        });
    }
    //console.log(response);
};


//Get all clients
exports.all = function (request, response) {
    var temp = request.body.clientId;
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
exports.findByClient = function (request, response) {

    var temp = request.params.client_id;
    module.exports = mongoose.model('Images_' + temp, sch_obj);
    var Image = mongoose.model('Images_' + temp);
    Image.find({}, function (err, Image) {
        if (err) response.send(err);
        // return the users
        response.json(Image);
    });
}


exports.dashboardPieChartByClientId = function (req, res) {
    //var clientId = req.params.clientId;
    module.exports = mongoose.model('images_12', sch_obj);
    var Image = mongoose.model('images_12');
    Image.aggregate([{ "$group": { _id: "$status", count: { $sum: 1 } } }], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });

}


exports.scoreImageSchduler = function (req, res) {

    var cron = require('node-schedule');
    /* This runs at the 30th mintue of every hour. */
    cron.scheduleJob('1 * * * * *', function () {

        var temp = req.params.client_id;
        module.exports = mongoose.model('Images_' + temp, sch_obj);
        var Image = mongoose.model('Images_' + temp);
        Image.find({}, function (err, Image) {
            if (err) response.send(err);

            for (var i = 0; i < Image.length; i++) {
                var newImage = Image[i];
                newImage.status = Math.floor(Math.random() * 5) + 1;

                newImage.save(function (err) {
                    if (err) { }
                    // return a message

                });
            }

        });
    });
}





