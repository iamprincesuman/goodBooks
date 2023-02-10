const express = require('express');
const route = express.Router();

const auth = require('../config/auth');
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const booksController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

route.get('/profile/:username', auth.isAuth, userController.getProfile); // middleware to add
route.get('/purchaseHistory', auth.isAuth, userController.getPurchaseHistory); // middleware to add
route.get('/changeAvatar', auth.isAuth, userController.changeAvatar); // middleware to add
route.get('/cart/add/:bookId', auth.isAuth, cartController.addToCart); // middleware to add
route.get('/cart', auth.isAuth, cartController.getCart); // middleware to add

route.post('/user/cart/checkout', auth.isAuth, cartController.checkout); // middleware to add
route.post('/register', userController.register); // middleware to add
route.post('/login', userController.login); // middleware to add
route.post('/blockComments/:userId', auth.isInRole('Admin'), userController.blockComments); // middleware to add
route.post('/unblockComments/:userId', auth.isInRole('Admin'), userController.unblockComments); // middleware to add

route.delete('/user/cart/delete/:bookId', auth.isAuth, cartController.removeFromCart); // middleware to add

module.exports = route;