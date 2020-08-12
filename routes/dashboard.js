const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth");
const Entry = require('../models/entry');

router.get('/', ensureAuthenticated, (req, res) => {
    function next() {
        res.render('dashboard', {
            user:req.user
        })
    };
    ensureAuthenticated(req, res, next)
})

router.get('/entries', ensureAuthenticated, (req, res) => {
    function next() {
        Entry
        .find({user: req.user._id})
        .exec(function(err, entries){
            if(err) throw (err)
            res.render('entries', {
                user:req.user,
                entries: entries
            })
        })
    };
    ensureAuthenticated(req, res, next)
})

router.get('/entries/:entry', ensureAuthenticated, (req, res) => {
    function next() {
        Entry
        .find({EntryId: req.params.entry, user:req.user._id})
        .exec(function(err, entry){
            if(err) throw (err)
            console.log(entry);
            console.log(entry[0])
            res.render('entry',{
                entry:entry[0]
            })
        })
    };
    ensureAuthenticated(req, res, next)
})

router.post('/entries', ensureAuthenticated, (req, res) => {
    function next() {
        const{title, memo, temperature, date} = req.body
        const sampleEntry = new Entry({
            user: req.user._id,
            title,
            memo,
            temperature,
            date     
        })
        sampleEntry
        .save()
        .then(() => {
            req.flash('success_msg', 'You added a new entry!')
            res.redirect('/dashboard/entries')
        })

    };
    ensureAuthenticated(req, res, next)
})

module.exports = router;