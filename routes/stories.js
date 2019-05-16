// require dependencies
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load helpers
const {ensureAuthenticated} = require('../helpers/auth');

// Load Story Model
require('../models/Story');
const Story = mongoose.model('stories');

// story index
router.get('/', ensureAuthenticated, (req, res) =>{
	Story.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		});
});

// add story form
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('stories/add');
});

// edit story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Story.findOne({
		_id: req.params.id
	})	
		.then(story => {
			if(story.user!=req.user.id){
				req.flash('error_msg', 'Грешка: невалидна операция.');
				res.redirect('/stories');
			} else {
				res.render('stories/edit', {
				story: story
				});
			}
		});
});


// process story form
router.post('/', ensureAuthenticated, (req, res) => {
	let errors = [];

	// catch errors
	if(!req.body.title){
		errors.push({
			text: 'Моля добавете заглавие'
		});
	}
	if(!req.body.details){
		errors.push({
			text: 'Моля добавете детайли'
		});
	}

	// check if any errors occured
	if(errors.length > 0){
		res.render('stories/add',{
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		// add submitted information to the database
		const newStory = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		}
		new Story(newStory)
			.save()
			.then(story => {
				req.flash('success_msg', 'Преживяването беше добавено успешно!')
				res.redirect('/stories');
			});
	}
});

// process edit form
router.put('/:id', ensureAuthenticated, (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
		.then(story =>{
			// update values to match
			story.title = req.body.title;
			story.details = req.body.details;

			story.save()
			.then(story => {
				req.flash('success_msg', 'Въведените промени бяха успешни!')
				res.redirect('/stories');
			});
		});	
});

// process delete story 
router.delete('/:id', ensureAuthenticated, (req, res) => {
	Story.deleteOne({
		_id: req.params.id
	})
		.then(() => {
			req.flash('success_msg', 'Преживяването бе премахнато успешно!')
			res.redirect('/stories');
		});
});


// export the module
module.exports = router;