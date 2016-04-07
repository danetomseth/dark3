'use strict';

var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');

router.post('/login', function(req, res, next) {
	var password = req.body.password;
	console.log('pass',password);
    User.findOne(req.body).exec()
        .then(function(user) {
            if (!user || !user.correctPassword(password)) {
                done(null, false);
            } else {
                // Properly authenticated.
                done(null, user);
                req.login(user, function() {
                    res.json(user);
                });
            }


        })
        .then(null, next);
});

router.post('/signup', function(req, res, next) {
    User.create(req.body)
        .then(function(user) {
            req.login(user, function() {
                res.status(201).json(user);
            });
        })
        .then(null, next);
});

router.get('/me', function(req, res, next) {
    res.json(req.user);
});

router.delete('/me', function(req, res, next) {
    req.logout();
    res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;