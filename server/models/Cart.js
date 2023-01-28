const mongoose = require('mongoose');

const cart_schema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    books: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Book' 
        }
    ],
    totalPrice: { 
        type: mongoose.Schema.Types.Number, 
        default: 0 
    }
});

const Cart = mongoose.model('Cart', cart_schema);

module.exports = Cart;