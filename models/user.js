const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    // userType is basically to store whether user is a 'Student' or a 'TA'.
    
    userType: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;