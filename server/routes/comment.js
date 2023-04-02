const express = require('express');
const route = express.Router();

const auth = require('../config/auth');
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const bookController = require('../controllers/books_controller');
const commentController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller');

route.get('/getLatestFiveByUser/:userId', auth.isAuth, commentController.getLatestFiveByUser); 
route.get('/:bookId/:skipCount', commentController.getComments); 
route.post('/add/:bookId', auth.isAuth, commentController.add); 
route.put('/edit/:commentId', auth.isAuth, commentController.edit); 
route.delete('/delete/:commentId', auth.isAuth, commentController.delete); 

module.exports = route;