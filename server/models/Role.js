const mongoose = require('mongoose');
const User = mongoose.model('User');
const Cart = mongoose.model('Cart');
const ENCRYPTION = require('../middlewares/encryption');

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

module.exports.init = () => {
    Role.findOne({ name: 'Admin' }).then((role) => {
        if (!role) {
            Role.create({ name: 'Admin' }).then((newRole) => {
                let salt = ENCRYPTION.generateSalt();
                let passwordHash = ENCRYPTION.generateHashedPassword(salt, 'admin');
                let adminUser = {
                    username: 'admin',
                    email: 'admin@admin.com',
                    salt: salt,
                    password: passwordHash,
                    isAdmin: true,
                    roles: [newRole._id]
                };

                User.create(adminUser).then((user) => {
                    newRole.users.push(user._id);
                    newRole.save();

                    Cart.create({ user: user._id }).then((cart) => {
                        user.cart = cart._id;
                        user.save();
                    });
                });
            });
        }
    });

    Role.findOne({ name: 'User' }).then((role) => {
        if (!role) {
            Role.create({ name: 'User' }).then((newRole) => {
                let salt = ENCRYPTION.generateSalt();
                let passwordHash = ENCRYPTION.generateHashedPassword(salt, '123');
                let newUser = {
                    username: 'princesuman',
                    email: 'princesuman2211@gmail.com',
                    salt: salt,
                    password: passwordHash,
                    roles: [newRole._id]
                };

                User.create(newUser).then((nu) => {
                    newRole.users.push(nu._id);
                    newRole.save();
                    Cart.create({ user: nu._id }).then((cart) => {
                        nu.cart = cart._id;
                        nu.save();
                    });
                });
            });
        }
    });
};

/*
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
    }
}
*/