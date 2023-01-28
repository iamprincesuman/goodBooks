const validator = require('validator');
const BOOK = require('../models/Book');
const USER = require('../models/User');
const CART = require('../models/Cart');
const COMMENT = require('../models/Comment')
const RECIEPT = require('../models/Receipt');
const ROLE = require('../models/Role');
const PAGE_LIMIT = 5;

function validateCommentForm(payload) {
    let errors = {};
    let isFormValid = true;

    if (!payload || typeof payload.content !== 'string' || payload.content.trim().length < 3) {
        isFormValid = false;
        errors.content = 'Comment must be more than 3 symbols long.';
    }

    return {
        success: isFormValid,
        errors
    };
}

module.exports.getLatestFiveByUser = async function(req, res){
    try {
        let userId = req.params.userId;
        let comments = await COMMENT.find({user : userId}).populate('book').sort({creationDate : -1}).limit(5);
        return res.status(400).json({
            message : 'OK',
            data : comments
        });
    } catch (error) {
        console.log(err);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.getComments = async function(req, res){
    try {
        let bookId = req.params.bookId;
        let skipCount = !isNaN(Number(req.params.skipCount)) ? Number(req.params.skipCount) : 0;
        let comments = await COMMENT.find({book : bookId})
                              .populate({
                                 path : 'user',
                                 select : 'username avatar'
                               })
                              .sort({creationDate : -1})
                              .skip(skipCount)
                              .limit(PAGE_LIMIT);
        return res.status(400).json({
            message : 'OK',
            data : comments
        });
    } catch (error) {
        console.log(err);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.add = async function(req, res){
    try {
        let bookId = req.params.bookId;
        let userId = req.user.id;
        let comment = req.body.content;

        let validationResult = await validateCommentForm(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Comment form validation failed!',
                errors: validationResult.errors
            });
        }

        let user = await USER.findById(userId);

        if (!user || user.isCommentsBlocked) {
            return res.status(401).json({
                message: 'Sorry, but you\'re not allowed to comment on books'
            });
        }

        let book = await BOOK.findById(bookId);

        if (!book) {
            return res.status(400).json({
                message: 'There is no book with the given id in our database.'
            });
        }

        let newComment = await COMMENT.create({comment : comment});

        book.comments.push(newComment._id);
        newComment.book = book._id;                    
        newComment.user = userId;
        user.commentsCount += 1;
        user.save();
        book.save();
        newComment.save()

        let cmt = await COMMENT.findById(newComment._id)
                        .populate({path : 'user', select : 'username avatar'});
        return res.status(200).json({
            message : 'Comment posted successfully!',
            data : cmt
        });

    } catch (error) {
        console.log(err);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.edit = async function(req, res){
    try {
        let commentId = req.params.commentId;
        let userId = req.user.id;
        let editedComment = req.body.content;

        let validationResult = await validateCommentForm(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Comment form validation failed!',
                errors: validationResult.errors
            });
        }

        let user = await USER.findById(userId);

        if (!user || user.isCommentsBlocked) {
            return res.status(401).json({
                message: 'Sorry, but you\'re not allowed to comment on books'
            });
        }

        let comment = await COMMENT.findById(commentId).populate({ path: 'user', select: 'username avatar' });

        if (!comment) {
            return res.status(400).json({
                message: 'There is no comment with the given id in our database.'
            });
        }

        if (comment.user._id.toString() !== userId && !req.user.isAdmin) {
            return res.status(401).json({
                message: 'You\'re not allowed to edit other user comments!'
            });
        }

        comment.content = editedComment;
        comment.save();

        return res.status(200).json({
            message: 'Comment edited successfully!',
            data: comment
        });

    } catch (error) {
        console.log(err);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.delete = async function(req, res){
    try {
        let commentId = req.params.commentId;
        let userId = req.user.id;

        let comment = await COMMENT.findById(commentId);

        if (!comment) {
            return res.status(400).json({
                message: 'There is no comment with the given id in our database.'
            });
        }

        if (comment.user.toString() !== userId && !req.user.isAdmin) {
            return res.status(401).json({
                message: 'You\'re not allowed to delete other user comments!'
            });
        }

        await COMMENT.findByIdAndRemove(comment._id);

        await BOOK.updateOne({_id : comment.book}, {
            $pull : {
                comments : comment._id
            }
        });

        let user =await USER.findById(req.user.id);
        user.commentsCount -= 1;
        user.save();

        return res.status(200).json({
            message: 'Comment deleted successfully!'   
        });

    } catch (error) {
        console.log(err);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}