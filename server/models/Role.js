const mongoose = require('mongoose');
const User = mongoose.model('User');
const Cart = mongoose.model('Cart');
const Encryption = require('../middlewares/encryption');

const role_schema = mongoose.Schema({
    name: { 
        type: mongoose.Schema.Types.String, 
        required: true, 
        unique: true 
    },
    users: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    ]
});

const Role = mongoose.model('Role', role_schema);

module.exports = Role;