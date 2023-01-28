const express = require('express');
const route = express.Router();
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const bookController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

route.get('/book/search', bookController.search);
route.get('/book/details/:bookId', bookController.getSingle);
route.post('/book/add', bookController.add); // middlewares to be added
route.put('/book/edit/:bookId', bookController.edit); // middlewares to be added
route.delete('book/delete/:bookId', bookController.delete); // middlewares to be added
route.post('/book/rate/:bookId', bookController.rate); // middlewares to be added
route.post('/book/addToFavorites/:bookId', bookController.addToFavorites); // middlewares to be added

module.exports = route;