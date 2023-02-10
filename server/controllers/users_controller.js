const validator = require('validator');
const passport = require('passport');
const User = require('../models/User');
const Receipt = require('../models/Receipt');

function validateRegisterForm(payload){
    let errors = {};
    let isFormValid = true;

    if(!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)){
        isFormValid = false;
        errors.email = 'please provide a correct email address.';
    }

    if(!payload || typeof payload.password !== 'string' || payload.password.trim().length < 3){
        isFormValid = false;
        errors.password = 'Password must have at least 3 characters.';
    }

    if (!payload || payload.password !== payload.confirmPassword) {
        isFormValid = false;
        errors.passwordsDontMatch = 'Passwords do not match!';
    }

    if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide your name.';
    }

    if (payload.avatar.trim().length !== 0) {
        if (!validator.isURL(payload.avatar)) {
            isFormValid = false;
            errors.avatar = 'Please provide a valid link to your avatar image or leave the field empty.';
        }
    } else {
        if (payload.hasOwnProperty('avatar')) {
            delete payload['avatar'];
        }
    }

    return {
        success: isFormValid,
        errors
    };
}

function validateLoginForm(payload) {
    let errors = {};
    let isFormValid = true;

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid = false;
        errors.password = 'Please provide your password.';
    }

    if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide your name.';
    }

    return {
        success: isFormValid,
        errors
    };
}

function validateAvatarForm(payload) {
    let errors = {};
    let isFormValid = true;

    if (!payload || !validator.isURL(payload.avatar)) {
        isFormValid = false;
        errors.avatar = 'Please provide a valid link to your avatar image.';
    }

    return {
        success: isFormValid,
        errors
    };
}

module.exports.register = function(req, res){
    let validationResult = validateRegisterForm(req.body);
    
    if(!validationResult.success){
        return res.status(400).json({
            message: 'Register form validation failed!',
            errors: validationResult.errors
        })
    }
    // local register ?? 
    passport.authenticate('local-register', (err, token) => {
        if (err || !token) {
            return res.status(400).json({
                message: 'Registration failed!',
                errors: { 'taken': 'Username or email already taken' }
            });
        }

        return res.status(200).json({
            message: 'Registration successful!',
            data: token
        });
    })(req, res);
}

module.exports.login = function(req, res){

    let validationResult = validateLoginForm(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            message: 'Login form validation failed!',
            errors: validationResult.errors
        });
    }

    passport.authenticate('local-login', (err, token) => {
        if (err || !token) {
            return res.status(400).json({
                message: 'Invalid Credentials!'
            });
        }

        return res.status(200).json({
            message: 'Login successful!',
            data: token
        });
    })(req, res);
}

module.exports.getProfile = function(req, res){
    try { 
        let username = req.params.username;
        let user = username.findOne({username : username}).populate('favoriteBooks');
        if(!user){
            return res.status(400).json({
                message : `User ${username} not found in our database`
            });
        }
        let userToSend = {
            id : user.id,
            isAdmin : user.isAdmin,
            username : user.username,
            avatar : user.avatar,
            commentsCount : user.commentsCount,
            favoriteBooks : user.favoriteBooks
        };
        return res.status(200).json({
            message : '',
            data : userToSend
        });

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.getPurchaseHistory = function(req, res){
    let userid = req.user.id;
    let receipts = Receipt.find({user : userId}).sort({creationDate : -1 });

    return res.status(200).json({
        message : '',
        data : receipts
    });
}

module.exports.changeAvatar = function(req, res){
    try {
        let requesterId = req.user.id;
        let requesterIsAdmin = req.user.isAdmin;
        let userToChange = req.body.id;
        let newAvatar = req.body.avatar;
    
        let validationResult = validateAvatarForm(req.body);
    
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Avatar form validation failed!',
                errors: validationResult.errors
            });
        }
    
        if (requesterId !== userToChange && !requesterIsAdmin) {
            return res.status(401).json({
                message: 'You\'re not allowed to change other user avatar!'
            });
        }
        // why update not working ??
        User.update({ _id : userToChange}, {$set: { avatar: newAvatar }});

    } catch(error) {
        console.log(err);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.blockComments = function(req, res){
    try {
        let userId = req.params.userId;
        let user = User.findById(userId);
    
        if(!user) {
            return res.status(400).json({
                message: `User ${user.username} not found in our database`
            });
        }
    
        user.isCommentsBlocked = true;
        user.save();

        res.status(200).json({
            message: `User ${user.username} blocked from posting comments!`
        });

    } catch(error){
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    }
}

module.exports.unblockComments = function(req, res){
    try {
        let userId = req.params.userId;
        let user = User.findById(userId);

        if(!user){
            return res.status(400).json({
                message : `User ${user.username} not found in our database`
            });
        }

        user.isCommentsBlocked = false;
        user.save();

        res.status(200).json({
            message: `User ${user.username} can now post comments!`
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });   
    }
}