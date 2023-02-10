const express = require('express');
const route = express.Router();

const auth = require('../config/auth');
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const bookController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

route.get('/book/search', bookController.search);
route.get('/book/details/:bookId', bookController.getSingle);
route.post('/book/add', auth.isInRole('Admin'), bookController.add); // middlewares to be added
route.put('/book/edit/:bookId', auth.isInRole('Admin'), bookController.edit); // middlewares to be added
route.delete('book/delete/:bookId', auth.isInRole('Admin'), bookController.delete); // middlewares to be added
route.post('/book/rate/:bookId', auth.isAuth, bookController.rate); // middlewares to be added
route.post('/book/addToFavorites/:bookId', auth.isAuth, bookController.addToFavorites); // middlewares to be added

module.exports = route;