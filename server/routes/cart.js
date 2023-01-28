const express = require('express');
const route = express.Router();
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const booksController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

route.get('/cart/getSize', cartController.getCartSize);

module.exports = route;