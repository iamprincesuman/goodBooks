const mongoose = require('mongoose');

const comment_schema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    book: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book' 
    },
    content: { 
        type: mongoose.Schema.Types.String, 
        required: true 
    },
    creationDate: { 
        type: mongoose.Schema.Types.Date, 
        default: Date.now 
    }
});

const Comment = mongoose.model('Comment', comment_schema);

module.exports = Comment;