var mongoose = require('mongoose');
var Token = mongoose.model('ResetPasswordToken');
var User = mongoose.model('User');
var encryption = require('../utils/encryption');
var _ = require('lodash');
var async = require('async');

exports.post = function(params, callback) {
	var password = params.password;
	var tokenString = params.tokenString;
	async.waterfall([
		function prepare(next) {
			password = _.trim(password);
			next();
		},
		function findToken(next) {
			Token.findOne({token: tokenString, expires: { $gt: Date.now() }}).exec(next);
		},
		function validate(token, next) {
			var errors = {};
			var hasErrors = false;
			if(password.length < 6) {
				errors.password = 'Введіть пароль, не менше шести символів';
				hasErrors = true;
	    }
      if (!token) {
      	errors.expired = true;
      	hasErrors = true;
      }
	    if (hasErrors) {
				return callback(null, {result: 'error', errors: errors});
			} else {
				next(null, token);
			}
		},
		function findUser(token, next) {
			User.findOne({_id: token.user_id}).exec(function(err, user) {
				if (err) {
					return next(err);
				} else {
					next(null, token, user);
				}
			});
		},
		function updatePassword(token, user, next) {
			token.remove();
			user.salt = encryption.createSalt();
	        user.hashed_pwd = encryption.hashPwd(user.salt, password);
	        user.save(function(err) {
				if (err) {
					return next(err);
				} else {
					next(null, {result: 'success'});
				}
			});
		}
	], callback);
};