const mongoose = require('mongoose');
const Encryption = require('../middlewares/encryption');

const user_schema = mongoose.Schema({
    username: { 
        type: mongoose.Schema.Types.String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: mongoose.Schema.Types.String, 
        required: true, 
        unique: true 
    },
    avatar: { 
        type: mongoose.Schema.Types.String, 
        default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fportal.staralliance.com%2Fcms%2Faux-pictures%2Fprototype-images%2Favatar-default.png%2Fimage_view_fullscreen%3FX%3DY&psig=AOvVaw0evwGngNdAktKJryiyO0Fx&ust=1674467799547000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCJC4-OT02vwCFQAAAAAdAAAAABAF' 
    },
    password: { 
        type: mongoose.Schema.Types.String, 
        required: true 
    },
    salt: { 
        type: mongoose.Schema.Types.String, 
        required: true 
    },
    isAdmin: { 
        type: mongoose.Schema.Types.Boolean, 
        default: false 
    },
    isCommentsBlocked: { 
        type: mongoose.Schema.Types.Boolean, 
        default: false 
    },
    commentsCount: { 
        type: mongoose.Schema.Types.Number, 
        default: 0 
    },
    roles: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Role' 
        }
    ],
    cart: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cart' 
    },
    receipts: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Receipt' 
        }
    ],
    favoriteBooks: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Book' 
        }
    ]
});

user_schema.method({
    authenticate: function (password) {
        let hashedPassword = Encryption.generateHashedPassword(this.salt, password);
        if (hashedPassword === this.password) {
            return true;
        }
        return false;
    }
});

const User = mongoose.model('User', user_schema);
module.exports = User;