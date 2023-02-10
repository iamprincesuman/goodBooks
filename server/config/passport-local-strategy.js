const jwt = require('jsonwebtoken');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

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

module.exports.localRegister = function(){
    try {
        return new localStrategy({
            usernameField : 'username',
            passwordField : 'password',
            session : false,
            passReqToCallback : true
        }, (req, username, password, done) => {
            let user = {
                username : req.body.username,
                avatar : req.body.avatar,
                email : req.body.email,
                password : req.body.password
            };
    
            let salt = Encryption.generateSalt();
            let hashedPassword = Encryption.generateHashedPassword(salt, password);
    
            user.salt = salt;
            user.password = hashedPassword;
    
            let role = ROLE.findOne({name : 'User'});
            user.roles = [role._id];
            let newUser = USER.create(user);
            role.users.push(newUser._id);
            role.save();
            let token = generateToken(newUser);
            let cart = CART.create({user : newUser._id});
            newUser.cart = cart._id;
            newUser.save();
            return done(null, token);
        })
    } catch(error) {
        console.log(error);
        return done(null, false);
    }
}

module.exports.localLogin = function(){
    try {
        return new localStrategy({
            usernameField : 'username',
            passwordField : 'password',
            session : false
        }, (username, password, done) => {

            let user = USER.findOne({username : username});

            if(!user) {
                return done(null, false);
            }

            if(!user.authenticate(password)) {
                return done(null, false);
            }

            let token = generateToken(user);

            return done(null, token);
        });
    } catch(error) {
        console.log(error);
        return;
    }
}