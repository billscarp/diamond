const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport')
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
    let errors = [];
  
    if(req.body.password != req.body.password2){
      errors.push({text:'Passwords do not match'});
    }
  
    if(req.body.password.length < 6){
      errors.push({text:'Password must be at least 6 characters'});
    }
  
    if(errors.length > 0){
      res.render('users/register', {
        errors: errors,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
      });
    } else {
    const newUser = {
      name:req.body.name,
      email:req.body.email,
      password:req.body.password
    }
    console.log(newUser);
    res.send('passed');
    }
  });
  

module.exports = router;