const express = require('express');
const route = express.Router();

const auth = require('../config/auth');
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const bookController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

route.get('/search', bookController.search);
route.get('/details/:bookId', bookController.getSingle);
route.post('/add', auth.isInRole('Admin'), bookController.add);
route.put('/edit/:bookId', auth.isInRole('Admin'), bookController.edit); 
route.delete('/delete/:bookId', auth.isInRole('Admin'), bookController.delete); 
route.post('/rate/:bookId', auth.isAuth, bookController.rate); 
route.post('/addToFavorites/:bookId', auth.isAuth, bookController.addToFavorites); 

module.exports = route;