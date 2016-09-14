
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var now = new Date();
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

var clientId;

exports.dashboardPieChartByClientId = function (req, res) {
    clientId = req.params.client_id;
    module.exports = mongoose.model('images_' + clientId, sch_obj);
    var Image = mongoose.model('images_' + clientId);
    Image.aggregate([{ "$group": { _id: "$status", count: { $sum: 1 } } }], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
}


exports.getRecentUploads = function (req, response) {
    clientId = req.params.client_id;
    module.exports = mongoose.model('images_' + clientId, sch_obj);
    var Image = mongoose.model('images_' + clientId);
    var query = Image.find().sort({ _id: -1 }).limit(10);
    console.log(query);
    query.exec(function (err, results) {
        if (err) response.send(err);
        response.json(results);
    })
}

exports.getYearToDateData = function (req, response) {
    var date = new Date(), y = date.getFullYear(), ly = date.getFullYear() - 1, m = date.getMonth();
    var firstDay = new Date(ly, 12, 0);
    var lastDay = new Date(y, 12, 0);
    firstDay.setDate(firstDay.getDate() + 1);
    lastDay.setDate(lastDay.getDate() + 2);
    clientId = req.params.client_id;
    module.exports = mongoose.model('images_' + clientId, sch_obj);
    var Image = mongoose.model('images_' + clientId);
    var query = Image.find({
        uploadedOn: {
            '$gte': new Date(firstDay),
            '$lt': new Date(lastDay)
        }
    }).count()
    query.exec(function (err, results) {
        if (err) response.send(err);      
        response.json(results);
    })
}


exports.getYesterdayToDateData = function (req, response) {
    var now = new Date();
    var n= now.setDate(now.getDate() - 1);// Today!
    var yesterDay = now.setDate(now.getDate() - 1);
    clientId = req.params.client_id;
    module.exports = mongoose.model('images_' + clientId, sch_obj);
    var Image = mongoose.model('images_' + clientId);
    var query = Image.find({
        uploadedOn: {
            '$gte': new Date(yesterDay),
            '$lt': new Date(n)
        }
    }).count()
    console.log(query);
    query.exec(function (err, results) {
        if (err) response.send(err);
        response.json(results);
    })
}

exports.getMonthToDateData = function (req, response) {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth() + 1;
    var firstDay = new Date(m == 1 ? y - 1 : y, m == 1 ? 12 : m - 1, 1);
    var lastDay = new Date(m == 1 ? y - 1 : y, m, 0);
    lastDay.setDate(lastDay.getDate() + 2);
    clientId = req.params.client_id;

    module.exports = mongoose.model('images_' + clientId, sch_obj);
    var Image = mongoose.model('images_' + clientId);
    var query = Image.find({
        uploadedOn: {
            '$gte': new Date(firstDay),
            '$lt': new Date(lastDay)
        }
    }).count()
    query.exec(function (err, results) {
        if (err) response.send(err);
        response.json(results);
    })
}

exports.getLastMonthToDateData = function (req, response) {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(m == 1 ? y - 1 : y, m == 1 ? 12 : m - 1, 1);
    var lastDay = new Date(m == 1 ? y - 1 : y, m, 0);
    lastDay.setDate(lastDay.getDate() + 2);
    clientId = req.params.client_id;
    module.exports = mongoose.model('images_' + clientId, sch_obj);
    var Image = mongoose.model('images_' + clientId);
    var query = Image.find({
        uploadedOn: {
            '$gte': new Date(firstDay),
            '$lt': new Date(lastDay)
        }
    }).count()
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

                });
            }

        });
    });
}


