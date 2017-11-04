const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

  //user login route
  router.get('/login', (req, res) => {
    res.render('users/login');
  });

  // user register route
  router.get('/register', (req, res) => {
    res.render('users/register');
  });

  // catch the register form
router.post('/register', (req, res) => {
  let.error = [];

  if (req.body.password != req.body.password2){
    errors.push({text: 'Passowrds do not match'});
  }
  if(req.body.password.length < 6){
    errors.push({text: 'Passowrd must be at leave 6 characters'})
  }
  // passes in errors, name email and password.  If wrong, user won't need to re enter everything.
  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2

    });
  } else {
    res.send('passed');
  }
});

module.exports = router;