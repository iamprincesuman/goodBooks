const jwt = require('jsonwebtoken');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const ROLE = require('../models/Role');
const Encryption = require('../middlewares/encryption');
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const bookController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

const secret = 'q394yu*&^*&YGBjbhjbdb*^&*Y*OY';

module.exports.verifyToken = function(req){
    const token = req.headers.authorization.split('')[1];

    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if(err) reject();

            req.user = decoded.sub;
            resolve();
        });
    });
}