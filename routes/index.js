var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var mongoose = require('mongoose');

Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Animation = mongoose.model('Animation');
var Creneau = mongoose.model('Creneau');
var Option = mongoose.model('Option');


var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/* GET home page. */
router.get('/', function (req, res, next) {
    Option.find(function (err, options) {
        if (err) {
            return next(err);
        }
    });

    Animation.find(function (err, animations) {
        if (err) {
            return next(err);
        }
        res.render('index', {animations: animations});
    });

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

router.post('/animations', function (req, res, next) {
    var animation = new Animation(req.body);

    animation.save(function (err, animation) {
        if (err) {
            return next(err);
        }
        res.json(animation);
    });
});


//route animation by id

router.param('animation', function (req, res, next, id) {
    var query = Animation.findById(id);

    query.exec(function (err, animation) {
        if (err) {
            return next(err);
        }
        if (!animation) {
            return next(new Error('can\'t find animation'));
        }

        req.animation = animation;
        return next();
    });
});


router.get('/animations/:animation', function (req, res, next) {
    req.animation.populate('options', function (err, animation) {
        if (err) {
            return next(err);
        }

        Creneau.populate(animation,{
            path: 'options.creneaux',
        }, function(err, creneaux){
            if ( err ) return res.json(400, err);
            req.animation.options.creneaux = creneaux;
            res.json(animation);
        });

    });
});

router.get('/users/:user', function (req, res, next) {
    req.user.populate('reservations', function (err, user) {
        if (err) {
            return next(err);
        }

        Option.populate(user,{
            path: 'reservations.option',
        }, function(err, option){
            if ( err ) return res.json(400, err);
            req.user.reservations.option = option;

            Animation.populate(user,{
               path : 'reservations.option.animation',
            }, function(err, animation){
                if ( err ) return res.json(400, err);
                req.user.reservations.option.animation = animation;
                res.json(user);
            });

        });

    });
});

router.post('/animations/:animation/options', auth, function (req, res, next) {
    var option = new Option(req.body);
    option.animation = req.animation;

    option.save(function (err, comment) {
        if (err) {
            return next(err);
        }

        req.animation.options.push(option);
        req.animation.save(function (err, animation) {
            if (err) {
                return next(err);
            }

            res.json(option);
        });
    });
});

router.param('option', function (req, res, next, id) {
    var query = Option.findById(id);

    query.exec(function (err, option) {
        if (err) {
            return next(err);
        }
        if (!option) {
            return next(new Error('can\'t find option'));
        }
        req.option = option;
        return next();
    });
});

router.post('/options/:option/creneaux', auth, function (req, res, next) {
    var creneau = new Creneau(req.body);
    creneau.option = req.option;
    creneau.save(function (err, comment) {
        if (err) {
            return next(err);
        }
        req.option.creneaux.push(creneau);
        req.option.save(function (err, animation) {
            if (err) {
                return next(err);
            }
            res.json(creneau);
        });
    });
});


router.param('creneau', function (req, res, next, id) {
    var query = Creneau.findById(id);

    query.exec(function (err, creneau) {
        if (err) {
            return next(err);
        }
        if (!creneau) {
            return next(new Error('can\'t find creneau'));
        }
        req.creneau = creneau;
        return next();
    });
});

router.param('user', function (req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('can\'t find user'));
        }
        req.user = user;
        return next();
    });
});


router.post('/creneaux/:creneau/users/:user', function(req, res,next){
    var creneau = req.creneau;
    var user = req.user;


    user.reservations.push(creneau);
    creneau.users.push(user);
    user.save(function (err, user) {
        if (err) {
            return next(err);
        }
    });
    creneau.save(function (err, creneau) {
        if (err) {
            return next(err);
        }
    });

});





// LOGIN ROUTES

router.post('/register', function (req, res, next) {
    if (!req.body.nom || !req.body.code) {
        return res.status(400).json({message: 'Veuillez remplir tous les champs !'});
    }

    var user = new User();

    user.nom = req.body.nom;

    user.code = req.body.code;

    user.save(function (err) {
        if (err) {
            return res.status(400).json({message: 'Utilisateur déja existant'});
        }

        return res.json({token: user.generateJWT()})
    });
});


router.post('/login', function (req, res, next) {
    // On est obligé de passer un name pour que l'auth fonctionne
    req.body.nom="name";

    if (!req.body.code) {
        return res.status(400).json({message: 'Veuillez saisir un code'});
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json({message: 'Code incorrect'});
        }
    })(req, res, next);
});




