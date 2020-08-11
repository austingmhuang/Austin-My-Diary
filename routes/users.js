const express = require('express');
const router = express.Router();
const User = require("../models/user")
const bcrypt = require('bcrypt');
const passport = require('passport');
const Entry = require('../models/entry');

router.get('/login', (req, res, next) => {
    res.render('Login');
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];
    console.log(' Name ' + name + ' email :' + email + ' pass:' + password);
    if(!name || !email || !password || !password2){
        errors.push({msg: "Please fill in all fields"})
    }

    if(password !== password2){
        errors.push({msg : "Passwords don't match!"});
    }

    if(password.length < 6){
        errors.push({msg : "Password needs to have atleast 6 characters."})
    }
    if(errors.length > 0){
        res.render('register', {
            errors : errors,
            name : name,
            email : email,
            password : password,
            password2 : password2
        })
    } else {
        User.findOne({email : email}).exec((err, user) => {
            console.log(user);
            if(user) {
                errors.push({msg: 'Email already registered'});
                res.render('register', {errors, name, email, password, password2});
            } else {
                const newUser = new User({
                    name : name,
                    email: email,
                    password : password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt , (err, hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                        .save()
                        .then((value) => {
                            const sampleEntry = new Entry({
                                user: newUser._id,
                                title: "Sample Entry",
                                memo: "Sample Memo",
                                temperature: 36.7       
                            })
                            sampleEntry.save(function (err){
                                if(err) return handleError(err)
                            })

                            // Not sure if I need this
                            Entry.findOne({title: "Sample Entry"})
                            .populate('user')
                            .exec(function(err, entry){
                                if(err) return handleError(err);
                            })
                            
                            console.log(value)
                            req.flash('success_msg', 'You have now registered!')
                            res.redirect('/users/login')
                        })
                        .catch(value => console.log(value))
                    })
                })
            }
        })
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true,
    }) (req, res, next);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Now logged out');
    res.redirect('/users/login');
})
module.exports = router;