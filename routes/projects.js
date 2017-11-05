const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// destructuring 
const {ensureAuthenticated} = require('../helpers/auth');


 // load Project model
 require('../models/Project');
 const Project = mongoose.model('projects');

// Project Index Page / taking ideas from database and passing into render
router.get('/', ensureAuthenticated, (req, res) => {
    // the user in the {} makes it so only you can see your projects
    Project.find({user: req.user.id})
        // promise & sort
        .sort({
            date: 'desc'
        })
        .then(projects => {
            res.render('projects/index', {
                projects: projects
            });
        });
});

// project form routes / project add

router.get('/add', ensureAuthenticated, (req, res) => {
    // rendering to about.handlebars
    res.render('projects/add');
});
// edit project form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    // this finds one item by id
    Project.findOne({
            _id: req.params.id
        })
        .then(project => {
            if(project.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/projects');
            } else {
                res.render('projects/edit', {
                    project: project
                });
            }
          
        });
});


// process the form

router.post('/', ensureAuthenticated, (req, res) => {
    // res.send('ok');
    // console.log(req.body)
    let errors = [];

    if (!req.body.title) {
        errors.push({
            text: 'Please add a title'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add some details'
        });
    }
    if (errors.length > 0) {
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Project(newUser)
            .save()
            .then(project => {
                req.flash('success_msg', 'Project Added');
                res.redirect('/projects');
            })
    }
});

// edit form process so changes can be made
router.put('/:id', ensureAuthenticated, (req, res) => {
    Project.findOne({
            _id: req.params.id
        })
        .then(project => {
            //new values
            project.title = req.body.title;
            project.details = req.body.details;

            project.save()
                .then(project => {
                    req.flash('success_msg', 'Project Updated');
                    res.redirect('/projects');
                })
        })
});

// delete project
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Project.remove({_id: req.params.id})
      .then(() => {
          req.flash('success_msg', 'Project removed');
        res.redirect('/projects');
      });
  });


module.exports = router;