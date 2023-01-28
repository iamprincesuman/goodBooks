const express = require('express');
const route = express.Router();
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const booksController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

route.get('/profile/:username', userController.getProfile); // middleware to add
route.get('/purchaseHistory', userController.getPurchaseHistory); // middleware to add
route.get('/changeAvatar', userController.changeAvatar); // middleware to add
route.get('/cart/add/:bookId', cartController.addToCart); // middleware to add
route.get('/cart', cartController.getCart); // middleware to add

route.post('/user/cart/checkout', cartController.checkout); // middleware to add
route.post('register', userController.register); // middleware to add
route.post('/login', userController.login); // middleware to add
route.post('/blockComments/:userId', userController.blockComments); // middleware to add
route.post('/unblockComments/:userId', userController.unblockComments); // middleware to add

route.delete('/user/cart/delete/:bookId', cartController.removeFromCart); // middleware to add

module.exports = route;