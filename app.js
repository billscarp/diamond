    //////   REQUIERS  //////


    // require express & brings it in
    const express = require('express');

    const path = require('path');

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

    // require passport
    const passport = require('passport');

    // require mongoose
    const mongoose = require('mongoose');

    // created app variable to express funtion to initialize the app
    const app = express();

    // load routes
    const projects = require('./routes/projects');

    const users = require('./routes/users');

    // passport conifg
    require('./config/passport')(passport);

    // database config
    const db = require('./config/database');

    app.use(express.static(path.join(__dirname, 'public')));



    //////  MONGOOSE //////

    // map global promise - remove warning / using promises rather than callbacks
    mongoose.Promise = global.Promise;
    // connect database to mongoose
    mongoose.connect(db.mongoURI, {
            useMongoClient: true
        })
        //promise
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(err));





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

    //// PASSPORT MIDDLEWARE /////
    app.use(passport.initialize());
    app.use(passport.session());

    ////  FLASH ////
    //calling flash
    app.use(flash());

    // global variables
    app.use(function (req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
    });

    //////  ROUTES   //////

    //index route  using request and response object callback function
    app.get('/', (req, res) => {
        // send is a method attatched to res
        const title = 'Welcome to Unpolished Diamond';
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

       // About Route
       app.get('/auction', (req, res) => {
        // rendering to about.handlebars
        res.render('auction');
    });

    /////// PASSPORT  ////////



    // use routes uses projects.js users.js
    app.use('/projects', projects);
    app.use('/users', users);
    //////  SERVER ///////

    // server port to listen on
    const port = process.env.PORT || 5000;

    // listen method, passing in port number 6000 with fat arrow function for callback
    app.listen(port, () => {
        // console log uses a template string/literal to include variable with out needing to concatenate
        console.log(`Server started on port ${port}`);
    });