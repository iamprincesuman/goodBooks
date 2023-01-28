const mongoose = require('mongoose');

const book_schema = mongoose.Schema({
    title : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    genre : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    year : {
        type : mongoose.Schema.Types.Number,
        required : true
    },
    description : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    cover : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    isbn : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    pagesCount : {
        type : mongoose.Schema.Types.Number,
        required : true
    },
    price : {
        type : mongoose.Schema.Types.Number,
        required : true
    },
    creationDate : {
        type : mongoose.Schema.Types.Date,
        default : Date.now()
    },
    currentRating : {
        type : mongoose.Schema.Types.Number,
        default : 0
    },
    ratingPoints : {
        type : mongoose.Schema.Types.Number,
        default : 0
    },
    ratedCount : {
        type : mongoose.Schema.Types.Number,
        default : 0
    },
    ratedBy : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    purchasesCount : {
        type : mongoose.Schema.Types.Number,
        default : 0
    },
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comments'
        }
    ]
});

book_schema.index({
    title: 'text',
    author: 'text',
    genre: 'text',
    isbn: 'text'
})

const Book = mongoose.model('Book', book_schema);
module.exports = Book;