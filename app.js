// require express & brings it in
const express = require('express');

// require express handlebars
const exphbs  = require('express-handlebars');

// created app variable to express funtion to initialize the app
const app = express();

// handlebars middleware from docs https://github.com/ericf/express-handlebars
// using handlebars as default templating and setting default layout to main
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//index route  using request and response object callback function
app.get('/', (req, res) =>{
// send is a method attatched to res
    const title = 'Welcome to Unpolished Diamond!';
    //object title passes to variable title
    res.render('index',{
        title: title

    });
});

// About Route
app.get('/about', (req, res) =>{
    // rendering to about.handlebars
    res.render('about');
});


// server port to listen on
const port = 5000;

// listen method, passing in port number 6000 with fat arrow function for callback
app.listen(port, () =>{
    // console log uses a template string/literal to include variable with out needing to concatenate
    console.log(`Server started on port ${port}`);
});

