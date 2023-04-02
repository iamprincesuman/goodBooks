const express = require('express');
const route = express.Router();

const auth = require('../config/auth');
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const booksController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

route.post('/register', userController.register); 
route.post('/login', userController.login); 
route.get('/profile/:username', auth.isAuth, userController.getProfile); 
route.get('/purchaseHistory', auth.isAuth, userController.getPurchaseHistory); 
route.post('/changeAvatar', auth.isAuth, userController.changeAvatar); 
route.post('/blockComments/:userId', auth.isInRole('Admin'), userController.blockComments);
route.post('/unblockComments/:userId',auth.isInRole('Admin'), userController.unblockComments); 

route.get('/cart', auth.isAuth, cartController.getCart); 
route.post('/cart/add/:bookId', auth.isAuth, cartController.addToCart); 
route.delete('/cart/delete/:bookId', auth.isAuth, cartController.removeFromCart); 
route.post('/cart/checkout', auth.isAuth, cartController.checkout); 

module.exports = route;