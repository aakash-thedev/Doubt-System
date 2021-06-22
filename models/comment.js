const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    comment: {
        type: String,
        required: true
    },

    // Which user has created the comment
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // On which doubt he/she created the comment
    doubt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doubt'
    }

}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;