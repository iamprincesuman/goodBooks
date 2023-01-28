const mongoose = require('mongoose');

const receipt_schema = mongoose.Schema({
    user: { 
        type: OBJECT_ID, 
        ref: 'User' 
    },
    productsInfo: [],
    totalPrice: { 
        type: mongoose.Schema.Types.Number, 
        default: 0 
    },
    creationDate: { 
        type: mongoose.Schema.Types.Date, 
        default: Date.now 
    }
});

const Receipt = mongoose.model('Receipt', receipt_schema);

module.exports = Receipt;