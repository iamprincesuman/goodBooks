const Role = require('../models/Role');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Encryption = require('./encryption');
const userController = require('../controllers/users_controller');
const cartController = require('../controllers/cart_controller');
const bookController = require('../controllers/books_controller');
const commentsController = require('../controllers/comments_controller');
const errorsController = require('../controllers/errors_controller')

module.exports.init = async function(req, res){
    let role = await Role.findOne({name : 'Admin'});
    if(!role){
        let newRole = await Role.create({name : 'Admin'});
        let salt = await Encryption.generateSalt();
        let passwordHash = await Encryption.generateHashedPassword(salt, 'admin');
        let adminUser = {
            username : 'admin',
            email : 'admin@admin.com',
            salt : salt,
            password : passwordHash,
            isAdmin : true,
            roles : [newRole._id]
        };

        let user = await User.create(adminUser);
        newRole.users.push(user._id);
        newRole.save();

        let cart = await Cart.create({user : user._id});
        user.cart = cart._id;
        user.save();
    }

    role = await Role.findOne({name : 'User'});
    if(!role){
        let newRole = await Role.create({ name : 'User'});
        let salt = await Encryption.generateSalt();
        let passwordHash = await Encryption.generateHashedPassword(salt, '123');
        let newUser = {
            username : 'princesuman',
            email : 'princesuman2211@gmail.com',
            salt : salt,
            password : passwordHash,
            roles : [newRole._id]
        };
        let nu = await User.create(newUser);
        newRole.users.push(nu._id);
        newRole.save();
        let cart = await Cart.create({ user : nu._id});
        nu.cart = cart._id;
        nu.save();
    };
}