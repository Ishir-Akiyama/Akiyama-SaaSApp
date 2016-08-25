var bodyParser = require('body-parser'); 	// get body-parser
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var Client = require('../controller/client.server.controller');
var Image = require('../controller/image.server.controller');


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

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRouter.post('/authenticate', function (req, res) {

        // find the user
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (err, user) {

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
                        name: user.name,
                        username: user.username
                    }, superSecret, {
                        expiresIn: '24h' // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
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

		    var user = new User();		// create a new instance of the User model
		    user.name = req.body.name;  // set the users name (comes from the request)
		    user.username = req.body.username;  // set the users username (comes from the request)
		    user.password = req.body.password;  // set the users password (comes from the request)

		    user.save(function (err) {
		        if (err) {
		            // duplicate entry
		            if (err.code == 11000)
		                return res.json({ success: false, message: 'A user with that username already exists. ' });
		            else
		                return res.send(err);
		        }

		        // return a message
		        res.json({ message: 'User created!' });
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
		        if (req.body.name) user.name = req.body.name;
		        if (req.body.username) user.username = req.body.username;
		        if (req.body.password) user.password = req.body.password;

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
    apiRouter.route('/images/:image_name')

		// get the image with that id
		.get(function (req, res) {
		    Image.findByName(req, res);
		})

    // update the client with this id
    //.put(function (req, res) {

    //})

    // delete the client with this id
    //.delete(function (req, res) {
    //    Client.remove({
    //        _id: req.params.client_id
    //    }, function (err, client) {
    //        if (err) res.send(err);

    //        res.json({ message: 'Successfully deleted' });
    //    });
    //});

    // api endpoint to get user information
    apiRouter.get('/me', function (req, res) {
        res.send(req.decoded);
    });

    return apiRouter;
};