const jwt = require('jsonwebtoken');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const Encryption = require('../middlewares/encryption');
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const bookController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

const secret = 'q394yu*&^*&YGBjbhjbdb*^&*Y*OY';

module.exports.generateToken = function(userInfo) {
    const user = {
        id: userInfo.id,
        username: userInfo.username,
        avatar: userInfo.avatar,
        isCommentsBlocked: userInfo.isCommentsBlocked,
        isAdmin: userInfo.isAdmin,
        roles: userInfo.roles
    };
    const payload = { sub: user };

    return jwt.sign(payload, secret, { expiresIn: 604800000 });
}