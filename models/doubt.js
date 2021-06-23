const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    isResolved: {
        type: Boolean,
        default: false
    },

    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    resolvedAnswer: {
        type: String
    },

    doubtResolutionTime: {
        type: Number,
        default: 0
    },

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],

}, {
    timestamps: true
});

const Doubt = mongoose.model('Doubt', doubtSchema);
module.exports = Doubt;