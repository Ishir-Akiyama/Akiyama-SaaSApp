
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
    uploadedOn: { type: String, default: dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT") },
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
    var query = Image.find().sort({ _id: 1 }).limit(10);
    query.exec(function (err, results) {
        if (err) response.send(err);
        response.json(results);
    })
}

var now = new Date(); // Today!
var yesterDay=now.setDate(now.getDate() - 1);
//var dateFormat = require('dateformat');
//var yesterDay = (now, "dd mm yyyy")

exports.getYesterdayToDateData = function (req, response) {
    clientId = req.params.client_id;
    module.exports = mongoose.model('images_' + clientId, sch_obj);
    console.log(now);
    var Image = mongoose.model('images_' + clientId);
    //var query = Image.find({ "uploadedOn": /.*yesterDay.*/ })
     var query= Image.find({"uploadedOn": {"$gte": new Date(2016, 08,07, 11,11,11)}}).count()
    query.exec(function (err, results) {
        if (err) response.send(err);
        // return the users
        console.log("yesterDay");
        console.log(results);
        console.log(new Date(2016, 08, 07, 11, 11, 11));
        response.json(results);
    })
}