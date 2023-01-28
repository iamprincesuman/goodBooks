const validator = require('validator');
const BOOK = require('../models/Book');
const USER = require('../models/User');
const CART = require('../models/Cart');
const COMMENT = require('../models/Comment')
const RECIEPT = require('../models/Receipt');
const ROLE = require('../models/Role');
const User = require('../models/User');
const PAGE_LIMIT = 15;

module.exports.getCartSize = async function(req, res){
    try {
        let userId = req.user.id;
        let cart = await CART.findOne({user : userId});
        return res.status(200).json({
            message : '',
            data : cart.books.length
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.getCart = async function(req, res){
    try {
        let userId = req.user.id;
        let cart = await CART.findOne({user : userId}).populate('books');
        return res.status(200).json({
            message : 'Ok',
            data : cart
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.addToCart = async function(req, res){
    try {
        let userId = req.user.id;
        let bookId = req.params.bookId;
        let book = await BOOK.findById(bookId);
        if(!book) {
            return res.status(400).json({
                message : 'No Book in db'
            })
        }
        let cart = await CART.findOne({user : userId});

        let bookIds = [];

        for (let b of cart.books) {
            bookIds.push(b.toString());
        }

        if (bookIds.indexOf(bookId) !== -1) {
            return res.status(400).json({
                message: 'Book is already in your cart'
            });
        }

        cart.books.push(bookId);
        cart.totalPrice += book.price;
        cart.save();

        return res.status(200).json({
            message: 'Book added to cart!',
            data: cart
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.removeFromCart = async function(req, res){
    try {
        let userId = req.user.id;
        let bookId = req.params.bookId;
        let book = await BOOK.findById(bookId);

        if (!book) {
            return res.status(400).json({
                message: 'There is no book with the given id in our database.'
            });
        }

        let cart = await CART.findOne({user : userId});

        cart.books = cart.books
            .map(b => b.toString())
            .filter(b => b !== bookId);
        cart.totalPrice -= book.price;
        cart.save();

        return res.status(200).json({
            message : 'Book removed from cart!',
            data : cart
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.checkout = async function(req, res){
    try {
        let userId = req.user.id;
        let totalPrice = 0;
        let products = [];
        let cart = await CART.findOne({user : userId}).populate('books');

        for (let book of cart.books) {
            totalPrice += book.price * req.body[book._id.toString()];
            products.push({
                id: book._id,
                title: book.title,
                author: book.author,
                cover: book.cover,
                price: book.price,
                qty: req.body[book._id.toString()]
            });
        }
        // may not workout
        let receipt = await RECIEPT.create({
            user : userId,
            productsInfo: products,
            totalPrice: totalPrice
        });
        // why this update error
        await USER.update({_id : userId}, {
            $push : {
                receipts: receipt._id
            }
        });

        cart.books = [];
        cart.totalPrice = 0;
        cart.save();

        return res.status(200).json({
            message: 'Thank you for your order! Books will be sent to you as soon as possible!',
            data: receipt
        });
        // till here
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}