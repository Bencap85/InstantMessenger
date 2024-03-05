const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
    
});

const UserModel = mongoose.model("UserModel", UserSchema);

module.exports = UserModel;