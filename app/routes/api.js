var bodyParser = require('body-parser'); 	// get body-parser
var User = require('../models/user.server.model');
var ClientModel = require('../models/client.server.model');
var UserCtrl = require('../controller/user.server.controller');
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
var expiresIn = config.expiresIn;

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
        }).select('_id username password isadmin email firstname lastname isdefault clientid UserId isactive').exec(function (err, user) {
            if (err) throw err;

            // no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            }
            else if (user) {
                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                }
                else if (!user.isactive) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. User not active.'
                    });
                }
                else if (!user.isadmin) {
                    var query = ClientModel.findOne({
                        ClientId: user.clientid
                    }).select('_id name city state clientid isActive');
                    query.exec(function (err, clien) {
                        if (err) throw err;
                        if (!clien.isActive) {
                            res.json({
                                success: false,
                                message: 'Authentication failed. User not active.'
                            });
                        }
                        else {
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
                              expiresIn: expiresIn // expires in is configured in config.js
                          });

                            // return the information including token as JSON
                            res.json({
                                success: true,
                                message: 'Enjoy your token!',
                                isdefault: user.isdefault,
                                token: token
                            });
                        }
                    })
                }
                else {
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
		    UserCtrl.create(req, res);
		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function (req, res) {
		    UserCtrl.all(req, res);
		});

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function (req, res) {
		    UserCtrl.findById(req, res);
		})

		// update the user with this id
		.put(function (req, res) {
		    UserCtrl.update(req, res);
		})

		// delete the user with this id
		.delete(function (req, res) {
		    User.delete(req, res);
		});


    // on routes that end in /clients
    // ----------------------------------------------------
    apiRouter.route('/clients')
		// create a client (accessed at POST http://localhost:8080/api/clients)
		.post(function (req, res) {
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
		    if (req.body.clientId = 'undefined') {
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
		                    //req.decoded = decoded;

		                    req.body.clientId = decoded.clientid;
		                    req.body.userid = decoded.UserId;

		                    Image.create(req, res);

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
		    }
		    else {
		        Image.create(req, res);
		    }
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
        UserCtrl.forgetPassword(req, res);
    });

    //change Password
    apiRouter.put('/changePassword', function (req, res) {
        UserCtrl.changePassword(req, res);
    });

    //For Dashboard
    apiRouter.route('/dashboard/:client_id')
        .get(function (req, res) {
            Dashboard.getRecentUploads(req, res);
        })

     // get the image with that id
		.post(function (req, res) {
		    Dashboard.scoreImageSchduler(req, res);
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