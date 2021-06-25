const mongoose = require('mongoose');

const taReportsLogSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    doubtsResolved: {
        type: Number,
        default: 0
    },

    doubtsEscalated: {
        type: Number,
        default: 0
    },

    averageResolvingTime: {
        type: Number,
        default: 0
    },

    doubtsAccepted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doubt'
        }
    ]

}, {
    timestamps: true
});

const TaReportsLog = mongoose.model('TaReportsLog', taReportsLogSchema);
module.exports = TaReportsLog;