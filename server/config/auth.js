const jwt = require('jsonwebtoken');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const verifyToken = require('../middlewares/token_verification');
const Encryption = require('../middlewares/encryption');
const generateToken = require('../middlewares/token_generation');
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const bookController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

const BOOK = require('../models/Book');
const USER = require('../models/User');
const CART = require('../models/Cart');
const COMMENT = require('../models/Comment')
const RECIEPT = require('../models/Receipt');
const ROLE = require('../models/Role');

const secret = 'q394yu*&^*&YGBjbhjbdb*^&*Y*OY';

module.exports.isAuth = function(req, res, next){
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'You need to be logged in to access this!'
        });
    }

    verifyToken(req).then(() => {
        next();
    }).catch(() => {
        return res.status(401).json({
            message : 'Token Verfication failed!'
        });
    });
}

module.exports.isInRole = function(role){
    return (req, res, next) => {
        if (req.headers.authorization) {
            ROLE.findOne({ name: role }).then((role) => {
                verifyToken(req).then(() => {
                    let isInRole = req.user.roles.indexOf(role.id) !== -1;

                    if (isInRole) {
                        next();
                    } else {
                        return res.status(401).json({
                            message: 'You need to be an admin to access this!'
                        });
                    }
                }).catch(() => {
                    return res.status(401).json({
                        message: 'Token verification failed!'
                    });
                });
            });
        } else {
            return res.status(401).json({
                message: 'You need to be logged in to access this!'
            });
        }
    };
}