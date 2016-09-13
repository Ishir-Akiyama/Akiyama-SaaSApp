//var Image = require('../models/image.server.model');


var mongoose = require('mongoose');
//create new client
//var dateFormat = require('dateformat');
//var now = new Date();

var sch_obj = new mongoose.Schema({
    name: { type: String, default: "" },
    filename: { type: String, default: "" },
    type: { type: String, default: "" },
    byte: { type: String, contentType: String, default: "" },
    user: { type: String, default: "" },
    uploadedOn: { type: Date, default: Date.now },
    status: { type: Number, default: -1 },
});


var clientId;
exports.create = function (request, response) {
    clientId = request.body.clientId;
    module.exports = mongoose.model('Images_' + request.body.clientId, sch_obj);
    var Image = mongoose.model('Images_' + request.body.clientId);


    if (request.body.type.indexOf("application/vnd.openxmlformats") > -1) {
        var bitmap = new Buffer(request.body.file.replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64", ""), 'base64');
        // write buffer to file
        var fs = require('fs');
        if (!fs.existsSync("Uploads")) {
            fs.mkdirSync("Uploads");
        }
        var fileAddress = "Uploads/" + request.body.filename;

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
                            user: request.body.userid,
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
    else if (request.body.type.indexOf("application/vnd.ms-excel") > -1) {

        var bitmap = new Buffer(request.body.file.replace("data:application/vnd.ms-excel;base64", ""), 'base64');
        // write buffer to file
        var fs = require('fs');
        if (!fs.existsSync("Uploads")) {
            fs.mkdirSync("Uploads");
        }
        var fileAddress = "Uploads/" + request.body.filename;
        fs.writeFileSync(fileAddress, bitmap);

        var Converter = require("csvtojson").Converter;
        var converter = new Converter({});
        converter.fromFile(fileAddress, function (err, result) {

            if (err) {

                console.error(err);
                throw ex;
            } else {

                fs.writeFileSync(fileAddress + '.json', JSON.stringify(result));

                var content;
                // First I want to read the file
                fs.readFile(fileAddress + '.json', function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    content = data;

                    var imagesInExcel = JSON.parse(content);

                    for (var i = 0; i < imagesInExcel.length; i++) {
                        var getType = imagesInExcel[i].Image.toString().substr(5, 20);
                        getType = getType.substr(0, getType.indexOf(";"));
                        var entry = new Image({
                            name: imagesInExcel[i].name,
                            filename: request.body.filename,
                            type: getType,
                            byte: imagesInExcel[i].Image,
                            user: request.body.user,
                        });
                        entry.save(function (err) {
                            if (err) { }
                            // return a message
                        });
                    }
                    response.json({ message: 'Csv imported!' });
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
                // duplicate entry
                //if (err.code == 11000) 
                //    return res.json({ success: false, message: 'A user with that username already exists. '});
                //else 
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

//Get Report
exports.findByParam = function (request, response) {
    var temp1 = request.params.clientId;
    var temp2 = request.params.fromdate;
    var temp3 = request.params.todate;
    var now = new Date(temp2);
    temp2 = now.setDate(now.getDate());

    var now2 = new Date(temp3);
    temp3 = now2.setDate(now2.getDate() + 1);
    module.exports = mongoose.model('Images_' + temp1, sch_obj);
    var Image = mongoose.model('Images_' + temp1);

    var query = Image.find({
        uploadedOn: {
            '$gte': new Date(temp2).toISOString(),
            '$lt': new Date(temp3).toISOString()
        }
    });
    query.exec(function (err, results) {
        if (err) response.send(err);
        response.json(results);
    })
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

//console.log(data);
//Image.find({}, function (err, Image) {
//    if (err) res.send(err);
//    // return the users
//    console.log('Respone data');

//    console.log(Image[0])
//    res.json(Image);
//});




