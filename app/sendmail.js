var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bodyParser = require('body-parser'); 	// get body-parser
var jwt = require('jsonwebtoken');
var express = require('express');
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "akiyamaemail@gmail.com",
        pass: "akiyama@email"
    },
    from:String,
    useremail:String,
    subject:String,
    text:String,
    html:String
});

var MailSchema = new Schema({
    from: String,
    useremail: String,
    subject: String,
    text: String,
    html: String
});

MailSchema.methods.sendMail = function (from, useremail, subject, text, html, error, response) {
    smtpTransport.sendMail({ from: from, to: useremail, subject: subject, text: text,html:html }, function (error, response) {
        if (error) {
            console.log(error);
            //response.end("error");
        } else {
            console.log("Message sent: " + response.message);
            //response.end("sent");
        }
    });
};

module.exports = mongoose.model('mail', MailSchema);

