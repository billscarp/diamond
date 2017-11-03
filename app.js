    //////   REQUIERS  //////


    // require express & brings it in
    const express = require('express');

    // require express handlebars
    const exphbs = require('express-handlebars');

    // this package allows you to use puts without doing an ajax request
    const methodOverride = require('method-override');

    // connect-flash
    const flash = require('connect-flash');

    // express-session
    const session = require('express-session');

    // require body-parser
    const bodyParser = require('body-parser');

    // require mongoose
    const mongoose = require('mongoose');

    // created app variable to express funtion to initialize the app
    const app = express();

    //////  MONGOOSE //////

    // map global promise - remove warning / using promises rather than callbacks
    mongoose.Promise = global.Promise;
    // connect database to mongoose
    mongoose.connect('mongodb://localhost/project-dev', {
            useMongoClient: true
        })
        //promise
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(err));

    // load Project model
    require('./models/Project');
    const Project = mongoose.model('projects');



    ///////  HANDLEBARS   ///////

    // handlebars middleware from docs https://github.com/ericf/express-handlebars
    // using handlebars as default templating and setting default layout to main
    app.engine('handlebars', exphbs({
        defaultLayout: 'main'
    }));
    app.set('view engine', 'handlebars');


    ///// BODY-PARSER MIDDLEWARE //////
    // parse application/x-www-form-urlencoded
    // allows access to request.body
    app.use(bodyParser.urlencoded({
        extended: false
    }))

    // parse application/json
    app.use(bodyParser.json())

    ////// METHOD-OVERRIDE MIDDLEWARE //////
    // override with POST having ?_method=DELETE
    app.use(methodOverride('_method'));


    //////  EXPRESS-SESSION MIDDLEWARE //////

    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
      }));

      ////  FLASH ////
      //calling flash
      app.use(flash());  

   // global variables
   app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

    //////  ROUTES   //////

    //index route  using request and response object callback function
    app.get('/', (req, res) => {
        // send is a method attatched to res
        const title = 'Welcome to Unpolished Diamond!';
        //object title passes to variable title goes to index.handlebars
        res.render('index', {
            title: title

        });
    });

    // About Route
    app.get('/about', (req, res) => {
        // rendering to about.handlebars
        res.render('about');
    });

    // Project Index Page / taking ideas from database and passing into render
    app.get('/projects', (req, res) => {
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

    app.get('/projects/add', (req, res) => {
        // rendering to about.handlebars
        res.render('projects/add');
    });
    // edit project form
    app.get('/projects/edit/:id', (req, res) => {
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

    app.post('/projects', (req, res) => {
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
            res.render('projects/add', {
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
                    res.redirect('/projects');
                })
        }
    });

    // edit form process so changes can be made
    app.put('/projects/:id', (req, res) => {
        Project.findOne({
                _id: req.params.id
            })
            .then(project => {
                //new values
                project.title = req.body.title;
                project.details = req.body.details;

                project.save()
                    .then(project => {
                        res.redirect('/projects');
                    })
            })
    });

    // delete project
    app.delete('/projects/:id', (req, res) => {
        Project.remove({_id: req.params.id})
          .then(() => {
              req.flash('success_msg', 'Project removed');
            res.redirect('/projects');
          });
      });


    //////  SERVER ///////

    // server port to listen on
    const port = 5000;

    // listen method, passing in port number 6000 with fat arrow function for callback
    app.listen(port, () => {
        // console log uses a template string/literal to include variable with out needing to concatenate
        console.log(`Server started on port ${port}`);
    });