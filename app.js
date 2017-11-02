    //////   REQUIERS  //////


    // require express & brings it in
    const express = require('express');

    // require express handlebars
    const exphbs = require('express-handlebars');

    // require body-parser
    const bodyParser = require('body-parser');

    // require mongoose
    const mongoose = require('mongoose');

    // created app variable to express funtion to initialize the app
    const app = express();

    //////  MONGOOSE //////

    // map global promise - remove warning
    mongoose.Promise = global.Promise;
    // connect database to mongoose
    mongoose.connect('mongodb://localhost/projects-dev', {
            useMongoClient: true
        })
        //promise
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(err));

    // load Project model
    require('./models/Project');
    const Project = mongoose.model('project');



    ///////  HANDLEBARS   ///////

    // handlebars middleware from docs https://github.com/ericf/express-handlebars
    // using handlebars as default templating and setting default layout to main
    app.engine('handlebars', exphbs({
        defaultLayout: 'main'
    }));
    app.set('view engine', 'handlebars');


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

    // project form routes

    app.get('/projects/add', (req, res) => {
        // rendering to about.handlebars
        res.render('projects/add');
    });

    // process the form

    app.post('/projects', (req, res) => {
        res.send('ok');
    });

    //////  SERVER ///////

    // server port to listen on
    const port = 5000;

    // listen method, passing in port number 6000 with fat arrow function for callback
    app.listen(port, () => {
        // console log uses a template string/literal to include variable with out needing to concatenate
        console.log(`Server started on port ${port}`);
    });