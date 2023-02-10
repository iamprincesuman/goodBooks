const express = require('express');
const route = express.Router();

const auth = require('../config/auth');
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const bookController = require('../controllers/books_controller');
const commentController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

route.get('/comment/getLatestFiveByUser/:userId', auth.isAuth, commentController.getLatestFiveByUser); // Middleware
route.get('/comment/:bookId/:skipCount', commentController.getComments); // Middleware
route.post('/comment/add/:bookId', auth.isAuth, commentController.add); // Middleware
route.put('/comment/edit/:commentId', auth.isAuth, commentController.edit); // Middleware
route.delete('/comment/delete/:commentId', auth.isAuth, commentController.delete); // Middleware

module.exports = route;