var User = require('../models/user.server.model');
var mail = require('../sendmail');
//create new user
exports.create = function (req, res) {
	var user = new User();          // create a new instance of the User model
	randonPassword = (req.body.password == undefined || req.body.password == "") ? user.randomPassword(8) : req.body.password;
	user.UserId = req.body.UserId;
	user.firstname = req.body.firstname;  
	user.lastname = req.body.lastname;    
	user.username = req.body.username;  
	user.email = req.body.email;
	user.password = randonPassword;     
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
	    user.clientid = "";
	}
	user.isactive = req.body.isactive;
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
	});
}

//Get all users
exports.all=function(req, res)
{
	User.find({}, function (err, users) {
		if (err) res.send(err);
		// return the users
		res.json(users);
	});
}

//Get by user id
exports.findById = function (req, res) {
	User.findById(req.params.user_id, function (err, user) {
		if (err) res.send(err);
		// return that user
		res.json(user);
	});
}

exports.update = function (req, res) {
	User.findById(req.params.user_id, function (err, user) {
		if (err) res.send(err);
		// set the new user information if it exists in the request
		if (req.body.firstname) user.firstname = req.body.firstname;
		if (req.body.lastname) user.lastname = req.body.lastname;
		if (req.body.username) user.username = req.body.username;
		if (req.body.email) user.email = req.body.email;
		if (req.body.password) user.password = req.body.password;
		user.isactive = req.body.isactive;
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
		    user.clientid = "";
		}
		// save the user
		user.save(function (err) {
		    if (err) {
		        // duplicate entry
		        if (err.code == 11000)
		            return res.json({ success: false, message: 'A user with that username already exists. ' });
		        else
		            return res.send(err);
		    }
			// return a message
			res.json({ message: 'User updated!' });
		});

	});
}

exports.delete=function(req,res)
{
	User.remove({
		_id: req.params.user_id
	}, function (err, user) {
		if (err) res.send(err);

		res.json({ message: 'Successfully deleted' });
	});
}

exports.forgetPassword=function(req, res)
{
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
}

exports.changePassword=function(req, res)
{
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
}