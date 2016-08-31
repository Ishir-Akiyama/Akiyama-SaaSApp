var mongoose     = require('mongoose');
var Schema = mongoose.Schema;
var AutoIncrement = require('mongoose-sequence');
var bcrypt 		 = require('bcrypt-nodejs');

// user schema 
var UserSchema = new Schema({
    UserId: Number,
    firstname: String,
    lastname: String,
    //role: String,
    username: { type: String, required: true, index: { unique: true } },
    email: String,
    password: String,
    isadmin: { type: Boolean, required: true },
    isactive: { type: Boolean, required: true },
    clientid: Number,
    createdOn: { type: Date, default: Date.now },
    isdefault: { type: Boolean, required: true }
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
	var user = this;

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		console.log(user.password);
		next();
	});
});

UserSchema.methods.randomPassword = function (length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    length = length == 0 ? 8 : length;
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
UserSchema.plugin(AutoIncrement, { inc_field: 'UserId' });
