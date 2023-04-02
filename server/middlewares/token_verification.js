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

const secret = '5b362e2a094b97392c3d7bba';

module.exports.verifyToken = function(req){
    console.log(req);
    // const token = req.headers.authorization.split('')[1];
    const token = req.headers["authorization"];
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if(err) {
                reject();
            }
            req.user = decoded.sub;
            resolve();
        });
    });
}