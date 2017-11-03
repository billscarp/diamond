const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();



 // load Project model
 require('../models/Project');
 const Project = mongoose.model('projects');

// Project Index Page / taking ideas from database and passing into render
router.get('/', (req, res) => {
    Project.find({})
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

router.get('/add', (req, res) => {
    // rendering to about.handlebars
    res.render('projects/add');
});
// edit project form
router.get('/edit/:id', (req, res) => {
    // this finds one item by id
    Project.findOne({
            _id: req.params.id
        })
        .then(project => {
            res.render('projects/edit', {
                project: project
            });
        });
});


// process the form

router.post('/', (req, res) => {
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
            details: req.body.details
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    Project.remove({_id: req.params.id})
      .then(() => {
          req.flash('success_msg', 'Project removed');
        res.redirect('/projects');
      });
  });


module.exports = router;