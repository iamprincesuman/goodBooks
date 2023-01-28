const express = require('express');
const route = express.Router();
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const booksController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

route.use('/book', require('../routes/book'));
route.use('/user', require('../routes/user'));
route.use('/comment', require('../routes/comment'));
route.use('/cart', require('../routes/cart'));

module.exports = route;