var bodyParser = require('body-parser'); 	// get body-parser
var User = require('../models/user.server.model');
var Client = require('../controller/client.server.controller');
var Image = require('../controller/image.server.controller');
var Dashboard = require('../controller/dashboard.server.controller');
var jwt = require('jsonwebtoken');
var config = require('../../config');
//for email
var express = require('express');
var nodemailer = require("nodemailer");
var mail = require('../sendmail');
var mongoose = require('mongoose');

var app = express();
var randonPassword = "";
// super secret for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {

    var apiRouter = express.Router();

    // route to generate sample user
    apiRouter.post('/sample', function (req, res) {

        // look for the user named chris
        User.findOne({ 'username': 'chris' }, function (err, user) {

            // if there is no chris user, create one
            if (!user) {
                var sampleUser = new User();

                sampleUser.name = 'Chris';
                sampleUser.username = 'chris';
                sampleUser.password = 'supersecret';

                sampleUser.save();
            } else {
                console.log(user);

                // if there is a chris, update his password
                user.password = 'supersecret';
                user.save();
            }

        });
    });

    apiRouter.post('/authenticateUser', function (req, res) {

        // find the user
        User.findOne({
            username: req.body.username
        }).select('username').exec(function (err, user) {
            if (err) throw err;

            // no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'User not exist.'
                });
            }
            else {
                User.findById(user._id, function (err, user) {

                    if (err) res.send(err);
                    NewPassword = user.randomPassword(8);
                    // update the user information if it exists in the request
                    if (user.password) user.password = NewPassword;

                    if (req.body.password) user.password = NewPassword;
                    user.isdefault = true;
                    // save the user
                    user.save(function (err) {
                        console.log(err)
                        if (err) {

                            res.send(err);
                        }
                        var smtp = new mail();

                        smtp.from = "akiyamaemail@gmail.com";
                        smtp.useremail = user.email;
                        smtp.subject = "Reset Password for Akiyama Account";
                        smtp.text = "New File";
                        smtp.html = "Hi " + user.firstname + " " + user.lastname + "<br/><br/> Your Password for the username " + user.username + " is successfully changed to " + NewPassword;
		                smtp.html += "<br/><br/>Regards,<br/>Team Akiyama";

                        smtp.sendMail(smtp.from, smtp.useremail, smtp.subject, smtp.text, smtp.html);

                        // return a message
                        res.json({ message: 'Password Updated Check Your Registered Email-ID' });
                    });

                });
            }
        });
    });

    apiRouter.post('/authenticate', function (req, res) {
        // find the user
        User.findOne({
            username: req.body.username
        }).select('_id username password isadmin email firstname lastname isdefault clientid UserId').exec(function (err, user) {

            if (err) throw err;

            // no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {

                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({
                        username: user.username,
                        email: user.email,
                        clientid: user.clientid,
                        UserId: user.UserId,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        isadmin: user.isadmin,
                        _id: user._id
                    },
                  superSecret, {
                      expiresIn: '24h' // expires in 24 hours
                  });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        isdefault: user.isdefault,
                        token: token
                    });
                }
            }
        });
    });


    // route middleware to verify a token
    apiRouter.use(function (req, res, next) {
        // do logging
        console.log('Somebody just came to our app!');

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, superSecret, function (err, decoded) {

                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    next(); // make sure we go to the next routes and don't stop here
                }
            });

        } else {

            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });

    // test route to make sure everything is working 
    // accessed at GET http://localhost:8080/api
    apiRouter.get('/', function (req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    // on routes that end in /users
    // ----------------------------------------------------
    apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function (req, res) {
		    var user = new User();          // create a new instance of the User model
		    randonPassword = (req.body.password == undefined || req.body.password == "") ? user.randomPassword(8) : req.body.password;

		    //var user = new User();		// create a new instance of the User model
		    user.UserId = req.body.UserId;
		    //if (req.body.firstname == "" || req.body.firstname == undefined)
		    //    return res.json({ success: false, message: 'Please fill First Name.' });
		    //else
		    user.firstname = req.body.firstname;  // set the users firstname (comes from the request)

		    //if (req.body.lastname == "" || req.body.lastname == undefined)
		    //    return res.json({ success: false, message: 'Please fill Last Name.' });
		    //else
		    user.lastname = req.body.lastname;    // set the users lastname (comes from the request)

		    //if (req.body.username == "" || req.body.username == undefined)
		    //    return res.json({ success: false, message: 'Please fill User Name.' });
		    //else
		    user.username = req.body.username;  // set the users username (comes from the request)

		    //if (req.body.email == "" || req.body.email == undefined)
		    //    return res.json({ success: false, message: 'Please fill Email Id.' });
		    //else
		    user.email = req.body.email;
		    user.password = randonPassword;     // set the users password (comes from the request)
		    user.isadmin = req.body.isadmin;
		    if (user.isadmin == true) {
		        user.isadmin = true;
		    }
		    else {
		        user.isadmin = false;
		    }
		    if (user.isadmin == false) {
		        user.clientid = req.body.clientid;
		    }
		    else {
		        user.clientname = "";
		    }
		    user.isactive = true;
		    user.isdefault = true;

		    user.save(function (err) {
		        if (err) {
		            console.log(err);
		            // duplicate entry
		            if (err.code == 11000)
		                return res.json({ success: false, message: 'A user with that username already exists. ' });
		            else
		                return res.send(err);
		        }

		        // return a message
		        res.json({ message: 'User created!' });
		        //
		        //query with mongoose
		        User.findOne({ 'username': req.body.username }, function (err, user) {

		            var smtp = new mail();

		            smtp.from = "akiyamaemail@gmail.com";
		            smtp.useremail = user.email;
		            smtp.subject = "Akiyama - Account Login Credentials";
		            smtp.text = "New File";
		            smtp.html = "Hi " + user.firstname + " " + user.lastname + "<br/><br/> You are successfully registered for Akiyama Web Application. Please use following credentials to access the application: <br/><br/>";
		            smtp.html += "User Name - " + user.username + "<br/>Password - " + randonPassword + "<br/><br/><a href='http://localhost:8080/'>Click Here to Login</a>";
		            smtp.html += "<br/><br/>Regards,<br/>Team Akiyama";
                    smtp.sendMail(smtp.from, smtp.useremail, smtp.subject, smtp.text, smtp.html);

		        });

		        //
		        
		    });


		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function (req, res) {

		    User.find({}, function (err, users) {
		        if (err) res.send(err);

		        // return the users
		        res.json(users);
		    });
		});

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function (req, res) {
		    User.findById(req.params.user_id, function (err, user) {
		        if (err) res.send(err);

		        // return that user
		        res.json(user);
		    });
		})

		// update the user with this id
		.put(function (req, res) {
		    User.findById(req.params.user_id, function (err, user) {
		        if (err) res.send(err);
		        // set the new user information if it exists in the request
		        if (req.body.firstname) user.firstname = req.body.firstname;
		        if (req.body.lastname) user.lastname = req.body.lastname;
		        if (req.body.username) user.username = req.body.username;
		        if (req.body.password) user.password = req.body.password;
		        if (req.body.isadmin) user.password = req.body.isadmin;
		        if (req.body.isactive) user.isactive = req.body.isactive;
		        // save the user
		        user.save(function (err) {
		            if (err) res.send(err);
		            // return a message
		            res.json({ message: 'User updated!' });
		        });

		    });
		})

		// delete the user with this id
		.delete(function (req, res) {
		    User.remove({
		        _id: req.params.user_id
		    }, function (err, user) {
		        if (err) res.send(err);

		        res.json({ message: 'Successfully deleted' });
		    });
		});


    // on routes that end in /clients
    // ----------------------------------------------------
    apiRouter.route('/clients')
		// create a client (accessed at POST http://localhost:8080/api/clients)
		.post(function (req, res) {
		    console.log(res);
		    Client.create(req, res);
		})

		// get all the clients (accessed at GET http://localhost:8080/api/clients)
		.get(function (req, res) {
		    Client.all(req, res);
		});


    // on routes that end in /activeClients
    // ----------------------------------------------------
    apiRouter.route('/activeClients')

		// get all the active clients (accessed at GET http://localhost:8080/api/activeClients)
		.get(function (req, res) {
		    Client.allActive(req, res);
		});

    // on routes that end in /clients/:client_id
    // ----------------------------------------------------
    apiRouter.route('/clients/:client_id')

		// get the client with that id
		.get(function (req, res) {
		    Client.findById(req, res);
		})

		 //update the client with this id
		.put(function (req, res) {

		    Client.update(req, res);
		})

		// delete the client with this id
		.delete(function (req, res) {
		    Client.remove({
		        _id: req.params.client_id
		    }, function (err, client) {
		        if (err) res.send(err);

		        res.json({ message: 'Successfully deleted' });
		    });
		});


    // on routes that end in /images
    // ----------------------------------------------------
    apiRouter.route('/images')
		// create a image (accessed at POST http://localhost:8080/api/images)
		.post(function (req, res) {
		    Image.create(req, res);
		})

		// get all the images (accessed at GET http://localhost:8080/api/images)
		.get(function (req, res) {
		    Image.all(req, res);
		});


    // on routes that end in /activeImages
    // ----------------------------------------------------
    apiRouter.route('/activeImages')

		// get all the active clients (accessed at GET http://localhost:8080/api/activeImages)
		.get(function (req, res) {
		    Image.allActive(req, res);
		});

    // on routes that end in /images/:image_name
    // ----------------------------------------------------
    apiRouter.route('/images/:client_id')

		// get the image with that id
		.get(function (req, res) {
		    Image.findByClient(req, res);
		})

    // get the image with that id
		.post(function (req, res) {
		    Image.scoreImageSchduler(req, res);
		});

    apiRouter.route('/images/:image_id')

      // get the client with that id
      .get(function (req, res) {
          Image.findById(req, res);
      })

       //update the client with this id
      .put(function (req, res) {
          Image.update(req, res);
      });

    //forgotPassword
    apiRouter.post('/forgotPassword', function (req, res) {
        // find the user
        User.findOne({
            username: req.body.username
        }).select('_id name username password emailid').exec(function (err, user) {

            if (err) throw err;

            // no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {
                User.findById(req.params.user_id, function (err, user) {

                    if (err) res.send(err);

                    // set the new user information if it exists in the request
                    if (req.body.firstname) user.firstname = req.body.firstname;
                    if (req.body.lastname) user.lastname = req.body.lastname;
                    if (req.body.username) user.username = req.body.username;
                    if (req.body.password) user.password = req.body.password;
                    if (req.body.isactive) user.isactive = req.body.isactive;
                    // save the user
                    user.save(function (err) {
                        if (err) res.send(err);

                        // return a message
                        res.json({ message: 'User updated!' });
                    });

                });
            }
        });
    });

    //change Password
    apiRouter.put('/changePassword', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('_id firstname username password emailid isdefault').exec(function (err, user) {
            console.log("user Data" + user);
            if (err) res.send(err);
            // set the new user information if it exists in the request
            if (req.body.firstname) user.firstname = req.body.firstname;
            if (req.body.lastname) user.lastname = req.body.lastname;
            if (req.body.username) user.username = req.body.username;
            if (req.body.email) user.email = req.body.email;
            if (req.body.password) user.password = req.body.password;
            user.isdefault = false;
            // save the user
            user.save(function (err) {
                if (err) res.send(err);
                // return a message
                res.json({ message: 'Password updated!' });
            });
        })
    });

    //For Dashboard
    apiRouter.route('/dashboard/:client_id')
        .get(function (req, res) {
            Dashboard.getRecentUploads(req, res);
        });

    apiRouter.route('/dashboardchart/:client_id')
        .get(function (req, res) {
            Dashboard.dashboardPieChartByClientId(req, res);
        })

    apiRouter.route('/dashboardYear/:client_id')
        .get(function (req, res) {
            Dashboard.getYearToDateData(req, res);
        })

    apiRouter.route('/dashboardYesterday/:client_id')
        .get(function (req, res) {
            Dashboard.getYesterdayToDateData(req, res);
        })

    apiRouter.route('/dashboardMonth/:client_id')
       .get(function (req, res) {
           Dashboard.getMonthToDateData(req, res);
       })

    apiRouter.route('/dashboardLastMonth/:client_id')
       .get(function (req, res) {
           Dashboard.getLastMonthToDateData(req, res);
       })

    //for report
    apiRouter.route('/report/')
      .post(function (req, res) {
          req.params.clientId = req.body.clientId;
          req.params.fromdate = req.body.fromdate;
          req.params.todate = req.body.todate;
          Image.findByParam(req, res);
      });

    // api endpoint to get user information
    apiRouter.get('/me', function (req, res) {
        res.send(req.decoded);
    });

    return apiRouter;
};