var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var mongoose = require('mongoose');

Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Animation = mongoose.model('AnimationBateau');
var Creneaux = mongoose.model('Creneau');
var Option = mongoose.model('Option');


var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

module.exports = router;

/* Get Posts route */

// POSTS ROUTES

router.get('/animations', function (req, res, next) {
    Animation.find(function (err, animations) {
        if (err) {
            return next(err);
        }

        res.json(animations);
    });
});

router.post('/animations', auth, function (req, res, next) {
    var animation = new Animation(req.body);
   


    animation.save(function (err, animation) {
        if (err) {
            return next(err);
        }
        console.log(Animation.findOne());
        res.json(animation);
    });
});

router.param('post', function (req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error('can\'t find post'));
        }

        req.post = post;
        return next();
    });
});

router.get('/posts/:post', function (req, res, next) {
    req.post.populate('comments', function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

router.put('/posts/:post/upvote', auth, function (req, res, next) {
    req.post.upvote(function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

// COMENTS ROUTES

router.param('comment', function (req, res, next, id) {
    var query = Comment.findById(id);
    query.exec(function (err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return next(new Error('can\'t find comment'));
        }

        req.comment = comment;
        return next();
    });
});

router.get('/posts/:post/comments', function (req, res, next) {
    Comment.find(function (err, comments) {
        if (err) {
            return next(err);
        }

        res.json(comments);
    });
});

router.post('/posts/:post/comments', auth, function (req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.nom;

    comment.save(function (err, comment) {
        if (err) {
            return next(err);
        }

        req.post.comments.push(comment);
        req.post.save(function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(comment);
        });
    });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function (req, res, next) {
    req.comment.upvote(function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

// LOGIN ROUTES

router.post('/register', function (req, res, next) {
    if (!req.body.nom || !req.body.code) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.nom = req.body.nom;

    user.code = req.body.code;

    user.save(function (err) {
        if (err) {
            return res.status(400).json({message: 'Username Already Used'});
        }

        return res.json({token: user.generateJWT()})
    });
});


router.post('/login', function (req, res, next) {
    console.log("body parsing", req.body);
    if (!req.body.nom || !req.body.code) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        console.log(err);
        if (user) {
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});


