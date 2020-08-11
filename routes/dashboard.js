const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth");
const Entry = require('../models/entry');
let userId;

router.get('/entries', ensureAuthenticated, (req, res) => {
    function next() {
        userId = req.user_id;
        Entry
        .find({user: req.user._id})
        .exec(function(err, entries){
            if(err) return handleError(err)
            res.render('entries', {
                user:req.user,
                entries: entries
            })
        })
    };
    console.log(userId);
    ensureAuthenticated(req, res, next)
})

router.post('/entries', ensureAuthenticated, (req, res) => {
    function next() {
        const{title, memo, temperature, date} = req.body
        const sampleEntry = new Entry({
            user: userId,
            title,
            memo,
            temperature,
            date     
        })
        sampleEntry.save(function (err){
            if(err) return handleError(err)
        })      
    };
    ensureAuthenticated(req, res, next)
})

module.exports = router;