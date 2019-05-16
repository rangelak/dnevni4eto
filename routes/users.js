// require dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');


const router = express.Router();


// load user model
require('../models/User');
const User = mongoose.model('users');

// user login route
router.get('/login', (req, res) => {
	res.render('users/login');
});

// user register route
router.get('/register', (req, res) => {
	res.render('users/register');
});

// login form POST
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/stories',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

// register form POST
router.post('/register', (req, res) => {
	let errors = [];

	// check if password fills specifications
	if(req.body.password != req.body.password2){
		errors.push({text: 'Паролите не съвпадат!'});
	}
	if(req.body.password.length < 4){
		errors.push({text: 'Паролата трябва да бъде дълга поне 4 символа'});
	}

	if(errors.length > 0){

		// render the same form with error messages
		res.render('users/register',{
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			password2: req.body.password2
		})
	} else{

		// check for the same email
		User.findOne({email: req.body.email})
			.then(user =>{
				if(user){
					req.flash('error_msg', 'Този имейл вече е регистриран!');
					res.redirect('/users/register');
				} else {
					// generating a new user
					const newUser = new User({
						name: req.body.name,
						email: req.body.email,
						password: req.body.password
					});

					// encrypting the password
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if(err) throw err;
							newUser.password = hash;
							newUser.save()
								.then(user => {
									req.flash('success_msg', 'Вече сте регистрирани и можете да влезнете в профила си.');
									res.redirect('/users/login');
								})
								.catch(err =>{
									console.log(err);
									return;
								});
						});
					});
				}
			});
	}
});

// logout user
router.get('/logout', (req, res) =>{
	req.logout();
	req.flash('success_msg', 'Излязохте от профила си. ');
	res.redirect('/users/login');
});

// export the module
module.exports = router;
