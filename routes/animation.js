/**
 * Created by m2tiil on 2/12/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Animation = mongoose.model('Animation');
var Creneaux = mongoose.model('Creneau');
var Option = mongoose.model('Option');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

module.exports = router;

/*
router.get('/animations', function (req, res, next) {
    Post.find(function (err, animations) {
        if (err) {
            return next(err);
        }

        res.json(animations);
    });
});


router.post('/animations', function (req, res, next) {
    var animation = new Animation(req.body);
    //post.author = req.payload.username;


    post.save(function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(animation);
    });
});*/
