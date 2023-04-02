const jwt = require('jsonwebtoken');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const Encryption = require('../middlewares/encryption');
// const generateToken = require('../middlewares/token_generation');
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

const secret = '5b362e2a094b97392c3d7bba';

function generateToken(userInfo) {
    const USER = {
        id: userInfo.id,
        username: userInfo.username,
        avatar: userInfo.avatar,
        isCommentsBlocked: userInfo.isCommentsBlocked,
        isAdmin: userInfo.isAdmin,
        roles: userInfo.roles
    };
    const payload = { sub: USER };

    return jwt.sign(payload, secret, { expiresIn: 604800000 });
}

// why not async await here
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
    
            let salt =  Encryption.generateSalt();
            let hashedPassword =  Encryption.generateHashedPassword(salt, password);
    
            user.salt = salt;
            user.password = hashedPassword;
    
            ROLE.findOne({ name: 'User' }).then((role) => {
                user.roles = [role._id];

                USER.create(user).then((newUser) => {
                    role.users.push(newUser._id);
                    role.save();

                    let token = generateToken(newUser);

                    CART.create({ user: newUser._id }).then((cart) => {
                        newUser.cart = cart._id;
                        newUser.save();
                        return done(null, token);
                    });
                }).catch(() => {
                    return done(null, false);
                });
            });

            /*

                let role =  ROLE.findOne({name : 'User'});
                user.roles = [role._id];
                let newUser =  USER.create(user);
                role.users.push(newUser._id);
                role.save();
                let token =  generateToken(newUser);
                let cart =  CART.create({user : newUser._id});
                newUser.cart = cart._id;
                newUser.save();
                return done(null, token);

            */
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
        }, async (username, password, done) => {

            let user = await USER.findOne({username : username});

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